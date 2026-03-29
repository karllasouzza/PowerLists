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
      border: 'hsl(var(--color-border))',
      input: 'hsl(var(--color-input))',
      ring: 'hsl(var(--color-ring))',
      background: 'hsl(var(--color-background))',
      foreground: 'hsl(var(--color-foreground))',
      primary: {
        DEFAULT: 'hsl(var(--color-primary))',
        foreground: 'hsl(var(--color-primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--color-secondary))',
        foreground: 'hsl(var(--color-secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--color-destructive))',
        foreground: 'hsl(var(--color-destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--color-muted))',
        foreground: 'hsl(var(--color-muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--color-accent))',
        foreground: 'hsl(var(--color-accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--color-popover))',
        foreground: 'hsl(var(--color-popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--color-card))',
        foreground: 'hsl(var(--color-card-foreground))',
      },
      success: {
        DEFAULT: 'hsl(var(--color-success))',
        foreground: 'hsl(var(--color-success-foreground))',
      },
      warning: {
        DEFAULT: 'hsl(var(--color-warning))',
        foreground: 'hsl(var(--color-warning-foreground))',
      },
      info: {
        DEFAULT: 'hsl(var(--color-info))',
        foreground: 'hsl(var(--color-info-foreground))',
      },
      'onboarding-1': {
        DEFAULT: 'hsl(var(--color-onboarding-1))',
        foreground: 'hsl(var(--color-onboarding-1-foreground))',
      },
      'onboarding-2': {
        DEFAULT: 'hsl(var(--color-onboarding-2))',
        foreground: 'hsl(var(--color-onboarding-2-foreground))',
      },
      'onboarding-3': {
        DEFAULT: 'hsl(var(--color-onboarding-3))',
        foreground: 'hsl(var(--color-onboarding-3-foreground))',
      },
      'bottom-bar': {
        DEFAULT: 'hsl(var(--color-bottom-bar))',
        foreground: 'hsl(var(--color-bottom-bar-foreground))',
        accent: 'hsl(var(--color-bottom-bar-accent))',
        'accent-foreground': 'hsl(var(--color-bottom-bar-accent-foreground))',
      },

      // === COLOR SCALES ===
      'moss-green': {
        50: 'hsl(var(--color-moss-green-50))',
        100: 'hsl(var(--color-moss-green-100))',
        200: 'hsl(var(--color-moss-green-200))',
        300: 'hsl(var(--color-moss-green-300))',
        400: 'hsl(var(--color-moss-green-400))',
        500: 'hsl(var(--color-moss-green-500))',
        600: 'hsl(var(--color-moss-green-600))',
        700: 'hsl(var(--color-moss-green-700))',
        800: 'hsl(var(--color-moss-green-800))',
        900: 'hsl(var(--color-moss-green-900))',
        950: 'hsl(var(--color-moss-green-950))',
      },
      beige: {
        50: 'hsl(var(--color-beige-50))',
        100: 'hsl(var(--color-beige-100))',
        200: 'hsl(var(--color-beige-200))',
        300: 'hsl(var(--color-beige-300))',
        400: 'hsl(var(--color-beige-400))',
        500: 'hsl(var(--color-beige-500))',
        600: 'hsl(var(--color-beige-600))',
        700: 'hsl(var(--color-beige-700))',
        800: 'hsl(var(--color-beige-800))',
        900: 'hsl(var(--color-beige-900))',
        950: 'hsl(var(--color-beige-950))',
      },
      'bright-snow': {
        50: 'hsl(var(--color-bright-snow-50))',
        100: 'hsl(var(--color-bright-snow-100))',
        200: 'hsl(var(--color-bright-snow-200))',
        300: 'hsl(var(--color-bright-snow-300))',
        400: 'hsl(var(--color-bright-snow-400))',
        500: 'hsl(var(--color-bright-snow-500))',
        600: 'hsl(var(--color-bright-snow-600))',
        700: 'hsl(var(--color-bright-snow-700))',
        800: 'hsl(var(--color-bright-snow-800))',
        900: 'hsl(var(--color-bright-snow-900))',
        950: 'hsl(var(--color-bright-snow-950))',
      },
      'mint-cream': {
        50: 'hsl(var(--color-mint-cream-50))',
        100: 'hsl(var(--color-mint-cream-100))',
        200: 'hsl(var(--color-mint-cream-200))',
        300: 'hsl(var(--color-mint-cream-300))',
        400: 'hsl(var(--color-mint-cream-400))',
        500: 'hsl(var(--color-mint-cream-500))',
        600: 'hsl(var(--color-mint-cream-600))',
        700: 'hsl(var(--color-mint-cream-700))',
        800: 'hsl(var(--color-mint-cream-800))',
        900: 'hsl(var(--color-mint-cream-900))',
        950: 'hsl(var(--color-mint-cream-950))',
      },
      'hunter-green': {
        50: 'hsl(var(--color-hunter-green-50))',
        100: 'hsl(var(--color-hunter-green-100))',
        200: 'hsl(var(--color-hunter-green-200))',
        300: 'hsl(var(--color-hunter-green-300))',
        400: 'hsl(var(--color-hunter-green-400))',
        500: 'hsl(var(--color-hunter-green-500))',
        600: 'hsl(var(--color-hunter-green-600))',
        700: 'hsl(var(--color-hunter-green-700))',
        800: 'hsl(var(--color-hunter-green-800))',
        900: 'hsl(var(--color-hunter-green-900))',
        950: 'hsl(var(--color-hunter-green-950))',
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
