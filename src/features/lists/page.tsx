import React from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { observer } from '@legendapp/state/react';

import type { List } from '@/data/types';
import { CardList } from '@/features/lists/components/card-list';
import { TopBar } from '@/components/top-bar';

import { useListPageLogics } from './hooks/use-list-page-logics';

const HomeScreen = observer(() => {
  const { searchQuery, setSearchQuery, lists, toggleSelectList, isSelected, listsSelected } =
    useListPageLogics();

  const renderList = (list: List, index: number) => {
    return (
      <CardList
        key={index}
        list={list}
        toggleSelectList={toggleSelectList}
        isSelected={isSelected}
        listsSelected={listsSelected}
      />
    );
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
        data={lists}
        renderItem={({ item, index }) => renderList(item, index)}
        estimatedItemSize={lists.length}
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
