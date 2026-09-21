export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Um <div>, não um <main>: o layout do app já expõe o marco principal em
  // #main-content e aninhar <main> dentro de <main> não é HTML válido.
  return (
    <div className="flex flex-col max-w-full h-full">
      <div className="flex flex-row max-w-full w-full gap-20 h-full">
        <div className="relative flex flex-col max-w-full w-full gap-2 pt-2 h-full pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
