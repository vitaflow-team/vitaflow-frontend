import { PublicFooter } from '@/_components/layout/publicFooter';
import { PublicNav } from '@/_components/layout/publicNav';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <PublicNav />
      <main
        id="main-content"
        className="flex flex-col h-full px-2 xl:px-10 2xl:px-36"
      >
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
