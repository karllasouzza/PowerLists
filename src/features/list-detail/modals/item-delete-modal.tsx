import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import {
  AppModal,
  AppModalContent,
  AppModalFooter,
  AppModalHandle,
  AppModalHeader,
} from '@/components/molecules/app-modal';
import { deleteListItem } from '@/database/operations/listItems';
import { database } from '@/database';
import { ListItem as ListItemModel } from '@/database/models/ListItem';

type ItemDeleteModalProps = {
  open: boolean;
  itemId?: string;
  onOpenChange: (open: boolean) => void;
};

export function ItemDeleteModal({ open, itemId, onOpenChange }: ItemDeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentItem, setCurrentItem] = useState<ListItemModel | null>(null);

  useEffect(() => {
    if (itemId) {
      database
        .get<ListItemModel>('list_items')
        .find(itemId)
        .then(setCurrentItem)
        .catch(() => setCurrentItem(null));
    } else {
      setCurrentItem(null);
    }
  }, [itemId]);

  const handleDelete = async () => {
    if (!itemId) return;

    setIsSubmitting(true);
    try {
      await deleteListItem(itemId);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal open={open} onOpenChange={onOpenChange}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Deletar item" />

        <View className="px-6 pb-2">
          <Text className="text-muted-foreground text-center text-sm">
            Tem certeza que deseja deletar{' '}
            <Text className="text-foreground font-bold">{currentItem?.title ?? 'este item'}</Text>?
            Esta ação não pode ser desfeita.
          </Text>
        </View>

        <AppModalFooter
          onCancel={() => onOpenChange(false)}
          onConfirm={handleDelete}
          confirmLabel="Deletar item"
          confirmVariant="destructive"
          isLoading={isSubmitting}
          isConfirmDisabled={!itemId}
        />
      </AppModalContent>
    </AppModal>
  );
}
