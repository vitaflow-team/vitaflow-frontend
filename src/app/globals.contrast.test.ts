import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const CSS = readFileSync(
  fileURLToPath(new URL('./globals.css', import.meta.url)),
  'utf8'
);

/**
 * O bloco claro é o `:root` de primeiro nível; o escuro é o `:root` aninhado em
 * `@media (prefers-color-scheme: dark)`. Recortamos os dois separadamente para
 * que uma edição em um tema não possa passar despercebida no outro.
 */
function themeBlock(theme: 'light' | 'dark'): string {
  if (theme === 'dark') {
    const start = CSS.indexOf('@media (prefers-color-scheme: dark)');
    expect(start).toBeGreaterThan(-1);
    return CSS.slice(start, CSS.indexOf('@layer base', start));
  }

  const start = CSS.indexOf(':root {');
  expect(start).toBeGreaterThan(-1);
  return CSS.slice(start, CSS.indexOf('@media (prefers-color-scheme: dark)'));
}

function readToken(theme: 'light' | 'dark', token: string): string {
  const match = themeBlock(theme).match(
    new RegExp(`${token}:\\s*(hsl\\([^)]*\\))`)
  );

  expect(match, `${token} não encontrado no tema ${theme}`).not.toBeNull();
  return match![1];
}

function hslToRgb(value: string): [number, number, number] {
  const parts = value
    .replace(/hsl\(|\)|%/g, '')
    .trim()
    .split(/[\s,]+/)
    .map(Number);

  expect(parts).toHaveLength(3);
  const [hue, saturationPercent, lightnessPercent] = parts;
  const saturation = saturationPercent / 100;
  const lightness = lightnessPercent / 100;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = hue / 60;
  const second = chroma * (1 - Math.abs((sector % 2) - 1));
  const offset = lightness - chroma / 2;

  const [r, g, b] =
    sector < 1
      ? [chroma, second, 0]
      : sector < 2
        ? [second, chroma, 0]
        : sector < 3
          ? [0, chroma, second]
          : sector < 4
            ? [0, second, chroma]
            : sector < 5
              ? [second, 0, chroma]
              : [chroma, 0, second];

  return [r + offset, g + offset, b + offset];
}

/** WCAG 2.1, relative luminance. */
function luminance(value: string): number {
  const [r, g, b] = hslToRgb(value).map(channel =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const first = luminance(a);
  const second = luminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

function ratioAgainstCard(theme: 'light' | 'dark', token: string): number {
  return contrastRatio(readToken(theme, token), readToken(theme, '--card'));
}

describe('progress dashboard refresh — chart line contrast', () => {
  it('UT-042 keeps --icon-accent at 3:1 against --card in the light theme', () => {
    expect(ratioAgainstCard('light', '--icon-accent')).toBeGreaterThanOrEqual(
      3
    );
  });

  it('UT-043 keeps --icon-accent at 3:1 against --card in the dark theme', () => {
    expect(ratioAgainstCard('dark', '--icon-accent')).toBeGreaterThanOrEqual(3);
  });

  it('UT-044 keeps --chart-3 at 3:1 against --card in both themes', () => {
    expect(ratioAgainstCard('light', '--chart-3')).toBeGreaterThanOrEqual(3);
    expect(ratioAgainstCard('dark', '--chart-3')).toBeGreaterThanOrEqual(3);
  });

  it('records why --chart-1 is not used for the weight line', () => {
    // 2.0:1 no tema claro: reprova o mínimo de 3:1 da WCAG 1.4.11 (ADR-007).
    expect(ratioAgainstCard('light', '--chart-1')).toBeLessThan(3);
  });
});
