import { supabase } from '@/lib/supabase';
import { getUserAuth } from '../actions/auth';

export type UseRealtimeItemsProps = {
  list_id: string;
  items: any[];
  setItems: any;
};

export const useRealtimeItems = async ({ list_id, items, setItems }: UseRealtimeItemsProps) => {
  try {
    const { user } = await getUserAuth();
    if (!user) throw new Error('User not found');

    supabase
      .channel('List_item')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'List_item',
          filter: `lists_id=eq.${list_id}`,
        },
        (payload) => {
          setItems([...items, payload.new]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'List_item',
          filter: `lists_id=eq.${list_id}`,
        },
        (payload) => {
          setItems(items.map((item) => (item.id !== payload.old.id ? item : payload.new)));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'List_item',
          filter: `lists_id=eq.${list_id}`,
        },
        (payload) => {
          const newItem = items.filter((item) => item.id !== payload.old.id);
          setItems(newItem);
        }
      )
      .subscribe();
  } catch (error) {
    console.log(error);
  }
};
