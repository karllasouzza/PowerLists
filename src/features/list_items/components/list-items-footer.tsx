/**
 * Componente de rodapé para a tela de items
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

interface ListItemsFooterProps {
  readonly total: string;
}

export const ListItemsFooter = ({ total }: ListItemsFooterProps) => {
  return (
    <View className="w-full flex-row items-center justify-between px-5 py-3 bg-bottom-bar border-t border-border">
      <View className="flex items-center justify-center gap-2 flex-row">
        <Text variant="p" className="text-muted-foreground m-0">
          Total:
        </Text>
        <Text variant="large" className="font-bold text-bottom-bar-accent">
          {total}
        </Text>
      </View>
    </View>
  );
};
