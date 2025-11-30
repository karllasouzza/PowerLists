/**
 * Componente de rodapé para a tela de items
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { IconPlus } from '@tabler/icons-react-native';

interface ListItemsFooterProps {
  readonly total: string;
  readonly accentColor: string;
  readonly backgroundColor: string;
  readonly textColor: string;
  readonly bottomInset: number;
  readonly onAddPress: () => void;
}

/**
 * Rodapé da tela de items com botão de adicionar e total
 */
export const ListItemsFooter = ({
  total,
  accentColor,
  backgroundColor,
  textColor,
  bottomInset,
  onAddPress,
}: ListItemsFooterProps) => {
  return (
    <View
      style={{
        paddingBottom: bottomInset,
        backgroundColor,
      }}
      className="w-full flex-row items-center justify-between px-5 py-3">
      <Pressable onPress={onAddPress} className="rounded-md p-2">
        <Icon as={IconPlus} size={32} style={{ color: accentColor }} />
      </Pressable>

      <Text variant="large" style={{ color: textColor }}>
        Total: {total}
      </Text>
    </View>
  );
};
