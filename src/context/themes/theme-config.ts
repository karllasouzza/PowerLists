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
      '--color-onboarding-1': '#FFE1E0',
      '--color-onboarding-1-foreground': '#09200b',
      '--color-onboarding-2': '#cae8cb',
      '--color-onboarding-2-foreground': '#19601f',
      '--color-onboarding-3': '#efeae4',
      '--color-onboarding-3-foreground': '#2a332b',

      // === BOTTOM BAR ===
      '--color-bottom-bar': '#f0ede5',
      '--color-bottom-bar-foreground': '#1a1f1b',
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
      '--color-bottom-bar': '#1a2a1c',
      '--color-bottom-bar-foreground': '#f5faf4',
      '--color-bottom-bar-accent': '#5bb85f',
      '--color-bottom-bar-accent-foreground': '#ffffff',
    },
  },
  purple: {
    light: {
      '--color-primary': '#7e37c7',
      '--color-primary-foreground': '#ffffff',
      '--color-secondary': '#efdbff',
      '--color-secondary-foreground': '#2b0052',
      '--color-background': '#ffffff',
      '--color-foreground': '#2b0052',
      '--color-card': '#ffffff',
      '--color-card-foreground': '#2b0052',
      '--color-popover': '#ffffff',
      '--color-popover-foreground': '#2b0052',
      '--color-muted': '#efdbff',
      '--color-muted-foreground': '#6512ae',
      '--color-accent': '#efdbff',
      '--color-accent-foreground': '#2b0052',
      '--color-destructive': '#ef4444',
      '--color-destructive-foreground': '#ffffff',
      '--color-border': '#dbb8ff',
      '--color-input': '#dbb8ff',
      '--color-ring': '#7e37c7',
      '--color-success': '#307b34',
      '--color-success-foreground': '#ffffff',
      '--color-warning': '#f59e0b',
      '--color-warning-foreground': '#18181b',
      '--color-info': '#19601f',
      '--color-info-foreground': '#ffffff',
      '--color-onboarding-1': '#c7d2fe',
      '--color-onboarding-1-foreground': '#000000',
      '--color-onboarding-2': '#f5d0fe',
      '--color-onboarding-2-foreground': '#000000',
      '--color-onboarding-3': '#fed7aa',
      '--color-onboarding-3-foreground': '#000000',
      '--color-bottom-bar': '#f3e9ff',
      '--color-bottom-bar-foreground': '#3c0064',
      '--color-bottom-bar-accent': '#7e37c7',
      '--color-bottom-bar-accent-foreground': '#ffffff',
    },
    dark: {
      '--color-primary': '#dbb8ff',
      '--color-primary-foreground': '#2b0052',
      '--color-secondary': '#480082',
      '--color-secondary-foreground': '#efdbff',
      '--color-background': '#2b0052',
      '--color-foreground': '#efdbff',
      '--color-card': '#480082',
      '--color-card-foreground': '#efdbff',
      '--color-popover': '#6512ae',
      '--color-popover-foreground': '#efdbff',
      '--color-muted': '#6512ae',
      '--color-muted-foreground': '#dbb8ff',
      '--color-accent': '#7e37c7',
      '--color-accent-foreground': '#efdbff',
      '--color-destructive': '#f87171',
      '--color-destructive-foreground': '#efdbff',
      '--color-border': '#6512ae',
      '--color-input': '#7e37c7',
      '--color-ring': '#9853e2',
      '--color-success': '#4dae50',
      '--color-success-foreground': '#f4fff4',
      '--color-warning': '#fbbf24',
      '--color-warning-foreground': '#253528',
      '--color-info': '#67bb6b',
      '--color-info-foreground': '#f4fff4',
      '--color-onboarding-1': '#c7d2fe',
      '--color-onboarding-1-foreground': '#ffffff',
      '--color-onboarding-2': '#f5d0fe',
      '--color-onboarding-2-foreground': '#ffffff',
      '--color-onboarding-3': '#fed7aa',
      '--color-onboarding-3-foreground': '#ffffff',
      '--color-bottom-bar': '#2b0052',
      '--color-bottom-bar-foreground': '#e6c8ff',
      '--color-bottom-bar-accent': '#9646dc',
      '--color-bottom-bar-accent-foreground': '#ffffff',
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
