import { Collection } from '@nozbe/watermelondb';
import { database } from '../database';
import Profile from '../model/profiles.model';
import type { ProfileType, UpdateProfileType } from '../../types';

const profiles = database.collections.get('profiles') as Collection<Profile>;

export const observeProfiles = () => profiles.query().observe();

export const saveProfile = async ({ userId, name, email, avatarUrl, bio }: ProfileType) => {
  await database.action(async () => {
    await profiles.create((entry) => {
      entry.userId = userId;
      entry.name = name;
      entry.email = email;
      entry.avatarUrl = avatarUrl;
      if (bio) entry.bio = bio;
    });
  });
};

export const updateProfile = async (
  profile: Profile,
  { name, email, avatarUrl, bio }: UpdateProfileType
) => {
  await database.action(async () => {
    await profile.update((entry) => {
      entry.name = name;
      entry.email = email;
      entry.avatarUrl = avatarUrl;
      if (bio !== undefined) entry.bio = bio;
      entry.updatedAt = new Date();
    });
  });
};

export const permanentlyDeleteProfile = async (profile: Profile) => {
  await database.action(async () => {
    await profile.destroyPermanently();
  });
};
