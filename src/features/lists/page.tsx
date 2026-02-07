import React from 'react';
import { View } from 'react-native';
import { CardList } from '@/components/card-list';
import { LegendList } from '@legendapp/list';

import { useHomeState } from './hooks/use-home-state';
import { handleDeleteList } from './utils/list-operations';
import { filterListsByQuery } from './utils/list-filters';
import { HomeAppbar } from './components/home-appbar';
import { router } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { List } from '@/data/types';

const HomeScreen = observer(() => {
  const { listEditId, setListEditId, searchQuery, setSearchQuery, returnOfMode, lists } =
    useHomeState();

  const filteredLists = filterListsByQuery(lists, searchQuery);

  const onDeleteList = async (id: string) => {
    await handleDeleteList(id);
  };

  const renderList = (list: List, index: number) => {
    return (
      <CardList
        key={index}
        list={list}
        pressHandler={() =>
          router.push({
            pathname: 'lists/[id]',
            params: { id: list.id },
          })
        }
        deleteHandle={onDeleteList}
        editHandle={(id) => {
          setListEditId(id);
        }}
      />
    );
  };

  return (
    <View className="flex h-full w-full flex-1 items-center bg-background">
      <HomeAppbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <LegendList
        data={searchQuery.length > 0 ? filteredLists : lists}
        renderItem={({ item, index }) => renderList(item, index)}
        className="flex h-full w-full flex-1 bg-red-300 py-2.5"
        keyExtractor={(item) => item.id}
        recycleItems
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
