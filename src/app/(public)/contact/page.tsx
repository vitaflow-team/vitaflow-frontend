import type { Metadata } from 'next';
import { ContactForm } from './contactForm';

export const metadata: Metadata = {
  title: 'Fale com a Vita Flow',
  description:
    'Fale com a equipe da Vita Flow por WhatsApp, Instagram ou pelo formulário de contato.',
};

export default function Contact() {
  return <ContactForm />;
}
