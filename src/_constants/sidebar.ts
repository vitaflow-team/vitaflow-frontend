/**
 * Nome do cookie em que o primitivo da barra lateral grava recolhida/expandida.
 *
 * Mora fora de `ui/sidebar.tsx` de propósito: aquele arquivo é `'use client'`, e
 * uma constante importada de um módulo cliente chega ao Server Component como
 * referência de cliente, não como string — `cookies().get()` nunca acharia o
 * cookie e a barra voltaria sempre expandida (ADR-007).
 */
export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
