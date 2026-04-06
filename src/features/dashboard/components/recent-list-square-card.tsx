import { memo } from 'react';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getAccentColorCardClasses } from '@/features/lists/utils/accent-colors';
import { iconMap } from '@/features/lists/utils/icon-map';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { IconShoppingCart } from '@tabler/icons-react-native';
import { Pressable, View } from 'react-native';

import type { DashboardRecentListCard } from '../types';

type RecentListSquareCardProps = {
  card: DashboardRecentListCard;
  onPress: (listId: string) => void;
};

function RecentListSquareCardComponent({ card, onPress }: RecentListSquareCardProps) {
  const ListIcon = iconMap[card.icon] ?? IconShoppingCart;
  const { backgroundClassName, foregroundClassName } = getAccentColorCardClasses(card.accentColor);

  return (
    <Pressable onPress={() => onPress(card.listId)} className="w-36 active:opacity-80">
      <View className="aspect-square rounded-2xl border border-border bg-card p-3">
        <View className="flex-row items-start justify-between">
          <View className={cn('rounded-xl p-2.5', backgroundClassName)}>
            <Icon as={ListIcon} size={20} className={foregroundClassName} />
          </View>
          <Text variant="muted" className="mt-0 text-[10px]">
            {card.totalItems} itens
          </Text>
        </View>

        <View className="mt-auto">
          <Text numberOfLines={1} className="text-sm font-semibold text-foreground">
            {card.title}
          </Text>
          <Text className="mt-1 text-base font-bold text-foreground">
            {formatCurrency(card.totalPrice)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export const RecentListSquareCard = memo(RecentListSquareCardComponent);
