import {
  Apple,
  Activity,
  ChartNoAxesCombined,
  Dumbbell,
  Home,
  Library,
  Search,
  Settings,
  User2,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

export interface AppRoute {
  TITLE: string;
  /** Rótulo curto usado onde não cabe o título inteiro (barra inferior). */
  SHORT_TITLE?: string;
  URL: string;
  ICON: LucideIcon;
  PRODUCT_TYPE: string[];
}

const PRIVATE: AppRoute[] = [
  {
    TITLE: 'Início',
    URL: '/restrict',
    ICON: Home,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    TITLE: 'Pessoas',
    URL: '/restrict/clients',
    ICON: User2,
    PRODUCT_TYPE: ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    TITLE: 'Treinos',
    URL: '/restrict/workouts',
    ICON: Dumbbell,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    TITLE: 'Minha evolução',
    SHORT_TITLE: 'Evolução',
    URL: '/restrict/progress',
    ICON: ChartNoAxesCombined,
    // Um plano profissional inclui os direitos do Premium pessoal, então a
    // evolução própria vale para os três tipos. O acesso é dado aqui, em dado,
    // e não em regra espalhada: menus e middleware leem esta mesma lista
    // (ADR-006).
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    // Por último de propósito: a barra inferior mostra no máximo cinco
    // destinos, e entrar antes cortaria "Evolução" de quem é profissional. O
    // catálogo segue no menu lateral para todos.
    TITLE: 'Exercícios',
    URL: '/restrict/exercises',
    ICON: Library,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    // Também por último, mesma razão do item anterior.
    TITLE: 'Diário Alimentar',
    SHORT_TITLE: 'Diário',
    URL: '/restrict/food-diary',
    ICON: UtensilsCrossed,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    // Também por último, mesma razão dos dois itens acima: recurso novo,
    // barra inferior já apertada. Visível aos três tipos — a busca e a
    // solicitação de conexão não têm restrição de tipo de conta (PRD
    // Business Rules), e um profissional também usa as abas de solicitação.
    TITLE: 'Buscar profissional',
    SHORT_TITLE: 'Buscar',
    URL: '/restrict/professionals',
    ICON: Search,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    // Também por último, mesma razão dos itens acima. Visível aos três tipos:
    // o backend não restringe por tipo de conta (qualquer conta pode ter um
    // Client vinculado a um profissional), mesma lógica de "Buscar
    // profissional".
    TITLE: 'Minha nutricionista',
    SHORT_TITLE: 'Nutricionista',
    URL: '/restrict/nutritionist',
    ICON: Apple,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
  {
    // Também por último, mesma razão do item anterior.
    TITLE: 'Meu educador físico',
    SHORT_TITLE: 'Educador',
    URL: '/restrict/physical-educator',
    ICON: Activity,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
];

// Configurações fica fora de PRIVATE de propósito: a governança de acesso
// (middleware/routeAccess) lê PRIVATE, e mover a rota para lá mudaria quem
// governa /restrict/settings. O menu monta o grupo "Conta" a partir daqui.
const ACCOUNT: AppRoute[] = [
  {
    TITLE: 'Configurações',
    SHORT_TITLE: 'Conta',
    URL: '/restrict/settings',
    ICON: Settings,
    PRODUCT_TYPE: ['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR'],
  },
];

export const APP_ROUTES = {
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_IN_ACTIVATE: '/signin/activate',
  SIGN_UP: '/signup',
  ROUTE_PRIVATE: '/restrict',
  USER_SETTINGS: '/restrict/settings',
  // Rotas do app liberadas para qualquer conta autenticada, independentemente do
  // tipo de produto. É a mesma lista que o middleware usa para pular a checagem
  // de acesso, e por isso também define o que o menu mostra para um usuário sem
  // tipo de produto: Início e Configurações.
  EXCLUDED_ROUTES: ['/restrict', '/restrict/settings'],
  PRIVATE,
  ACCOUNT,
};
