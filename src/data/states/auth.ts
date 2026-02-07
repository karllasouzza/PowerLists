import { observable } from '@legendapp/state';
import { synced } from '@legendapp/state/sync';
import { MMKVPersistPluginWrapper } from '@/data/storage';

import type { UserType } from '@/data/types/user';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  user: UserType;
  session: Session | null;
  isInitialized: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isInitialized: false,
  isLoading: false,
};

export const auth$ = observable({
  user: synced({
    initial: null as UserType,
    persist: {
      name: 'local_user',
      plugin: MMKVPersistPluginWrapper,
      retrySync: true,
    },
  }),
  session: initialState.session,
  isInitialized: initialState.isInitialized,
  isLoading: initialState.isLoading,
});
