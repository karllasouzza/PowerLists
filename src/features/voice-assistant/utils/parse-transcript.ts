const WORD_TO_NUMBER: Record<string, number> = {
  // units
  zero: 0,
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  três: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  // teens
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  catorze: 14,
  quatorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  dezenove: 19,
  // tens
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  // hundreds
  cem: 100,
  cento: 100,
  duzentos: 200,
  duzentas: 200,
  trezentos: 300,
  trezentas: 300,
  quatrocentos: 400,
  quatrocentas: 400,
  quinhentos: 500,
  quinhentas: 500,
  seiscentos: 600,
  seiscentas: 600,
  setecentos: 700,
  setecentas: 700,
  oitocentos: 800,
  oitocentas: 800,
  novecentos: 900,
  novecentas: 900,
  mil: 1000,
};

const HUNDREDS = new Set([
  'cem',
  'cento',
  'duzentos',
  'duzentas',
  'trezentos',
  'trezentas',
  'quatrocentos',
  'quatrocentas',
  'quinhentos',
  'quinhentas',
  'seiscentos',
  'seiscentas',
  'setecentos',
  'setecentas',
  'oitocentos',
  'oitocentas',
  'novecentos',
  'novecentas',
]);

const TENS = new Set([
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
]);

/**
 * Tries to greedily consume a Portuguese numeric word sequence starting at `startIdx`.
 * Handles patterns like:
 *   - "duzentos e vinte e um"  (hundreds + e + tens + e + units)
 *   - "vinte e um"             (tens + e + units)
 *   - "dois"                   (single unit/teen)
 *   - "mil e duzentos"         (mil + e + hundreds)
 * Returns null if no numeric word is found at startIdx.
 */
function tryMatchNumberAt(
  tokens: string[],
  startIdx: number,
): { value: number; endIdx: number } | null {
  const tok = tokens[startIdx]?.toLowerCase();
  if (!tok || WORD_TO_NUMBER[tok] === undefined) return null;

  let value = 0;
  let i = startIdx;

  // Handle "mil"
  if (tok === 'mil') {
    value = 1000;
    i++;
  } else if (HUNDREDS.has(tok)) {
    value = WORD_TO_NUMBER[tok]!;
    i++;
    // "e" connector
    if (tokens[i]?.toLowerCase() === 'e') {
      i++;
      // tens or units/teens after "e"
      const next = tokens[i]?.toLowerCase();
      if (next && WORD_TO_NUMBER[next] !== undefined && next !== 'mil') {
        value += WORD_TO_NUMBER[next]!;
        i++;
        // another "e" + units
        if (TENS.has(next) && tokens[i]?.toLowerCase() === 'e') {
          i++;
          const unit = tokens[i]?.toLowerCase();
          if (
            unit &&
            WORD_TO_NUMBER[unit] !== undefined &&
            !TENS.has(unit) &&
            !HUNDREDS.has(unit) &&
            unit !== 'mil'
          ) {
            value += WORD_TO_NUMBER[unit]!;
            i++;
          } else {
            // backtrack the "e"
            i--;
          }
        }
      } else {
        // backtrack the "e"
        i--;
      }
    }
  } else if (TENS.has(tok)) {
    value = WORD_TO_NUMBER[tok]!;
    i++;
    // "e" + units
    if (tokens[i]?.toLowerCase() === 'e') {
      i++;
      const unit = tokens[i]?.toLowerCase();
      if (
        unit &&
        WORD_TO_NUMBER[unit] !== undefined &&
        !TENS.has(unit) &&
        !HUNDREDS.has(unit) &&
        unit !== 'mil'
      ) {
        value += WORD_TO_NUMBER[unit]!;
        i++;
      } else {
        // backtrack the "e"
        i--;
      }
    }
  } else {
    // single unit or teen
    value = WORD_TO_NUMBER[tok]!;
    i++;
  }

  return { value, endIdx: i };
}

/**
 * Parses a speech transcript in Portuguese and extracts the quantity and item title.
 *
 * Rules:
 * - The quantity can be numeric ("10") or written ("dez", "vinte e um")
 * - The quantity can appear anywhere in the phrase
 * - If no quantity is found, defaults to 1
 * - Everything else becomes the title
 *
 * @example
 * parseTranscript("dois arroz")             // { title: "arroz", amount: 2 }
 * parseTranscript("10 massa de tomate")     // { title: "massa de tomate", amount: 10 }
 * parseTranscript("arroz dois")             // { title: "arroz", amount: 2 }
 * parseTranscript("vinte e um pão de forma") // { title: "pão de forma", amount: 21 }
 * parseTranscript("arroz")                 // { title: "arroz", amount: 1 }
 */
export function parseTranscript(text: string): { title: string; amount: number } {
  const raw = text.trim().toLowerCase();
  const tokens = raw.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return { title: '', amount: 1 };
  }

  // 1. Try to find a pure numeric token anywhere
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]!;
    if (/^\d+$/.test(tok)) {
      const amount = parseInt(tok, 10);
      const remaining = [...tokens.slice(0, i), ...tokens.slice(i + 1)];
      return { title: remaining.join(' '), amount };
    }
  }

  // 2. Try to find a written number at any position
  for (let i = 0; i < tokens.length; i++) {
    const match = tryMatchNumberAt(tokens, i);
    if (match !== null) {
      const { value, endIdx } = match;
      const remaining = [...tokens.slice(0, i), ...tokens.slice(endIdx)];
      return { title: remaining.join(' '), amount: value };
    }
  }

  // 3. No number found — default amount to 1
  return { title: tokens.join(' '), amount: 1 };
}
