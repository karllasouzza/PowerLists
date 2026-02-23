import { observable } from '@legendapp/state';
import { AuthError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { convertFromSupabaseFormat, convertToSupabaseFormat } from '@/lib/supabase/utils';
import { getCurrentUserId, customSynced } from '../database';
import { storage } from '../storage';
import { generateId } from '../utils';
import type { CreateNewListProps, List, UpdateListProps } from '../types';
import { resetListItemsStore } from './list-items';

export const lists$ = observable(
  customSynced({
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
  }),
);

interface getAllListsResult {
  results: List[] | null;
  error: Error | AuthError | null;
}

/**
 * Retrieves all lists from the data store.
 *
 * Fetches the lists data, converts it from an object to an array, and camelizes
 * the keys for consistency with TypeScript naming conventions.
 *
 * @returns {Promise<getAllListsResult>} A promise that resolves to an object containing:
 *   - `results`: An array of camelized list objects, or null if an error occurs
 *   - `error`: null if successful, or an Error object if an error occurs
 *
 * @throws Does not throw; errors are caught and returned in the result object
 *
 * @example
 * ```typescript
 * const { results, error } = await getAllLists();
 * if (error) {
 *   console.error('Failed to retrieve lists:', error);
 * } else {
 *   console.log('Lists retrieved:', results);
 * }
 * ```
 */
export const getAllLists = async (): Promise<getAllListsResult> => {
  try {
    const listsData = lists$.get();

    const listsArray = Object.values(listsData || {});
    const camelizedLists = convertFromSupabaseFormat(listsArray) as List[];
    return { results: camelizedLists, error: null };
  } catch (error) {
    console.error('Error getting lists:', error);
    return {
      results: null,
      error:
        error instanceof Error || error instanceof AuthError ? error : new Error('Unknown error'),
    };
  }
};

interface createNewListResult {
  newList: List | null;
  error: Error | AuthError | null;
}

/**
 * Creates a new list for the currently authenticated user.
 *
 * @param params - The properties required to create a new list, excluding `profileId`.
 * @param params.title - The title of the new list.
 * @param params.accentColor - The accent color for the list.
 * @param params.icon - The icon representing the list.
 * @returns A promise that resolves to an object containing the newly created list (`newList`) and an error (`error`) if any occurred.
 *
 * @throws {Error} If the user is not authenticated or required fields are missing.
 *
 * @example
 * ```typescript
 * const { newList, error } = await createNewList({
 *   title: 'Groceries',
 *   accentColor: '#FF5733',
 *   icon: 'shopping-cart'
 * });
 * ```
 */
export const createNewList = async ({
  title,
  accentColor,
  icon,
}: Omit<CreateNewListProps, 'profileId'>): Promise<createNewListResult> => {
  try {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User not authenticated');
    if (!title || !accentColor || !icon) throw new Error('Missing required fields');

    const id = generateId();

    const payload = convertToSupabaseFormat({
      id,
      profileId: currentUserId,
      title,
      accentColor,
      icon,
      createdAt: new Date().toISOString(),
    });
    if (!payload) throw new Error('Failed to create list');

    // Add to observable - this will trigger sync to Supabase
    lists$[id].set(payload as any);

    const newList: List = {
      id,
      profileId: currentUserId,
      title,
      accentColor,
      icon,
      createdAt: new Date().toISOString(),
    };

    return { newList, error: null };
  } catch (error) {
    console.error('Error creating list:', error);
    return {
      newList: null,
      error:
        error instanceof Error || error instanceof AuthError ? error : new Error('Unknown error'),
    };
  }
};

interface updateListResult {
  editList: List | null;
  error: Error | AuthError | null;
}

/**
 * Updates an existing list with the provided properties.
 *
 * @param params - An object containing the list properties to update:
 *   - `id`: The unique identifier of the list.
 *   - `title`: The new title for the list.
 *   - `accentColor`: The new accent color for the list.
 *   - `icon`: The new icon for the list.
 *   (Excludes `profileId` and `createdAt`.)
 * @returns A promise that resolves to an object containing:
 *   - `editList`: The updated list object if successful, otherwise `null`.
 *   - `error`: An error object if the update fails, otherwise `null`.
 *
 * @throws Will throw an error if any required fields are missing.
 */
export const updateList = async ({
  id,
  title,
  accentColor,
  icon,
}: Omit<UpdateListProps, 'profileId' | 'createdAt'>): Promise<updateListResult> => {
  try {
    if (!id || !title || !accentColor || !icon) throw new Error('Missing required fields');

    // Update in observable using snake_case - this will trigger sync to Supabase
    lists$[id].title.set(title);
    lists$[id].accent_color.set(accentColor);
    lists$[id].icon.set(icon);

    const updatedListRaw = lists$[id].get();
    const updatedList = convertFromSupabaseFormat(updatedListRaw) as List;

    return { editList: updatedList, error: null };
  } catch (error) {
    console.error('Error updating list:', error);
    return {
      editList: null,
      error:
        error instanceof Error || error instanceof AuthError ? error : new Error('Unknown error'),
    };
  }
};

interface deleteListResult {
  deletedId: string | null;
  error: Error | AuthError | null;
}

/**
 * Deletes a list by its ID.
 *
 * This function removes the list from the observable store, which will trigger synchronization with Supabase.
 * If the ID is missing or an error occurs during deletion, it returns an error in the result.
 *
 * @param {Object} params - The parameters for deleting a list.
 * @param {string} params.id - The unique identifier of the list to delete.
 * @returns {Promise<deleteListResult>} A promise that resolves to an object containing the deleted list's ID or an error.
 */
export const deleteList = async ({ id }: { id: string }): Promise<deleteListResult> => {
  try {
    if (!id) throw new Error('Missing required fields');

    // Delete from observable - this will trigger sync to Supabase
    lists$[id].delete();

    return { deletedId: id, error: null };
  } catch (error) {
    console.error('Error deleting list:', error);
    return {
      deletedId: null,
      error:
        error instanceof Error || error instanceof AuthError ? error : new Error('Unknown error'),
    };
  }
};

export const resetListStore = (): void => {
  resetListItemsStore();
  lists$?.set({} as Record<string, any>);
  storage.remove('lists');
  storage.remove('lists__metadata');
};
