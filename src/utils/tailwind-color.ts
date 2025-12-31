import colors from 'tailwindcss/colors';

/**
 * Converte uma string de cor no formato Tailwind para o valor correspondente.
 * Suporta tanto cores com shade (ex: 'blue-500') quanto cores especiais (ex: 'black', 'white').
 *
 * @param colorString - String no formato 'colorName-shade' ou nome de cor especial
 * @returns O valor da cor (hexadecimal ou palavra-chave CSS)
 * @throws Error se o formato for inválido ou a cor não existir no Tailwind
 *
 * @example
 * ```typescript
 * // Cores com shade
 * const blue = getTailwindColor('blue-500');    // '#3b82f6'
 * const red = getTailwindColor('red-600');      // '#dc2626'
 *
 * // Cores especiais (sem shade)
 * const black = getTailwindColor('black');      // '#000'
 * const white = getTailwindColor('white');      // '#fff'
 * const transparent = getTailwindColor('transparent'); // '#00000000'
 * ```
 */
export const getTailwindColor = (colorString: string): string => {
  // Cores especiais do Tailwind que não usam o formato colorName-shade
  const specialColors: Record<string, string> = {
    transparent: '#00000000',
    black: colors.black,
    white: colors.white,
  };

  // Verifica se é uma cor especial
  if (colorString in specialColors) {
    return specialColors[colorString];
  }

  // Valida se a string está no formato colorName-shade
  const colorParts = colorString.split('-');

  if (colorParts.length !== 2) {
    throw new Error(
      `Invalid color format: '${colorString}'. Expected format: colorName-shade (e.g., blue-500) or special color (black, white, transparent)`
    );
  }

  const [colorName, colorShade] = colorParts;

  // Verifica se a cor existe no objeto colors do Tailwind
  if (!(colorName in colors)) {
    throw new Error(`Color '${colorName}' not found in Tailwind colors`);
  }

  const colorGroup = colors[colorName as keyof typeof colors];

  // Verifica se o colorGroup é um objeto válido e contém o shade
  if (typeof colorGroup !== 'object' || colorGroup === null || !(colorShade in colorGroup)) {
    throw new Error(`Shade '${colorShade}' not found for color '${colorName}'`);
  }

  const color = (colorGroup as Record<string, string>)[colorShade];

  if (!color) {
    throw new Error(`Color value not found for '${colorString}'`);
  }

  return color;
};

/**
 * Tenta converter uma string de cor Tailwind para hexadecimal, retornando um fallback em caso de erro.
 *
 * @param colorString - String no formato 'colorName-shade' (ex: 'blue-500')
 * @param fallback - Cor de fallback a ser retornada em caso de erro (padrão: '#000000')
 * @returns O valor hexadecimal da cor ou o fallback
 *
 * @example
 * ```typescript
 * const color = getTailwindColorSafe('blue-500', '#ffffff'); // '#3b82f6'
 * const invalid = getTailwindColorSafe('invalid-color', '#ffffff'); // '#ffffff'
 * ```
 */
export const getTailwindColorSafe = (colorString: string, fallback = '#000000'): string => {
  try {
    return getTailwindColor(colorString);
  } catch {
    return fallback;
  }
};

/**
 * Tipo para objetos de tema que contêm variáveis CSS.
 * Representa o retorno de `vars()` do NativeWind com variáveis de cor.
 */
export type ThemeVars = Record<string, string>;

/**
 * Extrai o valor de uma variável CSS de um objeto de tema.
 *
 * @param themeVars - Objeto contendo as variáveis CSS do tema (ex: resultado de `themes[theme][scheme]`)
 * @param varName - Nome da variável CSS (ex: '--color-background', '--color-primary')
 * @returns O valor da cor em formato RGB (ex: 'rgb(255, 255, 255)')
 * @throws Error se a variável não existir no objeto de tema
 *
 * @example
 * ```typescript
 * const themeVars = themes['default']['light'];
 * const bgColor = getThemeColor(themeVars, '--color-background'); // 'rgb(255, 255, 255)'
 * const primaryColor = getThemeColor(themeVars, '--color-primary'); // 'rgb(0, 0, 0)'
 * ```
 */
export const getThemeColor = (themeVars: ThemeVars, varName: string): string => {
  const color = themeVars?.[varName];

  if (!color || typeof color !== 'string') {
    throw new Error(`Theme variable '${varName}' not found in theme object`);
  }

  return color;
};

/**
 * Versão segura de getThemeColor que retorna um fallback em caso de erro.
 *
 * @param themeVars - Objeto contendo as variáveis CSS do tema
 * @param varName - Nome da variável CSS
 * @param fallback - Cor de fallback (padrão: 'rgb(0, 0, 0)')
 * @returns O valor da cor ou o fallback
 *
 * @example
 * ```typescript
 * const color = getThemeColorSafe(themeVars, '--color-background', 'rgb(255, 255, 255)');
 * ```
 */
export const getThemeColorSafe = (
  themeVars: ThemeVars,
  varName: string,
  fallback = 'rgb(0, 0, 0)'
): string => {
  try {
    return getThemeColor(themeVars, varName);
  } catch {
    // Silently return fallback when theme variable is not found
    return fallback;
  }
};

/**
 * Resolve uma cor de qualquer formato suportado:
 * - Cores Tailwind: 'blue-500', 'red-600'
 * - Variáveis de tema: '--color-background', '--color-primary'
 * - Cores diretas: '#ffffff', 'rgb(255, 255, 255)'
 *
 * @param colorInput - String de cor em qualquer formato suportado
 * @param themeVars - Opcional. Objeto de tema para resolver variáveis CSS
 * @param fallback - Cor de fallback em caso de erro (padrão: '#000000')
 * @returns O valor da cor resolvido
 *
 * @example
 * ```typescript
 * // Cor Tailwind
 * const blue = resolveColor('blue-500'); // '#3b82f6'
 *
 * // Variável de tema
 * const bg = resolveColor('--color-background', themeVars); // 'rgb(255, 255, 255)'
 *
 * // Cor direta
 * const white = resolveColor('#ffffff'); // '#ffffff'
 *
 * // Com fallback
 * const color = resolveColor('invalid', undefined, '#000000'); // '#000000'
 * ```
 */
export const resolveColor = (
  colorInput: string,
  themeVars?: ThemeVars,
  fallback = '#000000'
): string => {
  try {
    // Se começa com '--', é uma variável de tema CSS
    if (colorInput.startsWith('--')) {
      if (!themeVars) {
        throw new Error('Theme variables object is required for CSS variable colors');
      }
      return getThemeColorSafe(themeVars, colorInput, fallback);
    }

    // Se começa com '#' ou 'rgb', é uma cor direta
    if (colorInput.startsWith('#') || colorInput.startsWith('rgb')) {
      return colorInput;
    }

    // Caso contrário, tenta como cor Tailwind (ex: 'blue-500')
    return getTailwindColor(colorInput);
  } catch {
    return fallback;
  }
};
