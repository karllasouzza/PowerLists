import { Collection, Q } from '@nozbe/watermelondb';
import { database } from '../database';
import ListItem from '../model/list_items.model';
import type {
  CreateNewListItemResult,
  ListItemType,
  UpdateListItemProps,
  UpdateListItemResult,
} from '../../types';

const listItems = database.collections.get('list_items') as Collection<ListItem>;

export const observeListItems = () => listItems.query().observe();

export const observeListItemsByList = (listId: string) =>
  listItems.query(Q.where('list_id', listId)).observe();

export const createListItem = async ({
  profileId,
  listId,
  title,
  price,
  amount,
  isChecked,
}: ListItemType): Promise<CreateNewListItemResult> => {
  return await database.action(async () => {
    try {
      if (!profileId || !listId || !title || !amount || isChecked === undefined)
        throw new Error('Missing required fields');

      const newListItem = await listItems.create((entry) => {
        entry.profileId = profileId;
        entry.listId = listId;
        entry.title = title;
        if (price !== undefined) entry.price = price;
        entry.amount = amount;
        entry.isChecked = isChecked;
      });
      if (!newListItem) throw new Error('List item not found');

      return { newListItem };
    } catch (error) {
      console.log(error);
      return { newListItem: null };
    }
  });
};

export const updateListItem = async ({
  id,
  title,
  price,
  amount,
  isChecked,
}: UpdateListItemProps): Promise<UpdateListItemResult> => {
  return await database.action(async () => {
    try {
      if (!id || (!title && !price && !amount && isChecked === undefined))
        throw new Error('Missing required fields');

      const listItem = await listItems.find(id);
      if (!listItem) throw new Error('List item not found');

      const listItemUpdated = await listItem.update((entry) => {
        entry.title = title;
        if (price !== undefined) entry.price = price;
        entry.amount = amount;
        entry.isChecked = isChecked;
        entry.updatedAt = new Date();
      });
      if (!listItemUpdated) throw new Error('List item not found');

      return { editItem: listItemUpdated };
    } catch (error) {
      console.log(error);
      return { editItem: null };
    }
  });
};

export const toggleListItemChecked = async ({ id }: UpdateListItemProps): Promise<boolean> => {
  return await database.action(async () => {
    try {
      if (!id) throw new Error('Missing required fields');

      const listItem = await listItems.find(id);
      if (!listItem) throw new Error('List item not found');

      const listItemUpdated = await listItem.update((entry) => {
        entry.isChecked = !entry.isChecked;
        entry.updatedAt = new Date();
      });
      if (!listItemUpdated) throw new Error('List item not found');

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
};

export const deleteListItem = async ({ id }: UpdateListItemProps): Promise<boolean> => {
  return await database.action(async () => {
    try {
      if (!id) throw new Error('Missing required fields');

      const listItem = await listItems.find(id);
      if (!listItem) throw new Error('List item not found');

      const listItemDeleted = await listItem.update((entry) => {
        entry.deletedAt = new Date();
      });
      if (!listItemDeleted) throw new Error('List item not found');

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
};

export const permanentlyDeleteListItem = async (listItem: ListItem): Promise<boolean> => {
  return await database.action(async () => {
    try {
      if (!listItem) throw new Error('List item not found');

      await listItem.destroyPermanently();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
};
