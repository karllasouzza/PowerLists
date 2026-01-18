import { observable, Observable } from '@legendapp/state';
import { generateId } from '../utils';
import humps from 'humps';
import type { ListType, CreateNewListProps, UpdateListProps } from '../types';
import { getCurrentUserId, customSynced } from '../database';

// Lazy-initialized observable for lists with Supabase sync
let lists$: Observable<Record<string, any>> | null = null;

export const getLists$ = (): Observable<Record<string, any>> => {
  if (!lists$) {
    lists$ = observable(
      customSynced({
        collection: 'lists',
        select: (from: any) => from.select('*'),
        filter: (select: any) => select.eq('profile_id', getCurrentUserId()),
        actions: ['read', 'create', 'update', 'delete'],
        persist: { name: 'lists', retrySync: true },
        changesSince: 'last-sync',
        fieldDeleted: 'deleted_at',
        fieldCreatedAt: 'created_at',
        fieldUpdatedAt: 'updated_at',
      })
    );
  }
  return lists$;
};

/**
 * Get all lists for the current user
 */
export const getAllLists = async (): Promise<{ results: ListType[] | null }> => {
  try {
    const listsData = getLists$().get();
    const listsArray = Object.values(listsData || {});
    // Convert snake_case to camelCase
    const camelizedLists = humps.camelizeKeys(listsArray) as ListType[];
    return { results: camelizedLists };
  } catch (error) {
    console.error('Error getting lists:', error);
    return { results: null };
  }
};

/**
 * Create a new list
 */
export const createNewList = async ({
  title,
  accentColor,
  icon,
}: Omit<CreateNewListProps, 'profileId'>): Promise<{ newList: ListType | null }> => {
  try {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User not authenticated');
    if (!title || !accentColor || !icon) throw new Error('Missing required fields');

    const id = generateId();

    // Convert to snake_case for Supabase
    const payload = humps.decamelizeKeys({
      id,
      profileId: currentUserId,
      title,
      accentColor,
      icon,
      createdAt: new Date().toISOString(),
    });
    if (!payload) throw new Error('Failed to create list');

    // Add to observable - this will trigger sync to Supabase
    getLists$()[id].set(payload as any);

    // Return camelCase version
    const newList: ListType = {
      id,
      profileId: currentUserId,
      title,
      accentColor,
      icon,
      createdAt: new Date().toISOString(),
    };

    return { newList };
  } catch (error) {
    console.error('Error creating list:', error);
    return { newList: null };
  }
};

/**
 * Update an existing list
 */
export const updateList = async ({
  id,
  title,
  accentColor,
  icon,
}: Omit<UpdateListProps, 'profileId' | 'createdAt'>): Promise<{ editList: ListType | null }> => {
  try {
    if (!id || !title || !accentColor || !icon) throw new Error('Missing required fields');

    // Update in observable using snake_case - this will trigger sync to Supabase
    getLists$()[id].title.set(title);
    getLists$()[id].accent_color.set(accentColor);
    getLists$()[id].icon.set(icon);

    const updatedListRaw = getLists$()[id].get();
    const updatedList = humps.camelizeKeys(updatedListRaw) as ListType;

    return { editList: updatedList };
  } catch (error) {
    console.error('Error updating list:', error);
    return { editList: null };
  }
};

/**
 * Delete a list
 */
export const deleteList = async ({ id }: { id: string }): Promise<boolean> => {
  try {
    if (!id) throw new Error('Missing required fields');

    // Delete from observable - this will trigger sync to Supabase
    getLists$()[id].delete();

    return true;
  } catch (error) {
    console.error('Error deleting list:', error);
    return false;
  }
};
