export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col w-full h-full">
      <div className="flex flex-row w-full items-center justify-center gap-20">
        <div className="flex flex-col w-full gap-2 md:gap-4 pt-2">
          {children}
        </div>
      </div>
    </main>
  );
}
