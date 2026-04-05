import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/utils/formatters';
import { Pressable, View } from 'react-native';

import type { DashboardItemVariation } from '../types';

type ItemVariationRowProps = {
  item: DashboardItemVariation;
  onPress: (item: DashboardItemVariation) => void;
};

function ItemVariationRowComponent({ item, onPress }: ItemVariationRowProps) {
  const recentChangePercent =
    item.previousUnitPrice !== null && item.previousUnitPrice > 0
      ? ((item.lastUnitPrice - item.previousUnitPrice) / item.previousUnitPrice) * 100
      : item.changePercent;
  const isIncrease = recentChangePercent > 0;
  const deltaPrefix = isIncrease ? '+' : '';
  const previousValueLabel =
    item.previousUnitPrice !== null ? formatCurrency(item.previousUnitPrice) : '--';

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="rounded-xl border border-border bg-card px-3 py-3 active:opacity-80">
      <View className="flex-row items-center justify-between gap-2">
        <Text numberOfLines={1} className="flex-1 text-sm font-semibold text-foreground">
          {item.title}
        </Text>
        <Badge variant={isIncrease ? 'destructive' : 'secondary'}>
          <Text className="text-xs font-bold">{`${deltaPrefix}${recentChangePercent.toFixed(1)}%`}</Text>
        </Badge>
      </View>

      <View className="mt-2 flex-row items-center justify-between gap-2">
        <Text variant="muted" className="mt-0 flex-1 text-xs">
          Penúltimo: {previousValueLabel}
        </Text>
        <Text
          className={`mt-0 text-xs font-semibold ${isIncrease ? 'text-destructive' : 'text-primary'}`}>
          Último: {formatCurrency(item.lastUnitPrice)}
        </Text>
      </View>
    </Pressable>
  );
}

export const ItemVariationRow = memo(ItemVariationRowComponent);
