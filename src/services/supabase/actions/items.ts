import { supabase } from '@/lib/supabase';
import {
  CheckItemProps,
  DeleteItemsProps,
  EditItemProps,
  EditItemResult,
  GetItemsProps,
  GetItemsResult,
  NewItemProps,
} from '../types';

export const getItems = async ({ list_id }: GetItemsProps): Promise<GetItemsResult> => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`*`)
      .eq('lists_id', list_id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) throw new Error('Data not found');

    return { results: data };
  } catch (error) {
    console.log(error);
    return { results: null };
  }
};

export const newItem = async ({ title, price, amount, list_id }: NewItemProps) => {
  try {
    const { error } = await supabase.from('items').insert({
      title: title,
      price: price,
      status: false,
      amount: amount,
      lists_id: list_id,
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const checkItem = async ({ id, status }: CheckItemProps): Promise<boolean> => {
  try {
    const { error } = await supabase.from('items').update({ status }).eq('id', id);

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
}: EditItemProps): Promise<EditItemResult> => {
  try {
    const { data, error } = await supabase
      .from('items')
      .update({ title, price, amount })
      .eq('id', id)
      .single();

    if (error) throw error;

    return { edit_item: data };
  } catch (error) {
    console.log(error);
    return { edit_item: null };
  }
};

export const deleteItems = async ({ itemId }: DeleteItemsProps) => {
  try {
    const { error } = await supabase.from('items').delete().eq('id', itemId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
  }
};
