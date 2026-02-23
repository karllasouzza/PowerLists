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
      '--color-primary': '#307b34',
      '--color-primary-foreground': '#ffffff',
      '--color-secondary': '#e9f6ea',
      '--color-secondary-foreground': '#19601f',
      '--color-background': '#f8f5ee',
      '--color-foreground': '#2a332b',

      // === SURFACES ===
      '--color-card': '#f8f5ee',
      '--color-card-foreground': '#402622',
      '--color-popover': '#f8f5ee',
      '--color-popover-foreground': '#402622',

      // === MUTED / ACCENT ===
      '--color-muted': '#efeae4',
      '--color-muted-foreground': '#5f6561',
      '--color-accent': '#cae8cb',
      '--color-accent-foreground': '#19601f',

      // === DESTRUCTIVE ===
      '--color-destructive': '#c52c2a',
      '--color-destructive-foreground': '#ffffff',

      // === BORDERS & INPUTS ===
      '--color-border': '#d7d7d7',
      '--color-input': '#dfd6c9',
      '--color-ring': '#307b34',

      // === SEMANTIC ===
      '--color-success': '#307b34',
      '--color-success-foreground': '#ffffff',
      '--color-warning': '#f59e0b',
      '--color-warning-foreground': '#2a332b',
      '--color-info': '#19601f',
      '--color-info-foreground': '#ffffff',

      // === ONBOARDING ===
      '--color-onboarding-1': '#e9f6ea',
      '--color-onboarding-1-foreground': '#09200b',
      '--color-onboarding-2': '#cae8cb',
      '--color-onboarding-2-foreground': '#19601f',
      '--color-onboarding-3': '#efeae4',
      '--color-onboarding-3-foreground': '#2a332b',

      // === BOTTOM BAR ===
      '--color-bottom-bar': 'rgba(42, 51, 43, 0.92)',
      '--color-bottom-bar-foreground': '#ffffff',
      '--color-bottom-bar-accent': '#307b34',
      '--color-bottom-bar-accent-foreground': '#ffffff',
    },
    dark: {
      // === CORE ===
      '--color-primary': '#4dae50',
      '--color-primary-foreground': '#f4fff4',
      '--color-secondary': '#3c493b',
      '--color-secondary-foreground': '#d7e2d6',
      '--color-background': '#253528',
      '--color-foreground': '#c7ccc7',

      // === SURFACES ===
      '--color-card': '#303f32',
      '--color-card-foreground': '#c7ccc7',
      '--color-popover': '#2b3a2c',
      '--color-popover-foreground': '#efeae4',

      // === MUTED / ACCENT ===
      '--color-muted': '#213023',
      '--color-muted-foreground': '#939f95',
      '--color-accent': '#3d8f40',
      '--color-accent-foreground': '#efeae4',

      // === DESTRUCTIVE ===
      '--color-destructive': '#c52c2a',
      '--color-destructive-foreground': '#efeae4',

      // === BORDERS & INPUTS ===
      '--color-border': '#3c493b',
      '--color-input': '#3c493b',
      '--color-ring': '#4dae50',

      // === SEMANTIC ===
      '--color-success': '#4dae50',
      '--color-success-foreground': '#f4fff4',
      '--color-warning': '#fbbf24',
      '--color-warning-foreground': '#253528',
      '--color-info': '#67bb6b',
      '--color-info-foreground': '#f4fff4',

      // === ONBOARDING ===
      '--color-onboarding-1': '#1c2b1f',
      '--color-onboarding-1-foreground': '#d7e2d6',
      '--color-onboarding-2': '#3d8f40',
      '--color-onboarding-2-foreground': '#efeae4',
      '--color-onboarding-3': '#213023',
      '--color-onboarding-3-foreground': '#c7ccc7',

      // === BOTTOM BAR ===
      '--color-bottom-bar': 'rgba(37, 53, 40, 0.92)',
      '--color-bottom-bar-foreground': '#efeae4',
      '--color-bottom-bar-accent': '#4dae50',
      '--color-bottom-bar-accent-foreground': '#f4fff4',
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
      '--color-success': '#307b34',
      '--color-success-foreground': '#ffffff',
      '--color-warning': '#f59e0b',
      '--color-warning-foreground': '#18181b',
      '--color-info': '#19601f',
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
      '--color-success': '#4dae50',
      '--color-success-foreground': '#f4fff4',
      '--color-warning': '#fbbf24',
      '--color-warning-foreground': '#253528',
      '--color-info': '#67bb6b',
      '--color-info-foreground': '#f4fff4',
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
