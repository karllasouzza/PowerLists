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
import { deleteListItem, listItems$ } from '@/data/states/list-items';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import type { ListItem } from '@/features/list_items/types';

type ItemDeleteModalProps = {
  open: boolean;
  itemId?: string;
  onOpenChange: (open: boolean) => void;
};

export function ItemDeleteModal({ open, itemId, onOpenChange }: ItemDeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listItemsRaw = useValue(listItems$);
  const allItems = convertFromSupabaseFormat(Object.values(listItemsRaw || {})) as ListItem[];
  const currentItem = allItems.find((item) => item.id === itemId);

  const handleDelete = async () => {
    if (!itemId) return;

    setIsSubmitting(true);
    try {
      const success = await deleteListItem({ itemId });
      if (success) onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar item</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar{' '}
            <Text className="font-bold text-foreground">{currentItem?.title ?? 'este item'}</Text>?
            Esta acao nao pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            <Text>Cancelar</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive"
            disabled={isSubmitting || !itemId}
            onPress={handleDelete}>
            <Text>Deletar</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
