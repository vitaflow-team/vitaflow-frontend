'use client';

import { Logo } from '@/_components/layout/logo';
import { NavLink } from '@/_components/layout/navLink';
import { Button } from '@/_components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/_components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
  { url: '/', label: 'Home' },
  { url: '/functions', label: 'Funcionalidades' },
  { url: '/contact', label: 'Contato' },
  { url: '/signin', label: 'Login' },
];

export function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 border-b border-secondary bg-background/90 backdrop-blur px-2 py-2 xl:px-10 2xl:px-36">
      <Logo className="w-36 md:w-48" />

      <nav
        aria-label="Navegação principal"
        className="hidden md:flex items-center gap-1"
      >
        {NAV_ITEMS.map(item => (
          <NavLink key={item.url} url={item.url}>
            {item.label}
          </NavLink>
        ))}
        <Link href="/signup" className="ml-2">
          <Button size="sm">Comece agora</Button>
        </Link>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0">
          <SheetHeader className="border-b border-secondary">
            <Logo className="w-32" />
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          </SheetHeader>
          <nav
            aria-label="Navegação principal"
            className="flex flex-col gap-1 p-4"
          >
            {NAV_ITEMS.map(item => (
              <SheetClose key={item.url} asChild>
                <NavLink url={item.url}>{item.label}</NavLink>
              </SheetClose>
            ))}
            <SheetClose asChild>
              <Link href="/signup" className="mt-2">
                <Button className="w-full">Comece agora</Button>
              </Link>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
