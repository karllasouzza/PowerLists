import {
  createNewList,
  updateList as editListAction,
  deleteList as deleteListAction,
} from '@/data/actions/lists.actions';
import { showToast } from '@/services';
import { FormData } from '../types';

export const handleAddNewList = async (data: FormData) => {
  try {
    const { newList } = await createNewList({
      title: data.title,
      accentColor: data.color || 'primary',
      icon: data.icon || 'cart',
    });

    if (!newList) throw new Error('Failed to create list');

    showToast({
      type: 'success',
      title: 'Lista criada',
      subtitle: 'Sua lista foi criada com sucesso.',
    });

    return { success: true };
  } catch {
    showToast({
      type: 'error',
      title: 'Erro ao criar lista',
      subtitle: 'Tente novamente.',
    });
    return { success: false };
  }
};

export const handleEditList = async (listEditId: string, data: FormData) => {
  try {
    const { editList } = await editListAction({
      id: listEditId,
      title: data.title,
      accentColor: data.color || 'primary',
      icon: data.icon || 'cart',
    });

    if (!editList) throw new Error('Failed to edit list');

    showToast({
      type: 'success',
      title: 'Lista atualizada',
      subtitle: 'Suas alterações foram salvas.',
    });

    return { success: true };
  } catch {
    showToast({
      type: 'error',
      title: 'Erro ao editar lista',
      subtitle: 'Tente novamente.',
    });
    return { success: false };
  }
};

export const handleDeleteList = async (id: string) => {
  try {
    const success = await deleteListAction({ id });
    if (!success) throw new Error('Failed to delete list');
    return { success: true };
  } catch {
    return { success: false };
  }
};
