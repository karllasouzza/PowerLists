import { Q } from '@nozbe/watermelondb';

import { database } from '../index';
import { Profile } from '../models/Profile';

export async function getProfileByUserId(userId: string) {
  const profiles = await database
    .get<Profile>('profiles')
    .query(Q.where('user_id', userId), Q.where('deleted_at', Q.eq(null)))
    .fetch();
  return profiles[0] ?? null;
}

export async function createProfile({
  name,
  avatarUrl,
  bio,
  userId,
}: {
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  userId: string;
}) {
  return database.write(async () => {
    const profile = await database.get<Profile>('profiles').create((record) => {
      record.name = name;
      record.avatarUrl = avatarUrl ?? null;
      record.bio = bio ?? null;
      record.userId = userId;
      record.updatedAt = new Date();
    });
    return profile;
  });
}

export async function updateProfile(
  id: string,
  fields: Partial<Pick<Profile, 'name' | 'avatarUrl' | 'bio'>>,
) {
  return database.write(async () => {
    const profile = await database.get<Profile>('profiles').find(id);
    await profile.update((record) => {
      if (fields.name !== undefined) record.name = fields.name;
      if (fields.avatarUrl !== undefined) record.avatarUrl = fields.avatarUrl ?? null;
      if (fields.bio !== undefined) record.bio = fields.bio ?? null;
      record.updatedAt = new Date();
    });
    return profile;
  });
}

export async function deleteProfile(id: string) {
  return database.write(async () => {
    const profile = await database.get<Profile>('profiles').find(id);
    await profile.update((record) => {
      record.deletedAt = Date.now();
      record.updatedAt = new Date();
    });
    return profile;
  });
}
