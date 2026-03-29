import { createContext, useContext } from 'react';
import { ThemeContextT } from './types';

export const ThemeContext = createContext<ThemeContextT | undefined>(undefined);

/**
 * Hook para acessar o contexto de tema
 * @throws {Error} Se usado fora do ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
