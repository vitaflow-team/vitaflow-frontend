export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col max-w-full h-full">
      <div className="flex flex-row max-w-full w-full gap-20 h-full">
        <div className="relative flex flex-col max-w-full w-full gap-2 pt-2 h-full pb-6">
          {children}
        </div>
      </div>
    </main>
  );
}
