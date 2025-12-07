import React, { createContext, useState, useEffect, useContext } from 'react';
import { OnboardingContainer } from '../components/onboarding';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se é o primeiro acesso usando MMKV
    const checkFirstAccess = () => {
      const hasCompletedOnboarding = storage.getBoolean(FIRST_ACCESS_KEY);
      setIsFirstAccess(!hasCompletedOnboarding);
      setIsLoading(false);
    };

    checkFirstAccess();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  const goToSlide = (slide: number) => {
    setCurrentSlide(slide);
  };

  const completeOnboarding = () => {
    // Marca que o usuário completou o onboarding
    storage.set(FIRST_ACCESS_KEY, true);
    setIsFirstAccess(false);
  };

  // Aguarda verificação do MMKV antes de renderizar
  if (isLoading) {
    return null;
  }

  const contextValue: SlideContextValue = {
    isFirstAccess,
    completeOnboarding,
  };

  return (
    <SlideContext.Provider value={contextValue}>
      {isFirstAccess && currentSlide < 3 ? (
        <OnboardingContainer
          current_slide={currentSlide}
          nextSlide={nextSlide}
          prevSlide={prevSlide}
          goToSlide={goToSlide}
          completeOnboarding={completeOnboarding}
        />
      ) : (
        children
      )}
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
