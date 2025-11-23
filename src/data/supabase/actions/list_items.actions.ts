import { supabase } from '@/lib/supabase';
import humps from 'humps';
import {
  CheckListItemProps,
  CreateListItemProps,
  CreateNewListItemResult,
  DeleteListItemProps,
  GetListItemsProps,
  GetListItemsResult,
  ListItemType,
  UpdateListItemProps,
  UpdateListItemResult,
} from '../../types';

export const getItems = async ({ listId }: GetListItemsProps): Promise<GetListItemsResult> => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`*`)
      .eq('lists_id', listId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) throw new Error('Data not found');

    return { results: humps.camelizeKeys(data) as ListItemType[] };
  } catch (error) {
    console.log(error);
    return { results: null };
  }
};

export const newItem = async ({
  title,
  price,
  amount,
  listId,
  isChecked,
}: CreateListItemProps): Promise<CreateNewListItemResult> => {
  try {
    if (!title || !price || !amount || !listId) throw new Error('Missing required fields');

    const payload = humps.decamelizeKeys({
      title,
      price,
      isChecked: isChecked ?? false,
      amount,
      listId,
    });

    if (!payload) throw new Error('Payload not found');

    const { data, error } = await supabase.from('items').insert(payload).select().single();

    if (error) throw error;

    return { newListItem: humps.camelizeKeys(data) as ListItemType };
  } catch (error) {
    console.log(error);
    return { newListItem: null };
  }
};

export const checkItem = async ({ id, isChecked }: CheckListItemProps): Promise<boolean> => {
  try {
    const { error } = await supabase.from('items').update({ is_checked: isChecked }).eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const editItem = async ({
  id,
  title,
  price,
  amount,
  isChecked,
}: UpdateListItemProps): Promise<UpdateListItemResult> => {
  try {
    if (!id && (!title || !price || !amount || isChecked === undefined))
      throw new Error('Missing required fields');
    const payload = humps.decamelizeKeys({ title, price, amount, isChecked });
    const { data, error } = await supabase
      .from('items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { editItem: humps.camelizeKeys(data) as ListItemType };
  } catch (error) {
    console.log(error);
    return { editItem: null };
  }
};

export const deleteItems = async ({ itemId }: DeleteListItemProps): Promise<boolean> => {
  try {
    const { error } = await supabase.from('items').delete().eq('id', itemId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
