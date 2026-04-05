import React, { useCallback } from 'react';
import { View } from 'react-native';
import { IconPencil, IconTrash } from '@tabler/icons-react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

interface ListItemRightActionsProps {
  itemId: string;
  onEdit: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  closeSwipeable: () => void;
}

function ListItemRightActionsComponent({
  itemId,
  onEdit,
  onDelete,
  closeSwipeable,
}: ListItemRightActionsProps) {
  const handleEdit = useCallback(() => {
    closeSwipeable();
    onEdit(itemId);
  }, [closeSwipeable, itemId, onEdit]);

  const handleDelete = useCallback(() => {
    closeSwipeable();
    onDelete(itemId);
  }, [closeSwipeable, itemId, onDelete]);

  return (
    <View className="flex flex-row w-[168px] items-center justify-between h-full p-1 bg-background gap-1 overflow-hidden box-border">
      <Button
        onPress={handleEdit}
        variant="secondary"
        className="justify-center h-full flex-col items-center w-[78px]">
        <Icon as={IconPencil} size={20} className="text-secondary-foreground" />
        <Text className="mt-1 font-semibold text-secondary-foreground text-xs">Editar</Text>
      </Button>

      <Button
        onPress={handleDelete}
        variant="destructive"
        className="justify-center h-full flex-col items-center w-[78px]">
        <Icon as={IconTrash} size={20} className="text-destructive-foreground" />
        <Text className="mt-1 font-semibold text-destructive-foreground text-xs">Deletar</Text>
      </Button>
    </View>
  );
}

export const ListItemRightActions = React.memo(ListItemRightActionsComponent);
