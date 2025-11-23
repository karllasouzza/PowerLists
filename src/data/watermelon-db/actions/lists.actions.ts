import { Collection } from '@nozbe/watermelondb';
import { database } from '../database';
import List from '../model/lists.model';
import type {
  CreateNewListProps,
  CreateNewListResult,
  DeleteListProps,
  UpdateListProps,
  UpdateListResult,
} from '../../types';

const lists = database.collections.get('lists') as Collection<List>;

export const observeLists = () => lists.query().observe();

export const createNewList = async ({
  profileId,
  title,
  accentColor,
  icon,
}: CreateNewListProps): Promise<CreateNewListResult> => {
  return await database.action(async () => {
    try {
      if (!profileId || !title || !accentColor || !icon) throw new Error('Missing required fields');

      const newList = await lists.create((entry) => {
        entry.title = title;
        entry.accentColor = accentColor;
        entry.profileId = profileId;
        entry.icon = icon;
      });
      if (!newList) throw new Error('New list not created');

      return { newList };
    } catch (error) {
      console.log(error);
      return { newList: null };
    }
  });
};

export const updateList = async ({
  id,
  title,
  accentColor,
  icon,
}: UpdateListProps): Promise<UpdateListResult> => {
  return await database.action(async () => {
    try {
      if (!id && (!title || !accentColor || !icon)) throw new Error('Missing required fields');

      const list = await lists.find(id);
      if (!list) throw new Error('List not found');

      const updatedList = await list.update((entry) => {
        entry.title = title;
        entry.accentColor = accentColor;
        entry.icon = icon;
        entry.updatedAt = new Date();
      });
      if (!updatedList) throw new Error('List not updated');

      return { editList: updatedList };
    } catch (error) {
      console.log(error);
      return { editList: null };
    }
  });
};

export const deleteList = async ({ id }: DeleteListProps): Promise<boolean> => {
  return await database.action(async () => {
    try {
      if (!id) throw new Error('Missing required fields');

      const list = await lists.find(id);
      if (!list) throw new Error('List not found');

      const deleteList = await list.update((entry) => {
        entry.deletedAt = new Date();
      });
      if (!deleteList) throw new Error('List not deleted');

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
};

export const permanentlyDeleteList = async ({ id }: DeleteListProps): Promise<boolean> => {
  return await database.action(async () => {
    try {
      if (!id) throw new Error('Missing required fields');

      const list = await lists.find(id);
      if (!list) throw new Error('List not found');

      await list.destroyPermanently();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  });
};
