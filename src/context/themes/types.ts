import { themes } from "@/lib/themes";

export interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export interface IUserPreferencesContext {
  theme: keyof typeof themes;
  colorScheme: 'light' | 'dark';
  backgroundColor: string;
  setTheme: (theme: keyof typeof themes) => boolean;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => boolean;
  setBackgroundColor: (color: string | 'default') => boolean;
}
