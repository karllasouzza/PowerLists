import { supabase } from '@/lib/supabase';
import { EditListResult, GetAllListsResults, listType, AddNewListResult } from '../types/list.type';
import { getUserAuth } from './auth';

export const getAllLists = async (): Promise<GetAllListsResults> => {
  try {
    const { user } = await getUserAuth();
    if (!user) throw new Error('User not found');
    const { data, error } = await supabase
      .from('Lists')
      .select(`*`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) throw new Error('Data not found');

    return { results: data };
  } catch (error) {
    console.log(error);
    return { results: null };
  }
};

export const addNewList = async ({
  title,
  accent_color,
  icon,
}: Pick<listType, 'title' | 'accent_color' | 'icon'>): Promise<AddNewListResult> => {
  try {
    if (!title || !accent_color || !icon) throw new Error('Missing required fields');

    const { user } = await getUserAuth();
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('Lists')
      .insert({
        user_id: user.id,
        title,
        accent_color,
        icon,
      })
      .single();

    if (error) throw error;

    return { new_list: data };
  } catch (error) {
    console.log(error);
    return { new_list: null };
  }
};

export const editList = async ({
  id,
  title,
  accent_color,
  icon,
}: Partial<listType>): Promise<EditListResult> => {
  try {
    if (!id && (!title || !accent_color || !icon)) throw new Error('Missing required fields');

    const { data, error } = await supabase
      .from('Lists')
      .update({ title, accent_color, icon })
      .eq('id', id)
      .single();

    if (error) throw error;

    return { edit_list: data };
  } catch (error) {
    console.log(error);
    return { edit_list: null };
  }
};

export const deleteList = async ({ id }: Pick<listType, 'id'>): Promise<boolean> => {
  try {
    if (!id) throw new Error('Missing required fields');

    const { error } = await supabase.from('Lists').delete().eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
