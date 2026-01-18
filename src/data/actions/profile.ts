import { observable, Observable } from '@legendapp/state';
import { generateId } from '../utils';
import humps from 'humps';
import type { ProfileType, CreateProfileType, UpdateProfileType } from '../types/profile';
import { customSynced, getCurrentUserId } from '../database';

// Lazy-initialized observable for profiles with Supabase sync
let profiles$: Observable<Record<string, any>> | null = null;

export const getProfiles$ = (): Observable<Record<string, any>> => {
  if (!profiles$) {
    profiles$ = observable(
      customSynced({
        collection: 'profiles',
        select: (from: any) => from.select('*'),
        filter: (select: any) => select.eq('user_id', getCurrentUserId()),
        actions: ['read', 'create', 'update', 'delete'],
        persist: { name: 'profiles', retrySync: true },
        changesSince: 'last-sync',
        fieldDeleted: 'deleted_at',
        fieldCreatedAt: 'created_at',
        fieldUpdatedAt: 'updated_at',
      })
    );
  }
  return profiles$;
};

/**
 * Get the profile for the current user
 */
export const getProfile = async (): Promise<{ profile: ProfileType | null }> => {
  try {
    const profilesData = getProfiles$().get();
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
    getProfiles$()[id].set(payload as any);

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
    getProfiles$()[profileId].name.set(name);

    if (avatarUrl !== undefined) {
      getProfiles$()[profileId].avatar_url.set(avatarUrl || null);
    }

    if (bio !== undefined) {
      getProfiles$()[profileId].bio.set(bio || null);
    }

    // Set updated_at timestamp
    getProfiles$()[profileId].updated_at.set(new Date().toISOString());

    const updatedProfileRaw = getProfiles$()[profileId].get();
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
    getProfiles$()[currentProfile.id].delete();

    return true;
  } catch (error) {
    console.error('Error deleting profile:', error);
    return false;
  }
};
