export const LIST_ACCENT_COLOR_TOKENS = [
  'list-accent-1',
  'list-accent-2',
  'list-accent-3',
  'list-accent-4',
  'list-accent-5',
] as const;

export type AccentColorToken = (typeof LIST_ACCENT_COLOR_TOKENS)[number];

type AccentColorOption = {
  value: AccentColorToken;
  label: string;
  swatchClassName: string;
  foregroundClassName: string;
  cardClassName: string;
  cardForegroundClassName: string;
};

export const DEFAULT_ACCENT_COLOR: AccentColorToken = 'list-accent-1';

export const LIST_ACCENT_COLOR_OPTIONS: readonly AccentColorOption[] = [
  {
    value: 'list-accent-1',
    label: 'Verde',
    swatchClassName: 'bg-list-accent-1',
    foregroundClassName: 'text-list-accent-1-foreground',
    cardClassName: 'bg-list-accent-1',
    cardForegroundClassName: 'text-list-accent-1-foreground',
  },
  {
    value: 'list-accent-2',
    label: 'Azul',
    swatchClassName: 'bg-list-accent-2',
    foregroundClassName: 'text-list-accent-2-foreground',
    cardClassName: 'bg-list-accent-2',
    cardForegroundClassName: 'text-list-accent-2-foreground',
  },
  {
    value: 'list-accent-3',
    label: 'Vermelho',
    swatchClassName: 'bg-list-accent-3',
    foregroundClassName: 'text-list-accent-3-foreground',
    cardClassName: 'bg-list-accent-3',
    cardForegroundClassName: 'text-list-accent-3-foreground',
  },
  {
    value: 'list-accent-4',
    label: 'Amarelo',
    swatchClassName: 'bg-list-accent-4',
    foregroundClassName: 'text-list-accent-4-foreground',
    cardClassName: 'bg-list-accent-4',
    cardForegroundClassName: 'text-list-accent-4-foreground',
  },
  {
    value: 'list-accent-5',
    label: 'Roxo',
    swatchClassName: 'bg-list-accent-5',
    foregroundClassName: 'text-list-accent-5-foreground',
    cardClassName: 'bg-list-accent-5',
    cardForegroundClassName: 'text-list-accent-5-foreground',
  },
] as const;

const LEGACY_ACCENT_COLOR_MAP: Record<string, AccentColorToken> = {
  primary: 'list-accent-1',
  success: 'list-accent-1',
  warning: 'list-accent-4',
  destructive: 'list-accent-3',
  info: 'list-accent-2',
  secondary: 'list-accent-5',
  muted: 'list-accent-1',
};

const ACCENT_COLOR_OPTIONS_BY_VALUE = Object.fromEntries(
  LIST_ACCENT_COLOR_OPTIONS.map((option) => [option.value, option]),
) as Record<AccentColorToken, AccentColorOption>;

const isNewToken = (value?: string): value is AccentColorToken => {
  if (!value) return false;
  return value in ACCENT_COLOR_OPTIONS_BY_VALUE;
};

export const isAccentColorToken = (value?: string): value is AccentColorToken => {
  return isNewToken(value) || (!!value && value in LEGACY_ACCENT_COLOR_MAP);
};

export const getAccentColorToken = (value?: string): AccentColorToken => {
  if (!value) return DEFAULT_ACCENT_COLOR;
  if (isNewToken(value)) return value;
  return LEGACY_ACCENT_COLOR_MAP[value] ?? DEFAULT_ACCENT_COLOR;
};

export const getAccentColorOption = (value?: string): AccentColorOption => {
  const colorToken = getAccentColorToken(value);
  return ACCENT_COLOR_OPTIONS_BY_VALUE[colorToken];
};

export const getAccentColorCardClasses = (value?: string) => {
  const option = getAccentColorOption(value);

  return {
    backgroundClassName: option.cardClassName,
    foregroundClassName: option.cardForegroundClassName,
  };
};
