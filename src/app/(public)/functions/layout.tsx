import { NavLink } from '@/_components/layout/navLink';

export default function FunctionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full h-full">
      <nav
        aria-label="Perfis"
        className="flex flex-row gap-1 w-full my-2 p-1 rounded-lg bg-(--background-secondary) items-center justify-center md:justify-start md:w-fit"
      >
        <NavLink exact url="/functions">
          Educadores físicos
        </NavLink>
        <NavLink exact url="/functions/nutritionists">
          Nutricionistas
        </NavLink>
        <NavLink exact url="/functions/users">
          Usuários
        </NavLink>
      </nav>

      <div className="w-full">{children}</div>
    </div>
  );
}
