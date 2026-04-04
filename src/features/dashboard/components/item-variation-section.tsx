import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import type { DashboardItemVariation } from '../types';
import { ItemVariationRow } from './item-variation-row';

type ItemVariationSectionProps = {
  increases: DashboardItemVariation[];
  decreases: DashboardItemVariation[];
  onViewAll: () => void;
  onPressItem: (item: DashboardItemVariation) => void;
};

const MAX_ROWS_PER_COLUMN = 4;

export function ItemVariationSection({
  increases,
  decreases,
  onViewAll,
  onPressItem,
}: ItemVariationSectionProps) {
  const topIncreases = increases.slice(0, MAX_ROWS_PER_COLUMN);
  const topDecreases = decreases.slice(0, MAX_ROWS_PER_COLUMN);

  return (
    <View className="gap-3 px-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-foreground">Comparativo por item</Text>
        <Button variant="ghost" size="sm" onPress={onViewAll}>
          <Text className="font-semibold text-primary">Ver tudo</Text>
        </Button>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2">
          <Text className="text-sm font-semibold text-primary">Maiores quedas</Text>
          {topDecreases.length ? (
            topDecreases.map((item) => (
              <ItemVariationRow key={item.key} item={item} onPress={onPressItem} />
            ))
          ) : (
            <View className="rounded-xl border border-dashed border-border bg-card px-3 py-4">
              <Text variant="muted" className="mt-0 text-xs">
                Sem quedas no período.
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1 gap-2">
          <Text className="text-sm font-semibold text-destructive">Maiores altas</Text>
          {topIncreases.length ? (
            topIncreases.map((item) => (
              <ItemVariationRow key={item.key} item={item} onPress={onPressItem} />
            ))
          ) : (
            <View className="rounded-xl border border-dashed border-border bg-card px-3 py-4">
              <Text variant="muted" className="mt-0 text-xs">
                Sem altas no período.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
