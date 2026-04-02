import { firstAccess$, FIRST_ACCESS_STORAGE_KEY } from '@/data/states/first-access';
import { storage } from '@/data/storage';

export const completeFirstAccess = (): boolean => {
  try {
    storage.set(FIRST_ACCESS_STORAGE_KEY, true);
    firstAccess$.hasCompletedOnboarding.set(true);
    return true;
  } catch (error) {
    console.error('Error completing first access:', error);
    return false;
  }
};
