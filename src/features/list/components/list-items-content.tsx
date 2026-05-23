import React, { useCallback, useMemo } from 'react';
import { View, FlatList } from 'react-native';

import { closeOpenedSwipeable } from '@/components/swipeable';

import { ListItemsEmptyComponent } from './list-items-empty-component';

type ListItemsContentProps = {
  readonly items: any[];
  readonly accentBgClassName: string;
  readonly accentForegroundClassName: string;
  readonly renderItem: (item: any) => React.ReactElement;
};

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
    <FlatList
      data={data}
      renderItem={({ item }) => renderItem(item)}
      className="flex-1 flex w-full h-full py-2"
      keyExtractor={(item) => item.id}
      extraData={listExtraData}
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
