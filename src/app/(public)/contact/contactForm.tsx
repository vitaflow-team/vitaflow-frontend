'use client';

import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { Textarea } from '@/_components/ui/textarea';
import { contactFormData, contactSchema } from '@/_schema/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export function ContactForm() {
  const methods = useForm<contactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // TODO: o envio ainda não está implementado — a mensagem não é enviada a lugar
  // nenhum hoje. Ligar a uma action real (e-mail/CRM) antes de publicar.
  function submitContact({ name, email, subject, message }: contactFormData) {}

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-[url('/backgroundLogo.svg')] items-center justify-start bg-cover bg-no-repeat bg-right gap-2">
      <div className="flex flex-col gap-6 w-full py-3 md:py-5 justify-center items-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
        <h1 className="flex flex-col font-bold text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl">
          Entre em contato com a Vita Flow
        </h1>
        <p className="flex flex-col italic text-sm md:text-base lg:text-lg 2xl:text-xl text-muted-foreground">
          Fale com nossa equipe e descubra como a Vita Flow pode impulsionar
          seus resultados.
        </p>
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
                    <FormLabel>Nome:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail:</FormLabel>
                    <FormControl>
                      <Input {...field} icon={Mail} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assunto:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="h-40">
                    <FormLabel>Mensagem:</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        className="h-32 bg-background"
                        {...field}
                      />
                    </FormControl>
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
            {/* TODO: número de WhatsApp real — "5549vitaflow" não é um número válido,
                o link abaixo não funciona. Trocar pelo número real em formato
                55DDNÚMERO (ex.: 5549991234567) antes de publicar. */}
            <Link
              href="https://wa.me/55SEUNUMEROAQUI?text=Oi! Pode me ajudar?"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex gap-2 items-center">
                <Image src="/whatsapp.svg" width={50} height={50} alt="" />
                <span className="text-base font-bold">
                  (49) 99999-0000 · WhatsApp
                </span>
              </div>
            </Link>

            <Link
              href="https://www.instagram.com/vitaflowapp/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex gap-2 items-center">
                <Image src="/instagram.svg" width={50} height={50} alt="" />
                <span className="text-base font-bold">@vitaflowapp</span>
              </div>
            </Link>

            {/* TODO: endereço real da empresa — os campos abaixo ainda têm texto de
                exemplo ("Bairro onde fica a VitaFlow"), preencher antes de publicar. */}
            <div className="flex flex-col w-full text-base mt-4 items-center justify-center">
              <span>R. Escritório da Vita Flow, 234</span>
              <span>São Miguel do Oeste - SC</span>
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
            alt="Equipe da Vita Flow pronta para atender"
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
