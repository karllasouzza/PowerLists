import { useValue } from '@legendapp/state/react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import {
  AppModal,
  AppModalContent,
  AppModalFooter,
  AppModalHandle,
  AppModalHeader,
} from '@/components/molecules/app-modal';
import { deleteListItem } from '@/data/actions/list-items';
import { listItems$ } from '@/data/states/list-items';
import { ListItem } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

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
