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
      '--color-secondary': '125 42% 94%',
      '--color-secondary-foreground': '125 59% 24%',
      '--color-background': '42 43% 95%',
      '--color-foreground': '127 10% 18%',

      // === SURFACES ===
      '--color-card': '42 43% 95%',
      '--color-card-foreground': '8 31% 19%',
      '--color-popover': '42 43% 95%',
      '--color-popover-foreground': '8 31% 19%',

      // === MUTED / ACCENT ===
      '--color-muted': '34 25% 92%',
      '--color-muted-foreground': '138 3% 38%',
      '--color-accent': '122 40% 85%',
      '--color-accent-foreground': '125 59% 24%',

      // === DESTRUCTIVE ===
      '--color-destructive': '1 65% 47%',
      '--color-destructive-foreground': '0 0% 100%',

      // === BORDERS & INPUTS ===
      '--color-border': '0 0% 84%',
      '--color-input': '35 26% 83%',
      '--color-ring': '123 44% 34%',

      // === SEMANTIC ===
      '--color-success': '123 44% 34%',
      '--color-success-foreground': '0 0% 100%',
      '--color-warning': '38 92% 50%',
      '--color-warning-foreground': '127 10% 18%',
      '--color-info': '125 59% 24%',
      '--color-info-foreground': '0 0% 100%',

      // === ONBOARDING ===
      '--color-onboarding-1': '2 100% 94%',
      '--color-onboarding-1-foreground': '125 56% 8%',
      '--color-onboarding-2': '122 40% 85%',
      '--color-onboarding-2-foreground': '125 59% 24%',
      '--color-onboarding-3': '34 25% 92%',
      '--color-onboarding-3-foreground': '127 10% 18%',

      // === BOTTOM BAR ===
      '--color-bottom-bar': '43 27% 92%',
      '--color-bottom-bar-foreground': '132 9% 11%',
      '--color-bottom-bar-accent': '123 44% 34%',
      '--color-bottom-bar-accent-foreground': '0 0% 100%',
    },
    dark: {
      // === CORE ===
      '--color-primary': '122 39% 49%',
      '--color-primary-foreground': '120 100% 98%',
      '--color-secondary': '116 11% 26%',
      '--color-secondary-foreground': '115 17% 86%',
      '--color-background': '131 18% 18%',
      '--color-foreground': '120 5% 79%',

      // === SURFACES ===
      '--color-card': '128 14% 22%',
      '--color-card-foreground': '120 5% 79%',
      '--color-popover': '124 15% 20%',
      '--color-popover-foreground': '34 25% 92%',

      // === MUTED / ACCENT ===
      '--color-muted': '128 19% 16%',
      '--color-muted-foreground': '130 6% 60%',
      '--color-accent': '122 40% 40%',
      '--color-accent-foreground': '34 25% 92%',

      // === DESTRUCTIVE ===
      '--color-destructive': '1 65% 47%',
      '--color-destructive-foreground': '34 25% 92%',

      // === BORDERS & INPUTS ===
      '--color-border': '116 11% 26%',
      '--color-input': '116 11% 26%',
      '--color-ring': '122 39% 49%',

      // === SEMANTIC ===
      '--color-success': '122 39% 49%',
      '--color-success-foreground': '120 100% 98%',
      '--color-warning': '43 96% 56%',
      '--color-warning-foreground': '131 18% 18%',
      '--color-info': '123 38% 57%',
      '--color-info-foreground': '120 100% 98%',

      // === ONBOARDING ===
      '--color-onboarding-1': '132 21% 14%',
      '--color-onboarding-1-foreground': '115 17% 86%',
      '--color-onboarding-2': '122 40% 40%',
      '--color-onboarding-2-foreground': '34 25% 92%',
      '--color-onboarding-3': '128 19% 16%',
      '--color-onboarding-3-foreground': '120 5% 79%',

      // === BOTTOM BAR ===
      '--color-bottom-bar': '128 24% 13%',
      '--color-bottom-bar-foreground': '110 37% 97%',
      '--color-bottom-bar-accent': '123 40% 54%',
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
