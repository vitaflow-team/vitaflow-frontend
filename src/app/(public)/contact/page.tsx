'use client';

import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { Textarea } from '@/_components/ui/textarea';
import { contactFormData, contactSchema } from '@/_schema/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function Contact() {
  const methods = useForm<contactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  function submitContact({ name, email, subject, message }: contactFormData) {}

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
      <div className="flex flex-col gap-6 w-full py-3 md:py-5 justify-center items-center">
        <div className="flex flex-col font-bold text-xl md:text-3xl lg:text-5xl 2xl:text-7xl">
          <span>Entre em contato com o VitaFlow</span>
        </div>
        <div className="flex flex-col italic text-sm md:text-xl lg:text-2xl 2xl:text-3xl">
          <span>
            Fale com nossa equipe e descubra como o VitaFlow pode impulsionar
            seus resultados.
          </span>
        </div>
        <div className="flex flex-col lg:flex-row-reverse w-full px-4 md:px-0 gap-4">
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(submitContact)}
              className="flex flex-col w-full md:w-3/5"
            >
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Informe seu nome"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Informe seu e-mail"
                        {...field}
                        icon={Mail}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="subject"
                        placeholder="Informe o assunto"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="h-40">
                    <FormControl>
                      <Textarea
                        id="message"
                        placeholder="Informe a mensagem"
                        rows={6}
                        className="h-32 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-end">
                <Button type="submit" className="w-full sm:w-48">
                  Enviar mensagem
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex flex-col justify-center italic text-base lg:text-2xl 2xl:text-3xl w-full lg:w-2/5 lg:min-h-full gap-3">
            <Link
              href="https://wa.me/5549vitaflow?text=Oi! Pode me ajudar?"
              target="_blank"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src="/whatsapp.svg"
                  width={50}
                  height={50}
                  alt="WhatsApp"
                />
                <label className="text-base font-bold">telefone vitaflow</label>
              </div>
            </Link>

            <Link href="https://www.instagram.com/VitaFlow/" target="_blank">
              <div className="flex gap-2 items-center">
                <Image
                  src="/instagram.svg"
                  width={50}
                  height={50}
                  alt="Instagram"
                />
                <label className="text-base font-bold">
                  Instagram VitaFlow
                </label>
              </div>
            </Link>

            <div className="flex flex-col w-full text-base mt-4 items-center justify-center">
              <label>R. Escritório da VitaFlow, 234</label>
              <label>Bairro onde fica a VitaFlow</label>
              <label>São Miguel do Oeste - SC</label>
            </div>

            <div className="flex px-4 w-full h-28 items-center justify-center">
              <span className="italic text-center text-md md:text-2xl w-full">
                Juntos, construímos uma jornada de saúde mais conectada e
                eficiente.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col py-3 w-full md:w-[40%] items-center justify-center h-max">
        <div className="relative w-[90%] min-h-80 md:min-h-132">
          <Image
            src="/contact.png"
            alt="Contact Us"
            fill
            style={{
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              borderRadius: '1.5rem',
              minHeight: '250px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
