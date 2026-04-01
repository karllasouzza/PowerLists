import React, { createContext, useState, useContext } from 'react';
import { storage } from '@/data/storage';

const FIRST_ACCESS_KEY = 'app.first_access';

interface SlideContextValue {
  isFirstAccess: boolean;
  completeOnboarding: () => void;
}

const SlideContext = createContext<SlideContextValue | undefined>(undefined);

interface SlideProviderProps {
  readonly children: React.ReactNode;
}

export const SlideProvider = ({ children }: SlideProviderProps) => {
  // MMKV is synchronous — no async loading needed
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(
    () => !storage.getBoolean(FIRST_ACCESS_KEY),
  );

  const completeOnboarding = () => {
    storage.set(FIRST_ACCESS_KEY, true);
    setIsFirstAccess(false);
  };

  return (
    <SlideContext.Provider value={{ isFirstAccess, completeOnboarding }}>
      {children}
    </SlideContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de slides
 */
export const useSlideContext = () => {
  const context = useContext(SlideContext);
  if (context === undefined) {
    throw new Error('useSlideContext deve ser usado dentro de SlideProvider');
  }
  return context;
};

export default SlideContext;
