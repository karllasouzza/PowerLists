'use server';

import { observable } from '@legendapp/state';
import humps from 'humps';
import { generateId } from '../utils';
import { cachedUserId, customSynced } from '../database';
import type {
  ListItemType,
  CreateListItemProps,
  CreateNewListItemResult,
  UpdateListItemProps,
  ToggleCheckListItemProps,
  DeleteListItemProps,
  GetListItemsByListIdProps,
  GetListItemsByListIdResult,
} from '../types';

// Create observable for list items with Supabase sync
export const listItems$ = observable(
  customSynced({
    collection: 'list_items',
    select: (from: any) => from.select('*'),
    filter: (select: any) => select.eq('profile_id', cachedUserId),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'list_items', retrySync: true },
    changesSince: 'last-sync',
  })
);

// Initialize sync by getting the observable
listItems$.get();

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
    const camelizedItems = humps.camelizeKeys(allItems) as ListItemType[];
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
    if (!cachedUserId) throw new Error('User not authenticated');
    if (!title || !amount || !listId) throw new Error('Missing required fields');

    const id = generateId();
    if (!id) throw new Error('Failed to generate ID');

    // Convert to snake_case for Supabase
    const payload = humps.decamelizeKeys({
      id,
      profileId: cachedUserId,
      listId,
      title,
      price: price || 0,
      amount,
      isChecked: isChecked ?? false,
      createdAt: new Date().toISOString(),
    });
    if (!payload) throw new Error('Failed to convert to snake_case');

    // Add to observable - this will trigger sync to Supabase
    listItems$[id].set(payload as ListItemType);

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

    const updatedListItem = humps.decamelizeKeys({
      title: title || updatedListItemRaw.title,
      price: price || updatedListItemRaw.price,
      amount: amount || updatedListItemRaw.amount,
      isChecked: isChecked || updatedListItemRaw.is_checked,
    }) as Omit<UpdateListItemProps, 'id'>;
    if (!updatedListItem) throw new Error('Failed to convert to snake_case');

    // Update in observable
    listItems$[id].set(updatedListItem);

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
