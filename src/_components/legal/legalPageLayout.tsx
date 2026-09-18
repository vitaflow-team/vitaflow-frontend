interface TocItem {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  title: string;
  updatedAt: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  updatedAt,
  toc,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto py-6 md:py-10 gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Última atualização: {updatedAt}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
        <nav
          aria-label="Sumário"
          className="flex flex-col gap-1 bg-secondary/30 md:bg-transparent rounded-md p-4 md:p-0 md:sticky md:top-20"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Sumário
          </span>
          {toc.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-7 min-w-0">{children}</div>
      </div>
    </div>
  );
}

interface LegalSectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({
  id,
  number,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-2 scroll-mt-20">
      <h2 className="text-base font-bold flex items-baseline gap-2">
        <span className="font-mono text-xs font-semibold text-icon-accent">
          {number}
        </span>
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed [&_strong]:font-semibold [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5 [&_ul]:list-disc">
        {children}
      </div>
    </section>
  );
}
