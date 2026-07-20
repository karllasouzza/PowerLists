/**
 * Componente de rodapé para a tela de items
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export interface ListItemsFooterProps {
  readonly total: string;
  readonly accentBgClassName: string;
  readonly accentForegroundClassName: string;
}

export const ListItemsFooter = ({
  total,
  accentBgClassName,
  accentForegroundClassName,
}: ListItemsFooterProps) => {
  return (
    <View className="w-full flex-row items-center justify-between px-5 py-3 bg-bottom-bar border-t border-border">
      <View className="flex items-center justify-center gap-2 flex-row">
        <Text variant="p" className="text-muted-foreground m-0">
          A pagar:
        </Text>
        <View className={cn('rounded-full px-3 py-1', accentBgClassName)}>
          <Text variant="large" className={cn('font-bold', accentForegroundClassName)}>
            {total}
          </Text>
        </View>
      </View>
    </View>
  );
};
