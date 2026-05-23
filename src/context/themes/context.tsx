import { createContext, useContext } from 'react';
import { IUserPreferencesContext } from './types';

export const UserPreferencesContext = createContext<IUserPreferencesContext | undefined>(undefined);

/**
 * Hook to access the user preferences context.
 * @returns {IUserPreferencesContext} The user preferences context value.
 * @throws {Error} If used outside of a UserPreferencesProvider.
 */
export const useUserPreferences = (): IUserPreferencesContext => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
