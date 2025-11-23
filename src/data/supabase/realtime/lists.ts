import { supabase } from '@/lib/supabase';
import { getUserAuth } from '../actions/auth.actions';

export type UseRealtimeListsProps = {
  lists: any[];
  setLists: (lists: any[]) => void;
};

export const useRealtimeLists = async ({ lists, setLists }: UseRealtimeListsProps) => {
  const { user } = await getUserAuth();
  if (!user) throw new Error('User not found');

  supabase
    .channel('Lists')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'Lists',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        setLists([...lists, { ...payload.new, List_item: [] }]);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Lists',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        setLists(
          lists.map((list) =>
            list.id !== payload.old.id ? list : { ...payload.new, List_item: list.List_item }
          )
        );
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'Lists',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        const newList = lists.filter((list) => list.id !== payload.old.id);
        setLists(newList);
      }
    )
    .subscribe();
};
