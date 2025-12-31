import { IFocusAwareBarsProps } from '@/components/focus-aware-bars';
import { themes } from './theme-config';

export interface ThemeProviderPropsT {
  children: React.ReactNode;
  name?: keyof typeof themes;
  customColorScheme?: 'light' | 'dark';
}

export interface ThemeContextT {
  color: string;
  colorScheme: 'light' | 'dark';
  theme: keyof typeof themes;
  setTheme: (theme: keyof typeof themes) => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
  setBars: (bars: IFocusAwareBarsProps) => boolean;
}
