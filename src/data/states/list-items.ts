import { observable } from '@legendapp/state';
import { Database, supabase } from '@/lib/supabase';
import { convertFromSupabaseFormat, convertToSupabaseFormat } from '@/lib/supabase/utils';

import { getCurrentUserId, customSynced } from '../database';
import { storage } from '../storage';
import { generateId } from '../utils';
import type {
  CreateListItemProps,
  CreateNewListItemResult,
  UpdateListItemProps,
  ToggleCheckListItemProps,
  DeleteListItemProps,
  GetListItemsByListIdProps,
  GetListItemsByListIdResult,
  ListItem,
} from '../types';

export const listItems$ = observable(
  customSynced({
    initial: {} as Record<string, any>,
    supabase,
    collection: 'list_items',
    select: (from: any) => from.select('*'),
    // filter: (select: any) => select.eq('profile_id', getCurrentUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'list_items', retrySync: true },
    retry: {
      infinite: true,
    },
  }),
);

export const getAllListItems = (): ListItem[] | null => {
  try {
    const itemsData = listItems$.get();
    const itemsArray = Object.values(itemsData || {});

    const camelizedItems = convertFromSupabaseFormat(itemsArray) as ListItem[];
    return camelizedItems as ListItem[];
  } catch (error) {
    console.error('Error getting all list items:', error);
    return null;
  }
};

/**
 * Get all items for a specific list
 */
export const getListItemsByListId = async ({
  listId,
}: GetListItemsByListIdProps): Promise<GetListItemsByListIdResult> => {
  try {
    if (!listId) throw new Error('Missing required fields');

    const itemsData = listItems$.get();
    const allItems = Object.values(itemsData || {});
    if (!allItems) throw new Error('Items not found');

    // Convert snake_case to camelCase
    const camelizedItems = convertFromSupabaseFormat(allItems) as ListItem[];
    if (!camelizedItems) throw new Error('Failed to convert to camelCase');

    const filteredItems = camelizedItems.filter((item) => item.listId === listId);
    if (!filteredItems) throw new Error('Items not found after filtering');

    return { results: filteredItems };
  } catch (error) {
    console.error('Error getting items:', error);
    return { results: null };
  }
};

/**
 * Create a new list item
 */
export const createNewListItem = async ({
  title,
  price,
  amount,
  listId,
  isChecked,
}: CreateListItemProps): Promise<CreateNewListItemResult> => {
  try {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User not authenticated');
    if (!title || amount === null || amount === undefined || !listId)
      throw new Error('Missing required fields');

    const id = generateId();
    if (!id) throw new Error('Failed to generate ID');

    // Convert to snake_case for Supabase
    const payload = convertToSupabaseFormat({
      id,
      profileId: currentUserId,
      listId,
      title,
      price: price ?? null,
      amount,
      isChecked: isChecked ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deleted: null,
    }) as Database['public']['Tables']['list_items']['Row'];

    if (!payload) throw new Error('Failed to convert to snake_case');

    // Add to observable - this will trigger sync to Supabase
    listItems$[id].set(payload);

    return true;
  } catch (error) {
    console.error('Error creating item:', error);
    return false;
  }
};

/**
 * Toggle item checked status
 */
export const toggleCheckListItem = async ({
  id,
  isChecked,
}: ToggleCheckListItemProps): Promise<boolean> => {
  try {
    if (!id || typeof isChecked !== 'boolean') throw new Error('Missing required fields');

    // Update in observable using snake_case - this will trigger sync to Supabase
    listItems$[id].is_checked.set(isChecked);

    return true;
  } catch (error) {
    console.error('Error checking item:', error);
    return false;
  }
};

/**
 * Update an existing list item
 */
export const updateListItem = async ({
  id,
  title,
  price,
  amount,
  isChecked,
}: UpdateListItemProps): Promise<boolean> => {
  try {
    if (!id || typeof isChecked !== 'boolean') throw new Error('Missing required fields');

    const updatedListItemRaw = listItems$[id].get();
    if (!updatedListItemRaw) throw new Error('Item not found');

    const updatedListItem = convertToSupabaseFormat({
      title: title ?? updatedListItemRaw.title,
      price: price ?? updatedListItemRaw.price,
      amount: amount ?? updatedListItemRaw.amount,
      isChecked: isChecked ?? updatedListItemRaw.is_checked,
    }) as Database['public']['Tables']['list_items']['Update'];
    if (!updatedListItem) throw new Error('Failed to convert to snake_case');

    // Update in observable
    const mergedListItem = {
      ...updatedListItemRaw,
      ...updatedListItem,
    } as Database['public']['Tables']['list_items']['Row'];

    listItems$[id].set(mergedListItem);

    return true;
  } catch (error) {
    console.error('Error updating item:', error);
    return false;
  }
};

/**
 * Delete a list item
 */
export const deleteListItem = async ({ itemId }: DeleteListItemProps): Promise<boolean> => {
  try {
    if (!itemId) throw new Error('Missing required fields');

    // Delete from observable - this will trigger sync to Supabase
    listItems$[itemId].delete();

    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    return false;
  }
};

export const resetListItemsStore = (): void => {
  listItems$?.set({} as Record<string, any>);
  storage.remove('list_items');
  storage.remove('list_items__metadata');
};
