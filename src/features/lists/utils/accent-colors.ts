export const LIST_ACCENT_COLOR_TOKENS = [
  'primary',
  'secondary',
  'muted',
  'destructive',
  'success',
  'warning',
  'info',
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

export const DEFAULT_ACCENT_COLOR: AccentColorToken = 'primary';

export const LIST_ACCENT_COLOR_OPTIONS: readonly AccentColorOption[] = [
  {
    value: 'primary',
    label: 'Primaria',
    swatchClassName: 'bg-primary',
    foregroundClassName: 'text-primary-foreground',
    cardClassName: 'bg-primary',
    cardForegroundClassName: 'text-primary-foreground',
  },
  {
    value: 'secondary',
    label: 'Secundaria',
    swatchClassName: 'bg-secondary',
    foregroundClassName: 'text-secondary-foreground',
    cardClassName: 'bg-secondary',
    cardForegroundClassName: 'text-secondary-foreground',
  },
  {
    value: 'muted',
    label: 'Neutra',
    swatchClassName: 'bg-muted',
    foregroundClassName: 'text-muted-foreground',
    cardClassName: 'bg-muted',
    cardForegroundClassName: 'text-muted-foreground',
  },
  {
    value: 'destructive',
    label: 'Perigo',
    swatchClassName: 'bg-destructive',
    foregroundClassName: 'text-destructive-foreground',
    cardClassName: 'bg-destructive',
    cardForegroundClassName: 'text-destructive-foreground',
  },
  {
    value: 'success',
    label: 'Sucesso',
    swatchClassName: 'bg-success',
    foregroundClassName: 'text-success-foreground',
    cardClassName: 'bg-success',
    cardForegroundClassName: 'text-success-foreground',
  },
  {
    value: 'warning',
    label: 'Alerta',
    swatchClassName: 'bg-warning',
    foregroundClassName: 'text-warning-foreground',
    cardClassName: 'bg-warning',
    cardForegroundClassName: 'text-warning-foreground',
  },
  {
    value: 'info',
    label: 'Informacao',
    swatchClassName: 'bg-info',
    foregroundClassName: 'text-info-foreground',
    cardClassName: 'bg-info',
    cardForegroundClassName: 'text-info-foreground',
  },
] as const;

const ACCENT_COLOR_OPTIONS_BY_VALUE = Object.fromEntries(
  LIST_ACCENT_COLOR_OPTIONS.map((option) => [option.value, option]),
) as Record<AccentColorToken, AccentColorOption>;

export const isAccentColorToken = (value?: string): value is AccentColorToken => {
  if (!value) return false;
  return value in ACCENT_COLOR_OPTIONS_BY_VALUE;
};

export const getAccentColorToken = (value?: string): AccentColorToken => {
  return isAccentColorToken(value) ? value : DEFAULT_ACCENT_COLOR;
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
