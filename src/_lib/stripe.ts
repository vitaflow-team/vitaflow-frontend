import 'server-only';

import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  typescript: true,
  apiVersion: '2025-12-15.clover',
});
