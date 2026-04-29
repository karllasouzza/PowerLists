import { firstAccess$ } from '@/data/states/first-access';

export const completeFirstAccess = (): boolean => {
  try {
    firstAccess$.set(true);
    return true;
  } catch (error) {
    console.error('Error completing first access:', error);
    return false;
  }
};

export const resetFirstAccessState = (): void => {
  firstAccess$.set(false);
};
