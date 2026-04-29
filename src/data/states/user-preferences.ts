import { themes } from '@/lib/themes';
import { type Observable, observable } from '@legendapp/state';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { synced } from '@legendapp/state/sync';

export type UserPreferences = {
  theme: keyof typeof themes;
  colorScheme: 'light' | 'dark' | 'system';
  backgroundColor: string;
};

const userPreferencesState$: Observable<UserPreferences> = observable(
  synced({
    initial: {
      theme: 'default',
      colorScheme: 'system',
      backgroundColor: '--color-background',
    },
    persist: {
      name: 'userPreferences',
      plugin: ObservablePersistMMKV,
      retrySync: true,
    },
  }),
) as Observable<UserPreferences>;

export default userPreferencesState$;
