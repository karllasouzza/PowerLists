import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

import {
  AppModal,
  AppModalContent,
  AppModalHandle,
  AppModalHeader,
  AppModalFooter,
} from '@/components/molecules/app-modal';
import { handleDeleteList } from '@/features/lists/utils/list-operations';
import { database } from '@/database';
import { List as ListModel } from '@/database/models/List';

type ListDeleteModalProps = {
  open: boolean;
  listId?: string;
  onOpenChange: (open: boolean) => void;
};

export function ListDeleteModal({ open, listId, onOpenChange }: ListDeleteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentList, setCurrentList] = useState<ListModel | null>(null);

  useEffect(() => {
    if (listId) {
      database
        .get<ListModel>('lists')
        .find(listId)
        .then(setCurrentList)
        .catch(() => setCurrentList(null));
    } else {
      setCurrentList(null);
    }
  }, [listId]);

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
    <AppModal open={open} onOpenChange={onOpenChange}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Deletar lista" />

        <View className="px-6 pb-2">
          <Text className="text-muted-foreground text-center text-sm">
            Tem certeza que deseja deletar{' '}
            <Text className="text-foreground font-bold">{currentList?.title ?? 'esta lista'}</Text>?
            Esta ação não pode ser desfeita.
          </Text>
        </View>

        <AppModalFooter
          onCancel={() => onOpenChange(false)}
          onConfirm={handleDelete}
          confirmLabel="Deletar Lista"
          confirmVariant="destructive"
          isLoading={isSubmitting}
          isConfirmDisabled={!listId}
        />
      </AppModalContent>
    </AppModal>
  );
}
