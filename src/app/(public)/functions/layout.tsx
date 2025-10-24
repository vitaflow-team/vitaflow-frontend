import { NavLink } from '@/_components/layout/navLink';

export default function FunctionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row w-full h-full md:gap-4">
      <div className="flex flex-row md:flex-col md:my-2 w-full md:w-80 gap-2 border-b-[1px] md:border-b-0 md:border-r-[1px] border-secondary px-2 pb-2 md:pb-0 items-center md:items-start justify-center md:justify-start">
        <NavLink exact url="/functions">
          Educadores físicos
        </NavLink>
        <NavLink exact url="/functions/nutritionists">
          Nutricionistas
        </NavLink>
        <NavLink exact url="/functions/users">
          Usuários
        </NavLink>
      </div>

      <div className="w-full md:mx-6">{children}</div>
    </div>
  );
}
