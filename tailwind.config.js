/** @type {import('tailwindcss').Config} */
import { hairlineWidth } from 'nativewind/theme';

export const darkMode = 'class';
export const content = ['./src/**/*.{js,jsx,ts,tsx}', './assets/**/*.{js,jsx,ts,tsx}'];
export const presets = [require('nativewind/preset')];
export const theme = {
  extend: {
    fontFamily: {
      sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
      heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      body: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    colors: {
      // === SEMANTIC TOKEN COLORS ===
      border: 'var(--color-border)',
      input: 'var(--color-input)',
      ring: 'var(--color-ring)',
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
      primary: {
        DEFAULT: 'var(--color-primary)',
        foreground: 'var(--color-primary-foreground)',
      },
      secondary: {
        DEFAULT: 'var(--color-secondary)',
        foreground: 'var(--color-secondary-foreground)',
      },
      destructive: {
        DEFAULT: 'var(--color-destructive)',
        foreground: 'var(--color-destructive-foreground)',
      },
      muted: {
        DEFAULT: 'var(--color-muted)',
        foreground: 'var(--color-muted-foreground)',
      },
      accent: {
        DEFAULT: 'var(--color-accent)',
        foreground: 'var(--color-accent-foreground)',
      },
      popover: {
        DEFAULT: 'var(--color-popover)',
        foreground: 'var(--color-popover-foreground)',
      },
      card: {
        DEFAULT: 'var(--color-card)',
        foreground: 'var(--color-card-foreground)',
      },
      success: {
        DEFAULT: 'var(--color-success)',
        foreground: 'var(--color-success-foreground)',
      },
      warning: {
        DEFAULT: 'var(--color-warning)',
        foreground: 'var(--color-warning-foreground)',
      },
      info: {
        DEFAULT: 'var(--color-info)',
        foreground: 'var(--color-info-foreground)',
      },
      'onboarding-1': {
        DEFAULT: 'var(--color-onboarding-1)',
        foreground: 'var(--color-onboarding-1-foreground)',
      },
      'onboarding-2': {
        DEFAULT: 'var(--color-onboarding-2)',
        foreground: 'var(--color-onboarding-2-foreground)',
      },
      'onboarding-3': {
        DEFAULT: 'var(--color-onboarding-3)',
        foreground: 'var(--color-onboarding-3-foreground)',
      },
      'bottom-bar': {
        DEFAULT: 'var(--color-bottom-bar)',
        foreground: 'var(--color-bottom-bar-foreground)',
        accent: 'var(--color-bottom-bar-accent)',
        'accent-foreground': 'var(--color-bottom-bar-accent-foreground)',
      },

      // === COLOR SCALES ===
      'moss-green': {
        50: 'var(--color-moss-green-50)',
        100: 'var(--color-moss-green-100)',
        200: 'var(--color-moss-green-200)',
        300: 'var(--color-moss-green-300)',
        400: 'var(--color-moss-green-400)',
        500: 'var(--color-moss-green-500)',
        600: 'var(--color-moss-green-600)',
        700: 'var(--color-moss-green-700)',
        800: 'var(--color-moss-green-800)',
        900: 'var(--color-moss-green-900)',
        950: 'var(--color-moss-green-950)',
      },
      beige: {
        50: 'var(--color-beige-50)',
        100: 'var(--color-beige-100)',
        200: 'var(--color-beige-200)',
        300: 'var(--color-beige-300)',
        400: 'var(--color-beige-400)',
        500: 'var(--color-beige-500)',
        600: 'var(--color-beige-600)',
        700: 'var(--color-beige-700)',
        800: 'var(--color-beige-800)',
        900: 'var(--color-beige-900)',
        950: 'var(--color-beige-950)',
      },
      'bright-snow': {
        50: 'var(--color-bright-snow-50)',
        100: 'var(--color-bright-snow-100)',
        200: 'var(--color-bright-snow-200)',
        300: 'var(--color-bright-snow-300)',
        400: 'var(--color-bright-snow-400)',
        500: 'var(--color-bright-snow-500)',
        600: 'var(--color-bright-snow-600)',
        700: 'var(--color-bright-snow-700)',
        800: 'var(--color-bright-snow-800)',
        900: 'var(--color-bright-snow-900)',
        950: 'var(--color-bright-snow-950)',
      },
      'mint-cream': {
        50: 'var(--color-mint-cream-50)',
        100: 'var(--color-mint-cream-100)',
        200: 'var(--color-mint-cream-200)',
        300: 'var(--color-mint-cream-300)',
        400: 'var(--color-mint-cream-400)',
        500: 'var(--color-mint-cream-500)',
        600: 'var(--color-mint-cream-600)',
        700: 'var(--color-mint-cream-700)',
        800: 'var(--color-mint-cream-800)',
        900: 'var(--color-mint-cream-900)',
        950: 'var(--color-mint-cream-950)',
      },
      'hunter-green': {
        50: 'var(--color-hunter-green-50)',
        100: 'var(--color-hunter-green-100)',
        200: 'var(--color-hunter-green-200)',
        300: 'var(--color-hunter-green-300)',
        400: 'var(--color-hunter-green-400)',
        500: 'var(--color-hunter-green-500)',
        600: 'var(--color-hunter-green-600)',
        700: 'var(--color-hunter-green-700)',
        800: 'var(--color-hunter-green-800)',
        900: 'var(--color-hunter-green-900)',
        950: 'var(--color-hunter-green-950)',
      },
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
    borderWidth: {
      hairline: hairlineWidth(),
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
};
export const future = {
  hoverOnlyWhenSupported: true,
};
export const plugins = [require('tailwindcss-animate')];
