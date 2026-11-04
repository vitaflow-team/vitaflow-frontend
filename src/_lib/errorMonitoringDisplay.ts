import type { ErrorMonitoringApp } from '@/_types/errorMonitoringApp';

export function appLabel(app: ErrorMonitoringApp): string {
  return app === 'backend' ? 'vitaflow-backend' : 'vitaflow-frontend';
}

export function formatMoment(value: string): string {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
