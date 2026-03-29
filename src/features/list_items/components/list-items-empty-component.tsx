import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export const ListItemsEmptyComponent = () => {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <Text variant="muted" className="text-center">
        Nenhum item nesta lista.{'\n'}Toque em + para adicionar.
      </Text>
    </View>
  );
};
