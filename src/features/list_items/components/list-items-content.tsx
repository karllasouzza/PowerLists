import React, { useMemo } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';

import { Text } from '@/components/ui/text';
import { closeOpenedListItemSwipe } from './list-item';

import type { ListItem } from '../types';

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
    closeOpenedListItemSwipe();
  };

  return (
    <LegendList
      data={data}
      renderItem={({ item }) => {
        if (item.type === 'divider') {
          return (
            <View className="mx-4 mb-2 flex-row items-center gap-2">
              <View className="h-px flex-1 bg-border" />
              <Text variant="muted" className="text-xs">
                Adicionados ({item.checkedCount})
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>
          );
        }

        return renderItem(item.item);
      }}
      estimatedItemSize={92}
      className="flex-1 flex w-full h-full py-2"
      keyExtractor={(item) => item.key}
      recycleItems
      onScrollBeginDrag={handleListScrollStart}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center py-16">
          <Text variant="muted" className="text-center">
            Nenhum item nesta lista.{'\n'}Toque em + para adicionar.
          </Text>
        </View>
      )}
      ListFooterComponent={() => <View className="h-44 border-t border-border" />}
    />
  );
}
