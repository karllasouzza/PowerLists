import React, { useState } from 'react';
import { useValue } from '@legendapp/state/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Text } from '@/components/ui/text';
import { lists$ } from '@/data/states/lists';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { List } from '@/data/types';
import { handleDeleteList } from '@/features/lists/utils/list-operations';

type ListDeleteModalProps = {
  open: boolean;
  listId?: string;
  onOpenChange: (open: boolean) => void;
};

export function ListDeleteModal({ open, listId, onOpenChange }: ListDeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listsRaw = useValue(lists$);
  const lists = convertFromSupabaseFormat(Object.values(listsRaw || {})) as List[];
  const currentList = lists.find((list) => list.id === listId);

  const handleDelete = async () => {
    if (!listId) return;

    setIsSubmitting(true);
    try {
      const { success } = await handleDeleteList(listId);
      if (success) onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar lista</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar{' '}
            <Text className="font-bold text-foreground">{currentList?.title ?? 'esta lista'}</Text>?
            Esta acao nao pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            <Text>Cancelar</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive"
            disabled={isSubmitting || !listId}
            onPress={handleDelete}>
            <Text>Deletar</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
