export function getInitialsName(name: string | null | undefined): string {
  if (!name) {
    return 'SI';
  }

  const partes = name.trim().split(/\s+/);

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  } else {
    const primeiraLetra = partes[0][0].toUpperCase();
    const ultimaLetra = partes[partes.length - 1][0].toUpperCase();
    return `${primeiraLetra}${ultimaLetra}`;
  }
}
