/**
 * Componente de cabeçalho para a tela de items
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { IconArrowLeft } from '@tabler/icons-react-native';

interface ListItemsHeaderProps {
  readonly title: string;
  readonly backgroundColor: string;
  readonly textColor: string;
  readonly topInset: number;
  readonly onBack: () => void;
}

/**
 * Cabeçalho da tela de items com botão de voltar e título da lista
 */
export const ListItemsHeader = ({
  title,
  backgroundColor,
  textColor,
  topInset,
  onBack,
}: ListItemsHeaderProps) => {
  return (
    <View
      style={{
        paddingTop: topInset,
        backgroundColor,
      }}
      className="flex-row items-center px-5 pb-4">
      <Pressable onPress={onBack} className="mr-3 p-2">
        <Icon as={IconArrowLeft} size={24} style={{ color: textColor }} />
      </Pressable>
      <Text variant="h3" style={{ color: textColor }}>
        {title}
      </Text>
    </View>
  );
};
