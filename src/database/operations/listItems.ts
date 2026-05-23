import { Q } from '@nozbe/watermelondb';

import { database } from '../index';
import { ListItem } from '../models/ListItem';

export function getListItemsByListId(listId: string) {
  return database
    .get<ListItem>('list_items')
    .query(Q.where('list_id', listId), Q.where('deleted_at', Q.eq(null)));
}

export async function createListItem({
  title,
  price,
  amount,
  listId,
  profileId,
  isChecked,
}: {
  title: string;
  price: number | null;
  amount: number;
  listId: string;
  profileId: string;
  isChecked: boolean;
}) {
  return database.write(async () => {
    const item = await database.get<ListItem>('list_items').create((record) => {
      record.title = title;
      record.price = price;
      record.amount = amount;
      record.listId = listId;
      record.profileId = profileId;
      record.isChecked = isChecked;
      record.updatedAt = new Date();
    });
    return item;
  });
}

export async function toggleCheckListItem(id: string, isChecked: boolean) {
  return database.write(async () => {
    const item = await database.get<ListItem>('list_items').find(id);
    await item.update((record) => {
      record.isChecked = isChecked;
      record.updatedAt = new Date();
    });
    return item;
  });
}

export async function updateListItem(
  id: string,
  fields: Partial<Pick<ListItem, 'title' | 'price' | 'amount' | 'isChecked'>>,
) {
  return database.write(async () => {
    const item = await database.get<ListItem>('list_items').find(id);
    await item.update((record) => {
      if (fields.title !== undefined) record.title = fields.title;
      if (fields.price !== undefined) record.price = fields.price;
      if (fields.amount !== undefined) record.amount = fields.amount;
      if (fields.isChecked !== undefined) record.isChecked = fields.isChecked;
      record.updatedAt = new Date();
    });
    return item;
  });
}

export async function deleteListItem(id: string) {
  return database.write(async () => {
    const item = await database.get<ListItem>('list_items').find(id);
    await item.update((record) => {
      record.deletedAt = Date.now();
      record.updatedAt = new Date();
    });
    return item;
  });
}
