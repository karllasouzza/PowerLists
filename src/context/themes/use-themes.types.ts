import { IFocusAwareBarsProps } from '@/components/focus-aware-bars';
import { themes } from './theme-config';

export interface ThemeProviderPropsT {
  children: React.ReactNode;
  name?: keyof typeof themes;
  customColorScheme?: 'light' | 'dark';
}

export interface ThemeContextT {
  theme: keyof typeof themes;
  colorScheme: 'light' | 'dark';
  setTheme: (theme: keyof typeof themes) => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
  setStatusBar: (statusBar: IFocusAwareBarsProps['statusBar']) => boolean;
  setNavigationBar: (navigationBar: IFocusAwareBarsProps['navigationBar']) => boolean;
}
