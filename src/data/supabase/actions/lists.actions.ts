import { supabase } from '@/lib/supabase';
import humps from 'humps';
import {
  GetAllListsResults,
  GetAllListsProps,
  ListType,
  CreateNewListProps,
  CreateNewListResult,
  UpdateListResult,
  UpdateListProps,
  DeleteListProps,
} from '../../types';

export const getAllLists = async ({ profileId }: GetAllListsProps): Promise<GetAllListsResults> => {
  try {
    if (!profileId) throw new Error('Missing required fields');

    const { data, error } = await supabase
      .from('lists')
      .select(`*`)
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!data) throw new Error('Data not found');

    return { results: humps.camelizeKeys(data) as ListType[] };
  } catch (error) {
    console.log(error);
    return { results: null };
  }
};

export const createNewList = async ({
  profileId,
  title,
  accentColor,
  icon,
}: CreateNewListProps): Promise<CreateNewListResult> => {
  try {
    if (!title || !accentColor || !icon) throw new Error('Missing required fields');

    if (!profileId) throw new Error('Profile ID not found');

    const payload = humps.decamelizeKeys({
      profileId,
      title,
      accentColor,
      icon,
    });
    if (!payload) throw new Error('Payload not found');

    const { data, error } = await supabase.from('lists').insert(payload).select().single();

    if (error) throw error;
    if (!data) throw new Error('Data not found');

    return { newList: humps.camelizeKeys(data) as ListType };
  } catch (error) {
    console.log(error);
    return { newList: null };
  }
};

export const updateList = async ({
  id,
  title,
  accentColor,
  icon,
}: UpdateListProps): Promise<UpdateListResult> => {
  try {
    if (!id && (!title || !accentColor || !icon)) throw new Error('Missing required fields');

    const payload = humps.decamelizeKeys({ title, accentColor, icon });
    if (!payload) throw new Error('Payload not found');

    const { data, error } = await supabase
      .from('lists')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new Error('Data not found');

    return { editList: humps.camelizeKeys(data) as ListType };
  } catch (error) {
    console.log(error);
    return { editList: null };
  }
};

export const deleteList = async ({ id }: DeleteListProps): Promise<boolean> => {
  try {
    if (!id) throw new Error('Missing required fields');

    const { error } = await supabase.from('lists').delete().eq('id', id);
    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
