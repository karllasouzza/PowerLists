'use server';

import { configureSyncedSupabase, syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { observable } from '@legendapp/state';
import { supabase } from '@/lib/supabase';
import { generateId } from '../utils';
import humps from 'humps';
import type { ProfileType, CreateProfileType, UpdateProfileType } from '../types/profile.type';
import { configureSynced } from '@legendapp/state/sync';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { getCurrentUserId } from '../database';

// Configure LegendApp Supabase sync
configureSyncedSupabase({
  generateId,
});

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: ObservablePersistMMKV,
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
});

// Create observable for profiles with Supabase sync
export const profiles$ = observable(
  customSynced({
    collection: 'profiles',
    select: (from: any) => from.select('*'),
    filter: (select: any) => select.eq('user_id', getCurrentUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'profiles', retrySync: true },
    changesSince: 'last-sync',
  })
);

// Initialize sync by getting the observable
profiles$.get();

/**
 * Get the profile for the current user
 */
export const getProfile = async (): Promise<{ profile: ProfileType | null }> => {
  try {
    const profilesData = profiles$.get();
    const profilesArray = Object.values(profilesData || {});

    if (profilesArray.length === 0) {
      return { profile: null };
    }

    // Since user_id has a unique constraint, there should only be one profile per user
    const profile = humps.camelizeKeys(profilesArray[0]) as ProfileType;
    return { profile };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { profile: null };
  }
};

/**
 * Create a new profile for the current user
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
    const payload = humps.decamelizeKeys({
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
 * Update the profile for the current user
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
    const updatedProfile = humps.camelizeKeys(updatedProfileRaw) as ProfileType;

    return { profile: updatedProfile };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { profile: null };
  }
};

/**
 * Delete the profile for the current user
 */
export const deleteProfile = async (): Promise<boolean> => {
  try {
    // Get the current profile to find its ID
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
