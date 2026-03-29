import React, { useMemo } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';

import { Text } from '@/components/ui/text';
import { closeOpenedSwipeable } from '@/components/swipeable';

import type { ListItem } from '../types';
import { ListItemsEmptyComponent } from './list-items-empty-component';

type ListItemsRow =
  | {
      readonly type: 'item';
      readonly key: string;
      readonly item: ListItem;
    }
  | {
      readonly type: 'divider';
      readonly key: 'checked-divider';
      readonly checkedCount: number;
    };

type ListItemsContentProps = {
  readonly unchecked: ListItem[];
  readonly checked: ListItem[];
  readonly renderItem: (item: ListItem) => React.ReactElement;
};

export function ListItemsContent({ unchecked, checked, renderItem }: ListItemsContentProps) {
  const data = useMemo<ListItemsRow[]>(() => {
    const uncheckedRows: ListItemsRow[] = unchecked.map((item) => ({
      type: 'item',
      key: item.id,
      item,
    }));

    const checkedRows: ListItemsRow[] = checked.map((item) => ({
      type: 'item',
      key: item.id,
      item,
    }));

    if (!unchecked.length || !checked.length) {
      return [...uncheckedRows, ...checkedRows];
    }

    return [
      ...uncheckedRows,
      {
        type: 'divider',
        key: 'checked-divider',
        checkedCount: checked.length,
      },
      ...checkedRows,
    ];
  }, [unchecked, checked]);

  const handleListScrollStart = () => {
    closeOpenedSwipeable();
  };

  return (
    <LegendList
      data={data}
      estimatedItemSize={200}
      drawDistance={500}
      renderItem={({ item }) => {
        if (item.type === 'divider') {
          return (
            <View className="mx-4 mb-2 flex-row items-center gap-2">
              <View className="h-px flex-1 bg-border" />
              <Text variant="muted" className="text-xs">
                Comprados ({item.checkedCount})
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>
          );
        }

        return renderItem(item.item);
      }}
      className="flex-1 flex w-full h-full py-2"
      keyExtractor={(item) => item.key}
      recycleItems
      onScrollBeginDrag={handleListScrollStart}
      ListEmptyComponent={ListItemsEmptyComponent}
    />
  );
}
