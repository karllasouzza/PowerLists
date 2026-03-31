/**
 * Formats a raw user input string into a BRL currency display string.
 * Only digits are kept; value is treated as cents (last two digits = centavos).
 * Example: "12345" → "R$ 123,45"
 */
export function formatBRL(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  const reais = Math.floor(cents / 100);
  const centavos = String(cents % 100).padStart(2, '0');
  const reaisFormatted = reais.toLocaleString('pt-BR');
  return `R$ ${reaisFormatted},${centavos}`;
}

/**
 * Parses a BRL display string (e.g. "R$ 1.234,56") back to a plain number.
 */
export function parseBRLToNumber(value: string): number {
  if (!value) return 0;
  const clean = value
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(clean) || 0;
}

/**
 * Converts a stored numeric price back to a BRL display string for editing.
 * Example: 1234.56 → "R$ 1.234,56"
 */
export function numberToBRLInput(value: number): string {
  if (!value || value === 0) return '';
  const cents = Math.round(value * 100);
  const reais = Math.floor(cents / 100);
  const centavos = String(cents % 100).padStart(2, '0');
  const reaisFormatted = reais.toLocaleString('pt-BR');
  return `R$ ${reaisFormatted},${centavos}`;
}
