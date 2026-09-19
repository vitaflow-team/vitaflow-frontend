import { apiClient } from '@/_lib/apiClient';
import { stripe } from '@/_lib/stripe';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

// Server-to-server only — Stripe calls this directly, there is no user
// session. Trust comes from the signature, verified against the raw body
// below, never from anything else in the request.
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook not configured.' },
      { status: 500 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    // Returning 500 makes Stripe retry the delivery — appropriate for a
    // transient failure (our backend briefly unreachable, etc).
    console.error(`Error handling Stripe webhook ${event.type}:`, error);
    return NextResponse.json({ error: 'Sync failed.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (session.mode !== 'subscription' || !session.subscription) {
    return;
  }

  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription.id;

  if (!customerId) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price?.id ?? null;

  await syncSubscription({
    stripeCustomerId: customerId,
    userId: session.metadata?.userId,
    stripePriceId: priceId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionCancelAt: subscription.cancel_at,
  });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;
  const priceId = subscription.items.data[0]?.price?.id ?? null;

  await syncSubscription({
    stripeCustomerId: customerId,
    userId: subscription.metadata?.userId,
    stripePriceId: priceId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionCancelAt: subscription.cancel_at,
  });
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

  await syncSubscription({
    stripeCustomerId: customerId,
    userId: subscription.metadata?.userId,
    stripePriceId: null,
    stripeSubscriptionId: null,
    subscriptionStatus: 'canceled',
    subscriptionCancelAt: null,
  });
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription === 'string'
      ? invoice.parent.subscription_details.subscription
      : invoice.parent?.subscription_details?.subscription?.id;

  if (!subscriptionId) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;
  const priceId = subscription.items.data[0]?.price?.id ?? null;

  await syncSubscription({
    stripeCustomerId: customerId,
    userId: subscription.metadata?.userId,
    stripePriceId: priceId,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionCancelAt: subscription.cancel_at,
  });
}

interface SyncPayload {
  stripeCustomerId: string;
  userId?: string;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string;
  subscriptionCancelAt: number | null;
}

async function syncSubscription(payload: SyncPayload): Promise<void> {
  await apiClient('/users/subscription/sync', {
    method: 'PATCH',
    body: JSON.stringify({
      stripeCustomerId: payload.stripeCustomerId,
      userId: payload.userId,
      stripePriceId: payload.stripePriceId,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      subscriptionStatus: payload.subscriptionStatus,
      subscriptionCancelAt: payload.subscriptionCancelAt
        ? new Date(payload.subscriptionCancelAt * 1000).toISOString()
        : null,
    }),
  });
}
