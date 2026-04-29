import { observable } from '@legendapp/state';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId, supabaseSynced } from '../database';

export const lists$ = observable(
  supabaseSynced({
    initial: {} as Record<string, any>,
    supabase,
    collection: 'lists',
    select: (from: any) =>
      from.select(
        'id,profile_id,title,accent_color,icon,created_at,updated_at,deleted, list_items(is_checked,amount,price)',
      ),
    filter: (select: any) => select.eq('profile_id', getCurrentUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'lists', retrySync: true },
    realtime: {
      get filter() {
        return `profile_id=eq.${getCurrentUserId()}`;
      },
    },
    retry: {
      infinite: true,
    },
  }),
);
