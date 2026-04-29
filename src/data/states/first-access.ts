import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

export const FIRST_ACCESS_STORAGE_KEY = 'app.first_access';

export const firstAccess$ = observable(
  synced({
    initial: false,
    persist: {
      name: FIRST_ACCESS_STORAGE_KEY,
      plugin: ObservablePersistMMKV,
      retrySync: true,
    },
  }),
);
