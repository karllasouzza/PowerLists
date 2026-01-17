import { themes } from './theme-config';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface ThemeContextT {
  theme: keyof typeof themes;
  colorScheme: 'light' | 'dark';
  backgroundColor: string;
  setTheme: (theme: keyof typeof themes | 'default') => boolean;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => boolean;
  setBackgroundColor: (color: string | 'default') => boolean;
}
