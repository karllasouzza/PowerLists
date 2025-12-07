import { vars } from 'nativewind';

/**
 * Raw color values for programmatic access.
 * These are the actual color values without NativeWind's vars() wrapper.
 * Use this when you need to access colors programmatically (e.g., for NavigationBar).
 */
/**
 * Raw color values - Single source of truth for all theme colors.
 * These are the actual color values without NativeWind's vars() wrapper.
 * Use this when you need to access colors programmatically (e.g., for NavigationBar).
 */
export const rawColors = {
  default: {
    light: {
      '--color-primary': 'rgb(0, 0, 0)',
      '--color-secondary': 'rgb(245, 245, 245)',
      '--color-background': 'rgb(255, 255, 255)',
      '--color-foreground': 'rgb(10, 10, 10)',
      '--color-card': 'rgb(255, 255, 255)',
      '--color-card-foreground': 'rgb(10, 10, 10)',
      '--color-popover': 'rgb(255, 255, 255)',
      '--color-popover-foreground': 'rgb(10, 10, 10)',
      '--color-primary-foreground': 'rgb(250, 250, 250)',
      '--color-secondary-foreground': 'rgb(64, 64, 64)',
      '--color-muted': 'rgb(245, 245, 245)',
      '--color-muted-foreground': 'rgb(115, 115, 115)',
      '--color-accent': 'rgb(245, 245, 245)',
      '--color-accent-foreground': 'rgb(10, 10, 10)',
      '--color-destructive': 'rgb(239, 68, 68)',
      '--color-destructive-foreground': 'rgb(255, 255, 255)',
      '--color-border': 'rgb(229, 229, 229)',
      '--color-input': 'rgb(229, 229, 229)',
      '--color-ring': 'rgb(161, 161, 161)',
      '--color-onboarding-1': 'rgb(199, 210, 254)',
      '--color-onboarding-1-foreground': 'rgb(0, 0, 0)',
      '--color-onboarding-2': 'rgb(245, 208, 254)',
      '--color-onboarding-2-foreground': 'rgb(0, 0, 0)',
      '--color-onboarding-3': 'rgb(254, 215, 170)',
      '--color-onboarding-3-foreground': 'rgb(0, 0, 0)',
    },
    dark: {
      '--color-primary': 'rgb(255, 255, 255)',
      '--color-secondary': 'rgb(38, 38, 38)',
      '--color-background': 'rgb(10, 10, 10)',
      '--color-foreground': 'rgb(250, 250, 250)',
      '--color-card': 'rgb(23, 23, 23)',
      '--color-card-foreground': 'rgb(250, 250, 250)',
      '--color-popover': 'rgb(38, 38, 38)',
      '--color-popover-foreground': 'rgb(250, 250, 250)',
      '--color-primary-foreground': 'rgb(23, 23, 23)',
      '--color-secondary-foreground': 'rgb(212, 212, 212)',
      '--color-muted': 'rgb(38, 38, 38)',
      '--color-muted-foreground': 'rgb(161, 161, 161)',
      '--color-accent': 'rgb(64, 64, 64)',
      '--color-accent-foreground': 'rgb(250, 250, 250)',
      '--color-destructive': 'rgb(248, 113, 113)',
      '--color-destructive-foreground': 'rgb(250, 250, 250)',
      '--color-border': 'rgb(39, 39, 42)',
      '--color-input': 'rgb(52, 52, 52)',
      '--color-ring': 'rgb(115, 115, 115)',
      '--color-onboarding-1': 'rgb(55, 48, 163)',
      '--color-onboarding-1-foreground': 'rgb(255, 255, 255)',
      '--color-onboarding-2': 'rgb(134, 25, 143)',
      '--color-onboarding-2-foreground': 'rgb(255, 255, 255)',
      '--color-onboarding-3': 'rgb(124, 45, 18)',
      '--color-onboarding-3-foreground': 'rgb(255, 255, 255)',
    },
  },
  purple: {
    light: {
      '--color-primary': 'rgb(126, 55, 199)',
      '--color-secondary': 'rgb(239, 219, 255)',
      '--color-background': 'rgb(255, 255, 255)',
      '--color-foreground': 'rgb(43, 0, 82)',
      '--color-card': 'rgb(255, 255, 255)',
      '--color-card-foreground': 'rgb(43, 0, 82)',
      '--color-popover': 'rgb(255, 255, 255)',
      '--color-popover-foreground': 'rgb(43, 0, 82)',
      '--color-primary-foreground': 'rgb(255, 255, 255)',
      '--color-secondary-foreground': 'rgb(43, 0, 82)',
      '--color-muted': 'rgb(239, 219, 255)',
      '--color-muted-foreground': 'rgb(101, 18, 174)',
      '--color-accent': 'rgb(239, 219, 255)',
      '--color-accent-foreground': 'rgb(43, 0, 82)',
      '--color-destructive': 'rgb(239, 68, 68)',
      '--color-destructive-foreground': 'rgb(255, 255, 255)',
      '--color-border': 'rgb(219, 184, 255)',
      '--color-input': 'rgb(219, 184, 255)',
      '--color-ring': 'rgb(126, 55, 199)',
      '--color-onboarding-1': 'rgb(199, 210, 254)',
      '--color-onboarding-1-foreground': 'rgb(0, 0, 0)',
      '--color-onboarding-2': 'rgb(245, 208, 254)',
      '--color-onboarding-2-foreground': 'rgb(0, 0, 0)',
      '--color-onboarding-3': 'rgb(254, 215, 170)',
      '--color-onboarding-3-foreground': 'rgb(0, 0, 0)',
    },
    dark: {
      '--color-primary': 'rgb(219, 184, 255)',
      '--color-secondary': 'rgb(72, 0, 130)',
      '--color-background': 'rgb(43, 0, 82)',
      '--color-foreground': 'rgb(239, 219, 255)',
      '--color-card': 'rgb(72, 0, 130)',
      '--color-card-foreground': 'rgb(239, 219, 255)',
      '--color-popover': 'rgb(101, 18, 174)',
      '--color-popover-foreground': 'rgb(239, 219, 255)',
      '--color-primary-foreground': 'rgb(43, 0, 82)',
      '--color-secondary-foreground': 'rgb(239, 219, 255)',
      '--color-muted': 'rgb(101, 18, 174)',
      '--color-muted-foreground': 'rgb(219, 184, 255)',
      '--color-accent': 'rgb(126, 55, 199)',
      '--color-accent-foreground': 'rgb(239, 219, 255)',
      '--color-destructive': 'rgb(248, 113, 113)',
      '--color-destructive-foreground': 'rgb(239, 219, 255)',
      '--color-border': 'rgb(101, 18, 174)',
      '--color-input': 'rgb(126, 55, 199)',
      '--color-ring': 'rgb(152, 83, 226)',
      '--color-onboarding-1': 'rgb(199, 210, 254)',
      '--color-onboarding-1-foreground': 'rgb(255, 255, 255)',
      '--color-onboarding-2': 'rgb(245, 208, 254)',
      '--color-onboarding-2-foreground': 'rgb(255, 255, 255)',
      '--color-onboarding-3': 'rgb(254, 215, 170)',
      '--color-onboarding-3-foreground': 'rgb(255, 255, 255)',
    },
  },
} as const;

/**
 * Themes with NativeWind vars() for use in style props.
 * These are automatically generated from rawColors to avoid duplication.
 */
export const themes = {
  default: {
    light: vars(rawColors.default.light),
    dark: vars(rawColors.default.dark),
  },
  purple: {
    light: vars(rawColors.purple.light),
    dark: vars(rawColors.purple.dark),
  },
};
