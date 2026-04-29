import { observable } from '@legendapp/state';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId, supabaseSynced } from '../database';

export const listItems$ = observable(
  supabaseSynced({
    initial: {} as Record<string, any>,
    supabase,
    collection: 'list_items',
    select: (from: any) => from.select('*'),
    filter: (select: any) => select.eq('profile_id', getCurrentUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'list_items' },
    retry: {
      infinite: true,
    },
    realtime: {
      get filter() {
        return `profile_id=eq.${getCurrentUserId()}`;
      },
    },
  }),
);
