import { observable } from '@legendapp/state';
import { supabase } from '@/lib/supabase';
import { convertFromSupabaseFormat, convertToSupabaseFormat } from '@/lib/supabase/utils';

import { getCurrentUserId, customSynced } from '../database';
import { storage } from '../storage';
import type { ProfileType, CreateProfileType, UpdateProfileType } from '../types/profile';
import { generateId } from '../utils';

export const profiles$ = observable(
  customSynced({
    initial: {} as Record<string, any>,
    supabase,
    collection: 'profiles',
    select: (from: any) => from.select('*'),
    filter: (select: any) => select.eq('id', getCurrentUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'profiles', retrySync: true },
    retry: {
      infinite: true,
    },
  }),
);

/**
 * Retrieves the current user's profile from the data source.
 *
 * @returns A promise that resolves to an object containing the user's profile (`profile`) if found,
 * or `null` if no profile exists.
 *
 * @remarks
 * - Assumes there is a unique constraint on `user_id`, so only one profile per user is expected.
 * - The returned profile object is camel-cased.
 * - In case of an error, logs the error and returns `{ profile: null }`.
 */
export const getProfile = async (): Promise<{ profile: ProfileType | null }> => {
  try {
    const profilesData = profiles$.get();
    const profilesArray = Object.values(profilesData || {});
    if (profilesArray.length === 0) {
      return { profile: null };
    }

    // Since user_id has a unique constraint, there should only be one profile per user
    const profile = convertFromSupabaseFormat(profilesArray[0]) as ProfileType;
    return { profile };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { profile: null };
  }
};

/**
 * Creates a new user profile and adds it to the observable store, triggering a sync to Supabase.
 *
 * @param {CreateProfileType} params - The profile data to create.
 * @param {string} params.name - The name of the profile (required).
 * @param {string} [params.avatarUrl] - The URL of the profile's avatar (optional).
 * @param {string} [params.bio] - The biography of the profile (optional).
 * @returns {Promise<{ profile: ProfileType | null }>} An object containing the newly created profile in camelCase format, or `null` if creation failed.
 *
 * @throws {Error} If the user is not authenticated or the name is missing.
 */
export const createProfile = async ({
  name,
  avatarUrl,
  bio,
}: CreateProfileType): Promise<{ profile: ProfileType | null }> => {
  try {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('User not authenticated');
    if (!name) throw new Error('Name is required');

    const id = generateId();

    // Convert to snake_case for Supabase
    const payload = convertToSupabaseFormat({
      id,
      userId: getCurrentUserId(),
      name,
      avatarUrl: avatarUrl || null,
      bio: bio || null,
      createdAt: new Date().toISOString(),
    });

    if (!payload) throw new Error('Failed to create profile');

    // Add to observable - this will trigger sync to Supabase
    profiles$[id].set(payload as any);

    // Return camelCase version
    const newProfile: ProfileType = {
      id,
      userId: currentUserId,
      name,
      avatarUrl: avatarUrl || '',
      bio: bio || '',
      createdAt: new Date().toISOString(),
    };

    return { profile: newProfile };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { profile: null };
  }
};

/**
 * Updates the current user's profile with the provided information.
 *
 * @param params - An object containing the profile fields to update.
 * @param params.name - The new name for the profile. (Required)
 * @param params.avatarUrl - The new avatar URL for the profile. (Optional)
 * @param params.bio - The new bio for the profile. (Optional)
 * @returns A promise that resolves to an object containing the updated profile, or `null` if the update fails.
 *
 * @throws Will throw an error if the `name` is not provided or if the profile cannot be found.
 *
 * @example
 * ```typescript
 * const { profile } = await updateProfile({ name: "Alice", avatarUrl: "https://...", bio: "Hello!" });
 * ```
 */
export const updateProfile = async ({
  name,
  avatarUrl,
  bio,
}: UpdateProfileType): Promise<{ profile: ProfileType | null }> => {
  try {
    if (!name) throw new Error('Name is required');

    // Get the current profile to find its ID
    const { profile: currentProfile } = await getProfile();
    if (!currentProfile?.id) {
      throw new Error('Profile not found');
    }

    const profileId = currentProfile.id;

    // Update in observable using snake_case - this will trigger sync to Supabase
    profiles$[profileId].name.set(name);

    if (avatarUrl !== undefined) {
      profiles$[profileId].avatar_url.set(avatarUrl || null);
    }

    if (bio !== undefined) {
      profiles$[profileId].bio.set(bio || null);
    }

    // Set updated_at timestamp
    profiles$[profileId].updated_at.set(new Date().toISOString());

    const updatedProfileRaw = profiles$[profileId].get();
    const updatedProfile = convertFromSupabaseFormat(updatedProfileRaw) as ProfileType;

    return { profile: updatedProfile };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { profile: null };
  }
};

/**
 * Deletes the current user profile.
 *
 * This function retrieves the current profile, validates its existence,
 * and deletes it from the observable store, which will trigger synchronization
 * with Supabase. Returns `true` if the deletion was successful, or `false` if
 * an error occurred.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the profile was deleted successfully, or `false` otherwise.
 */
export const deleteProfile = async (): Promise<boolean> => {
  try {
    const { profile: currentProfile } = await getProfile();
    if (!currentProfile?.id) {
      throw new Error('Profile not found');
    }

    // Delete from observable - this will trigger sync to Supabase
    profiles$[currentProfile.id].delete();

    return true;
  } catch (error) {
    console.error('Error deleting profile:', error);
    return false;
  }
};

export const resetProfilesStore = (): void => {
  profiles$?.set({} as Record<string, any>);
  // Clear persisted data from MMKV
  storage.delete('profiles');
  storage.delete('profiles__metadata');
};
