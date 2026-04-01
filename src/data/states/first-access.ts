import { observable } from '@legendapp/state';
import { storage } from '@/data/storage';

export const FIRST_ACCESS_STORAGE_KEY = 'app.first_access';

export const firstAccess$ = observable({
  hasCompletedOnboarding: Boolean(storage.getBoolean(FIRST_ACCESS_STORAGE_KEY)),
});

export const resetFirstAccessState = (): void => {
  firstAccess$.hasCompletedOnboarding.set(false);
  storage.delete(FIRST_ACCESS_STORAGE_KEY);
};
