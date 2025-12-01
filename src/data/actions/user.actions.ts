'use server';

import { observable } from '@legendapp/state';
import humps from 'humps';

import type { ListType, CreateNewListProps, UpdateListProps } from '../types';
import { generateId } from '../utils';
import { getCachedUserId, customSynced } from '../database';

/**
 * Observable para listas com sincronização Supabase
 * Usa o cachedUserId do database.ts que é sincronizado com o auth store
 */
export const lists$ = observable(
  customSynced({
    collection: 'lists',
    select: (from: any) => from.select('*'),
    filter: (select: any) => select.eq('profile_id', getCachedUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'lists', retrySync: true },
    changesSince: 'last-sync',
  })
);

// Initialize sync by getting the observable
lists$.get();

/**
 * Get all lists for the current user
 */
export const getAllLists = async (): Promise<{ results: ListType[] | null }> => {
  try {
    const listsData = lists$.get();
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
    const userId = getCachedUserId();
    if (!userId) throw new Error('User not authenticated');
    if (!title || !accentColor || !icon) throw new Error('Missing required fields');

    const id = generateId();

    // Convert to snake_case for Supabase
    const payload = humps.decamelizeKeys({
      id,
      profileId: userId,
      title,
      accentColor,
      icon,
      createdAt: new Date().toISOString(),
    });
    if (!payload) throw new Error('Failed to create list');

    // Add to observable - this will trigger sync to Supabase
    lists$[id].set(payload as any);

    // Return camelCase version
    const newList: ListType = {
      id,
      profileId: userId,
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
    lists$[id].title.set(title);
    lists$[id].accent_color.set(accentColor);
    lists$[id].icon.set(icon);

    const updatedListRaw = lists$[id].get();
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
    lists$[id].delete();

    return true;
  } catch (error) {
    console.error('Error deleting list:', error);
    return false;
  }
};
