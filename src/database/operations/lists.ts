import { Q } from '@nozbe/watermelondb';

import { database } from '../index';
import { List } from '../models/List';

export function getListsByProfile(profileId: string) {
  return database
    .get<List>('lists')
    .query(Q.where('profile_id', profileId), Q.where('deleted_at', Q.eq(null)));
}

export function getListById(id: string) {
  return database.get<List>('lists').find(id);
}

export async function createList({
  title,
  accentColor,
  icon,
  profileId,
}: {
  title: string;
  accentColor: string;
  icon: string;
  profileId: string;
}) {
  return database.write(async () => {
    const list = await database.get<List>('lists').create((record) => {
      record.title = title;
      record.accentColor = accentColor;
      record.icon = icon;
      record.profileId = profileId;
      record.updatedAt = new Date();
    });
    return list;
  });
}

export async function updateList(
  id: string,
  fields: Partial<Pick<List, 'title' | 'accentColor' | 'icon'>>,
) {
  return database.write(async () => {
    const list = await database.get<List>('lists').find(id);
    await list.update((record) => {
      if (fields.title !== undefined) record.title = fields.title;
      if (fields.accentColor !== undefined) record.accentColor = fields.accentColor;
      if (fields.icon !== undefined) record.icon = fields.icon;
      record.updatedAt = new Date();
    });
    return list;
  });
}

export async function deleteList(id: string) {
  return database.write(async () => {
    const list = await database.get<List>('lists').find(id);
    await list.update((record) => {
      record.deletedAt = Date.now();
      record.updatedAt = new Date();
    });
    return list;
  });
}
