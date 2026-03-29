import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

interface ListItemsEmptyComponentProps {
  accentBgClassName: string;
  accentForegroundClassName: string;
}

export const ListItemsEmptyComponent = ({
  accentBgClassName,
  accentForegroundClassName,
}: ListItemsEmptyComponentProps) => {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <View className={cn('mb-3 rounded-full px-3 py-1', accentBgClassName)}>
        <Text className={cn('text-sm font-semibold', accentForegroundClassName)}>+ Novo item</Text>
      </View>
      <Text variant="muted" className="text-center">
        Nenhum item nesta lista.{'\n'}Toque em + para adicionar.
      </Text>
    </View>
  );
};
