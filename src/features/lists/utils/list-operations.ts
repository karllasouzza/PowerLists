import { createList, updateList, deleteList } from '@/database/operations/lists';
import { showToast } from '@/services';
import { getCurrentUserId } from '@/features/auth/authState';
import { DEFAULT_ACCENT_COLOR } from '@/features/lists/utils/accent-colors';
import { FormData } from '../types';

export const handleAddNewList = async (data: FormData) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    const newList = await createList({
      title: data.title,
      accentColor: data.color || DEFAULT_ACCENT_COLOR,
      icon: data.icon || 'cart',
      profileId: userId,
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
    const editList = await updateList(listEditId, {
      title: data.title,
      accentColor: data.color || DEFAULT_ACCENT_COLOR,
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
    const result = await deleteList(id);
    if (!result) throw new Error('Failed to delete list');
    return { success: true };
  } catch {
    return { success: false };
  }
};
