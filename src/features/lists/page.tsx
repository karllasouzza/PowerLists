import React from 'react';
import { View } from 'react-native';
import { CardList } from '@/components/card-list';
import { LegendList } from '@legendapp/list';
import { TopBar } from '@/components/top-bar';

import { useHomeState } from './hooks/use-home-state';
import { filterListsByQuery } from './utils/list-filters';
import { observer } from '@legendapp/state/react';
import { List } from '@/data/types';

const HomeScreen = observer(() => {
  const { searchQuery, setSearchQuery, lists } = useHomeState();

  const filteredLists = filterListsByQuery(lists, searchQuery);

  const renderList = (list: List, index: number) => {
    return <CardList key={index} list={list} />;
  };

  return (
    <View className="flex h-full w-full flex-1 items-center bg-background p-0!">
      <TopBar
        title="Minhas Listas"
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Procurando por algo?"
      />

      <LegendList
        data={filteredLists}
        renderItem={({ item, index }) => renderList(item, index)}
        estimatedItemSize={filteredLists.length}
        className="flex h-full w-full flex-1"
        keyExtractor={(item) => item.id}
        recycleItems
        ListFooterComponent={() => <View className="h-20" />}
      />

      {/* {(mode === 'add' || mode === 'edit') && (
        <NewListItem
          type="Lists"
          mode={mode}
          open={true}
          onOpenChange={(open) => !open && returnOfMode()}
          onSuccess={() => returnOfMode()}
        />
      )} */}
    </View>
  );
});

export default HomeScreen;
