import { vars } from 'nativewind';

/**
 * Raw color values - Single source of truth for all theme colors.
 * These are the actual color values without NativeWind's vars() wrapper.
 * Use this when you need to access colors programmatically (e.g., for NavigationBar).
 *
 * Design System: Ecobi Grocery Green Theme
 * Primary: Moss Green (#41be52)
 * Secondary: Beige (#eaf1da)
 * Neutral: Bright Snow
 * Accent: Hunter Green / Mint Cream
 * Typography: Poppins (sans) + Lora (serif)
 */
export const rawColors = {
  default: {
    light: {
      // === CORE ===
      '--color-primary': '#41be52',
      '--color-primary-foreground': '#ffffff',
      '--color-secondary': '#eaf1da',
      '--color-secondary-foreground': '#3c4a1c',
      '--color-background': '#ffffff',
      '--color-foreground': '#18181b',

      // === SURFACES ===
      '--color-card': '#ffffff',
      '--color-card-foreground': '#18181b',
      '--color-popover': '#ffffff',
      '--color-popover-foreground': '#18181b',

      // === MUTED / ACCENT ===
      '--color-muted': '#f1f1f3',
      '--color-muted-foreground': '#777788',
      '--color-accent': '#ecf8ee',
      '--color-accent-foreground': '#1a4c21',

      // === DESTRUCTIVE ===
      '--color-destructive': '#ef4444',
      '--color-destructive-foreground': '#ffffff',

      // === BORDERS & INPUTS ===
      '--color-border': '#e4e4e7',
      '--color-input': '#e4e4e7',
      '--color-ring': '#41be52',

      // === SEMANTIC ===
      '--color-success': '#41be52',
      '--color-success-foreground': '#ffffff',
      '--color-warning': '#f59e0b',
      '--color-warning-foreground': '#18181b',
      '--color-info': '#55aa84',
      '--color-info-foreground': '#ffffff',

      // === ONBOARDING ===
      '--color-onboarding-1': '#d9f2dc',
      '--color-onboarding-1-foreground': '#0d2610',
      '--color-onboarding-2': '#eaf1da',
      '--color-onboarding-2-foreground': '#1e250e',
      '--color-onboarding-3': '#ddeee6',
      '--color-onboarding-3-foreground': '#11221a',

      // === BOTTOM BAR ===
      '--color-bottom-bar': 'rgba(24, 24, 27, 0.92)',
      '--color-bottom-bar-foreground': '#ffffff',
      '--color-bottom-bar-accent': '#41be52',
      '--color-bottom-bar-accent-foreground': '#ffffff',
    },
    dark: {
      // === CORE ===
      '--color-primary': '#67cb74',
      '--color-primary-foreground': '#091b0b',
      '--color-secondary': '#1a4c21',
      '--color-secondary-foreground': '#d9f2dc',
      '--color-background': '#111113',
      '--color-foreground': '#f1f1f3',

      // === SURFACES ===
      '--color-card': '#18181b',
      '--color-card-foreground': '#f1f1f3',
      '--color-popover': '#2f2f37',
      '--color-popover-foreground': '#f1f1f3',

      // === MUTED / ACCENT ===
      '--color-muted': '#2f2f37',
      '--color-muted-foreground': '#9292a0',
      '--color-accent': '#274521',
      '--color-accent-foreground': '#dfefdc',

      // === DESTRUCTIVE ===
      '--color-destructive': '#f87171',
      '--color-destructive-foreground': '#f1f1f3',

      // === BORDERS & INPUTS ===
      '--color-border': '#474752',
      '--color-input': '#474752',
      '--color-ring': '#67cb74',

      // === SEMANTIC ===
      '--color-success': '#67cb74',
      '--color-success-foreground': '#091b0b',
      '--color-warning': '#fbbf24',
      '--color-warning-foreground': '#18181b',
      '--color-info': '#77bb9c',
      '--color-info-foreground': '#0c1812',

      // === ONBOARDING ===
      '--color-onboarding-1': '#0d2610',
      '--color-onboarding-1-foreground': '#d9f2dc',
      '--color-onboarding-2': '#1e250e',
      '--color-onboarding-2-foreground': '#eaf1da',
      '--color-onboarding-3': '#11221a',
      '--color-onboarding-3-foreground': '#ddeee6',

      // === BOTTOM BAR ===
      '--color-bottom-bar': 'rgba(17, 17, 19, 0.92)',
      '--color-bottom-bar-foreground': '#f1f1f3',
      '--color-bottom-bar-accent': '#67cb74',
      '--color-bottom-bar-accent-foreground': '#091b0b',
    },
  },
  purple: {
    light: {
      '--color-primary': 'rgb(126, 55, 199)',
      '--color-primary-foreground': 'rgb(255, 255, 255)',
      '--color-secondary': 'rgb(239, 219, 255)',
      '--color-secondary-foreground': 'rgb(43, 0, 82)',
      '--color-background': 'rgb(255, 255, 255)',
      '--color-foreground': 'rgb(43, 0, 82)',
      '--color-card': 'rgb(255, 255, 255)',
      '--color-card-foreground': 'rgb(43, 0, 82)',
      '--color-popover': 'rgb(255, 255, 255)',
      '--color-popover-foreground': 'rgb(43, 0, 82)',
      '--color-muted': 'rgb(239, 219, 255)',
      '--color-muted-foreground': 'rgb(101, 18, 174)',
      '--color-accent': 'rgb(239, 219, 255)',
      '--color-accent-foreground': 'rgb(43, 0, 82)',
      '--color-destructive': 'rgb(239, 68, 68)',
      '--color-destructive-foreground': 'rgb(255, 255, 255)',
      '--color-border': 'rgb(219, 184, 255)',
      '--color-input': 'rgb(219, 184, 255)',
      '--color-ring': 'rgb(126, 55, 199)',
      '--color-success': '#41be52',
      '--color-success-foreground': '#ffffff',
      '--color-warning': '#f59e0b',
      '--color-warning-foreground': '#18181b',
      '--color-info': '#55aa84',
      '--color-info-foreground': '#ffffff',
      '--color-onboarding-1': 'rgb(199, 210, 254)',
      '--color-onboarding-1-foreground': 'rgb(0, 0, 0)',
      '--color-onboarding-2': 'rgb(245, 208, 254)',
      '--color-onboarding-2-foreground': 'rgb(0, 0, 0)',
      '--color-onboarding-3': 'rgb(254, 215, 170)',
      '--color-onboarding-3-foreground': 'rgb(0, 0, 0)',
      '--color-bottom-bar': 'rgba(239, 219, 255, 0.8)',
      '--color-bottom-bar-foreground': 'rgb(126, 55, 199)',
      '--color-bottom-bar-accent': 'rgb(255, 255, 255)',
      '--color-bottom-bar-accent-foreground': 'rgb(126, 55, 199)',
    },
    dark: {
      '--color-primary': 'rgb(219, 184, 255)',
      '--color-primary-foreground': 'rgb(43, 0, 82)',
      '--color-secondary': 'rgb(72, 0, 130)',
      '--color-secondary-foreground': 'rgb(239, 219, 255)',
      '--color-background': 'rgb(43, 0, 82)',
      '--color-foreground': 'rgb(239, 219, 255)',
      '--color-card': 'rgb(72, 0, 130)',
      '--color-card-foreground': 'rgb(239, 219, 255)',
      '--color-popover': 'rgb(101, 18, 174)',
      '--color-popover-foreground': 'rgb(239, 219, 255)',
      '--color-muted': 'rgb(101, 18, 174)',
      '--color-muted-foreground': 'rgb(219, 184, 255)',
      '--color-accent': 'rgb(126, 55, 199)',
      '--color-accent-foreground': 'rgb(239, 219, 255)',
      '--color-destructive': 'rgb(248, 113, 113)',
      '--color-destructive-foreground': 'rgb(239, 219, 255)',
      '--color-border': 'rgb(101, 18, 174)',
      '--color-input': 'rgb(126, 55, 199)',
      '--color-ring': 'rgb(152, 83, 226)',
      '--color-success': '#67cb74',
      '--color-success-foreground': '#091b0b',
      '--color-warning': '#fbbf24',
      '--color-warning-foreground': '#18181b',
      '--color-info': '#77bb9c',
      '--color-info-foreground': '#0c1812',
      '--color-onboarding-1': 'rgb(199, 210, 254)',
      '--color-onboarding-1-foreground': 'rgb(255, 255, 255)',
      '--color-onboarding-2': 'rgb(245, 208, 254)',
      '--color-onboarding-2-foreground': 'rgb(255, 255, 255)',
      '--color-onboarding-3': 'rgb(254, 215, 170)',
      '--color-onboarding-3-foreground': 'rgb(255, 255, 255)',
      '--color-bottom-bar': 'rgba(72, 0, 130, 0.8)',
      '--color-bottom-bar-foreground': 'rgb(219, 184, 255)',
      '--color-bottom-bar-accent': 'rgb(101, 18, 174)',
      '--color-bottom-bar-accent-foreground': 'rgb(239, 219, 255)',
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
