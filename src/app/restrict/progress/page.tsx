import DefaultLayout from '@/_components/layout/defaultLayout';
import { ProgressTabs } from '@/_components/progress/progressTabs';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import {
  parseProgressTab,
  progressPanelId,
  progressTabId,
} from '@/_lib/progressTabs';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import { FotosTab } from './fotosTab';
import { MedidasTab } from './medidasTab';

export const metadata: Metadata = {
  title: PAGE_TITLES.progress,
};

interface ProgressPageProps {
  searchParams: Promise<{
    tab?: string | string[];
    semanas?: string | string[];
    angle?: string | string[];
    compareA?: string | string[];
    compareB?: string | string[];
  }>;
}

export default async function ProgressPage({
  searchParams,
}: ProgressPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const params = await searchParams;
  const tab = parseProgressTab(params.tab);

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4 pb-[calc(var(--bottom-nav-h,4.5rem)+env(safe-area-inset-bottom,0px)+5rem)] md:pb-0">
        <header className="border-b border-primary pb-3">
          <h1 className="text-2xl font-semibold">Minha evolução</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas medidas e fotos de progresso ao longo do tempo.
          </p>
        </header>

        <ProgressTabs selected={tab} />

        <div
          role="tabpanel"
          id={progressPanelId(tab)}
          aria-labelledby={progressTabId(tab)}
          tabIndex={0}
          className="focus-visible:outline-hidden"
        >
          {tab === 'medidas' ? (
            <MedidasTab semanas={params.semanas} />
          ) : (
            <FotosTab
              searchParams={{
                angle: params.angle,
                compareA: params.compareA,
                compareB: params.compareB,
              }}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
