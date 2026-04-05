import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';

import { closeOpenedSwipeable } from '@/components/swipeable';

import type { ListItem } from '../types';
import { ListItemsEmptyComponent } from './list-items-empty-component';

type ListItemsContentProps = {
  readonly items: ListItem[];
  readonly accentBgClassName: string;
  readonly accentForegroundClassName: string;
  readonly renderItem: (item: ListItem) => React.ReactElement;
};

const LIST_ITEM_ESTIMATED_SIZE = 96;
const LIST_ITEM_DRAW_DISTANCE = 800;

export function ListItemsContent({
  items,
  accentBgClassName,
  accentForegroundClassName,
  renderItem,
}: ListItemsContentProps) {
  const data = useMemo(() => items, [items]);

  const listExtraData = `${accentBgClassName}:${accentForegroundClassName}`;

  const handleListScrollStart = useCallback(() => {
    closeOpenedSwipeable();
  }, []);

  return (
    <LegendList
      data={data}
      estimatedItemSize={LIST_ITEM_ESTIMATED_SIZE}
      drawDistance={LIST_ITEM_DRAW_DISTANCE}
      renderItem={({ item }) => renderItem(item)}
      className="flex-1 flex w-full h-full py-2"
      keyExtractor={(item) => item.id}
      extraData={listExtraData}
      recycleItems
      onScrollBeginDrag={handleListScrollStart}
      ListFooterComponent={<View className="h-44" />}
      ListEmptyComponent={() => (
        <ListItemsEmptyComponent
          accentBgClassName={accentBgClassName}
          accentForegroundClassName={accentForegroundClassName}
        />
      )}
    />
  );
}

export default ListItemsContent;
