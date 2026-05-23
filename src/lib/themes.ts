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
      '--color-primary': '123 44% 34%',
      '--color-primary-foreground': '0 0% 100%',
      '--color-secondary': '122 30% 93%',
      '--color-secondary-foreground': '125 59% 24%',
      '--color-background': '90 20% 98%',
      '--color-foreground': '127 15% 12%',

      // === SURFACES ===
      '--color-card': '90 20% 98%',
      '--color-card-foreground': '127 12% 14%',
      '--color-popover': '90 20% 98%',
      '--color-popover-foreground': '127 12% 14%',

      // === MUTED / ACCENT ===
      '--color-muted': '90 12% 94%',
      '--color-muted-foreground': '138 5% 38%',
      '--color-accent': '122 38% 83%',
      '--color-accent-foreground': '125 59% 24%',

      // === DESTRUCTIVE ===
      '--color-destructive': '1 65% 47%',
      '--color-destructive-foreground': '0 0% 100%',

      // === BORDERS & INPUTS ===
      '--color-border': '90 10% 88%',
      '--color-input': '90 12% 88%',
      '--color-ring': '123 44% 34%',

      // === SEMANTIC ===
      '--color-success': '123 44% 34%',
      '--color-success-foreground': '0 0% 100%',
      '--color-warning': '38 92% 50%',
      '--color-warning-foreground': '127 15% 12%',
      '--color-info': '125 59% 24%',
      '--color-info-foreground': '0 0% 100%',

      // === ONBOARDING ===
      '--color-onboarding-1': '2 100% 96%',
      '--color-onboarding-1-foreground': '125 56% 8%',
      '--color-onboarding-2': '122 38% 88%',
      '--color-onboarding-2-foreground': '125 59% 24%',
      '--color-onboarding-3': '90 12% 94%',
      '--color-onboarding-3-foreground': '127 15% 12%',

      // === BOTTOM BAR ===
      '--color-bottom-bar': '90 15% 95%',
      '--color-bottom-bar-foreground': '132 12% 10%',
      '--color-bottom-bar-accent': '123 44% 34%',
      '--color-bottom-bar-accent-foreground': '0 0% 100%',
    },
    dark: {
      // === CORE ===
      '--color-primary': '122 42% 52%',
      '--color-primary-foreground': '120 100% 98%',
      '--color-secondary': '132 10% 18%',
      '--color-secondary-foreground': '115 14% 88%',
      '--color-background': '138 8% 9%',
      '--color-foreground': '120 8% 88%',

      // === SURFACES ===
      '--color-card': '136 9% 13%',
      '--color-card-foreground': '120 8% 88%',
      '--color-popover': '134 9% 11%',
      '--color-popover-foreground': '34 20% 90%',

      // === MUTED / ACCENT ===
      '--color-muted': '138 8% 7%',
      '--color-muted-foreground': '130 8% 65%',
      '--color-accent': '122 38% 38%',
      '--color-accent-foreground': '34 25% 92%',

      // === DESTRUCTIVE ===
      '--color-destructive': '1 65% 52%',
      '--color-destructive-foreground': '34 25% 95%',

      // === BORDERS & INPUTS ===
      '--color-border': '132 10% 20%',
      '--color-input': '132 10% 20%',
      '--color-ring': '122 42% 52%',

      // === SEMANTIC ===
      '--color-success': '122 42% 52%',
      '--color-success-foreground': '120 100% 98%',
      '--color-warning': '43 96% 56%',
      '--color-warning-foreground': '138 8% 9%',
      '--color-info': '123 38% 60%',
      '--color-info-foreground': '120 100% 98%',

      // === ONBOARDING ===
      '--color-onboarding-1': '138 8% 7%',
      '--color-onboarding-1-foreground': '115 14% 88%',
      '--color-onboarding-2': '122 38% 38%',
      '--color-onboarding-2-foreground': '34 25% 92%',
      '--color-onboarding-3': '138 7% 7%',
      '--color-onboarding-3-foreground': '120 8% 88%',

      // === BOTTOM BAR ===
      '--color-bottom-bar': '138 9% 6%',
      '--color-bottom-bar-foreground': '110 30% 95%',
      '--color-bottom-bar-accent': '122 42% 52%',
      '--color-bottom-bar-accent-foreground': '0 0% 100%',
    },
  },
  purple: {
    light: {
      '--color-primary': '270 57% 50%',
      '--color-primary-foreground': '0 0% 100%',
      '--color-secondary': '273 100% 93%',
      '--color-secondary-foreground': '272 100% 16%',
      '--color-background': '0 0% 100%',
      '--color-foreground': '272 100% 16%',
      '--color-card': '0 0% 100%',
      '--color-card-foreground': '272 100% 16%',
      '--color-popover': '0 0% 100%',
      '--color-popover-foreground': '272 100% 16%',
      '--color-muted': '273 100% 93%',
      '--color-muted-foreground': '272 81% 38%',
      '--color-accent': '273 100% 93%',
      '--color-accent-foreground': '272 100% 16%',
      '--color-destructive': '0 84% 60%',
      '--color-destructive-foreground': '0 0% 100%',
      '--color-border': '270 100% 86%',
      '--color-input': '270 100% 86%',
      '--color-ring': '270 57% 50%',
      '--color-success': '123 44% 34%',
      '--color-success-foreground': '0 0% 100%',
      '--color-warning': '38 92% 50%',
      '--color-warning-foreground': '240 6% 10%',
      '--color-info': '125 59% 24%',
      '--color-info-foreground': '0 0% 100%',
      '--color-onboarding-1': '228 96% 89%',
      '--color-onboarding-1-foreground': '0 0% 0%',
      '--color-onboarding-2': '288 96% 91%',
      '--color-onboarding-2-foreground': '0 0% 0%',
      '--color-onboarding-3': '32 98% 83%',
      '--color-onboarding-3-foreground': '0 0% 0%',
      '--color-bottom-bar': '267 100% 96%',
      '--color-bottom-bar-foreground': '276 100% 20%',
      '--color-bottom-bar-accent': '270 57% 50%',
      '--color-bottom-bar-accent-foreground': '0 0% 100%',
    },
    dark: {
      '--color-primary': '270 100% 86%',
      '--color-primary-foreground': '272 100% 16%',
      '--color-secondary': '273 100% 26%',
      '--color-secondary-foreground': '273 100% 93%',
      '--color-background': '272 100% 16%',
      '--color-foreground': '273 100% 93%',
      '--color-card': '273 100% 26%',
      '--color-card-foreground': '273 100% 93%',
      '--color-popover': '272 81% 38%',
      '--color-popover-foreground': '273 100% 93%',
      '--color-muted': '272 81% 38%',
      '--color-muted-foreground': '270 100% 86%',
      '--color-accent': '270 57% 50%',
      '--color-accent-foreground': '273 100% 93%',
      '--color-destructive': '0 91% 71%',
      '--color-destructive-foreground': '273 100% 93%',
      '--color-border': '272 81% 38%',
      '--color-input': '270 57% 50%',
      '--color-ring': '269 71% 61%',
      '--color-success': '122 39% 49%',
      '--color-success-foreground': '120 100% 98%',
      '--color-warning': '43 96% 56%',
      '--color-warning-foreground': '131 18% 18%',
      '--color-info': '123 38% 57%',
      '--color-info-foreground': '120 100% 98%',
      '--color-onboarding-1': '228 96% 89%',
      '--color-onboarding-1-foreground': '0 0% 100%',
      '--color-onboarding-2': '288 96% 91%',
      '--color-onboarding-2-foreground': '0 0% 100%',
      '--color-onboarding-3': '32 98% 83%',
      '--color-onboarding-3-foreground': '0 0% 100%',
      '--color-bottom-bar': '272 100% 16%',
      '--color-bottom-bar-foreground': '273 100% 89%',
      '--color-bottom-bar-accent': '272 68% 57%',
      '--color-bottom-bar-accent-foreground': '0 0% 100%',
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
