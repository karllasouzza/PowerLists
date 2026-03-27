import React, { useCallback } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { observer } from '@legendapp/state/react';

import type { List } from '@/data/types';
import { CardList, closeOpenedCardListSwipe } from '@/features/lists/components/card-list';
import { TopBar } from '@/components/top-bar';

import { useListPageLogics } from './hooks/use-list-page-logics';
import { IconPlus } from '@tabler/icons-react-native';
import { Fab } from '@/components/ui/fab';
import { ListCreateModal, ListDeleteModal, ListUpdateModal } from './modals';

const HomeScreen = observer(() => {
  const {
    searchQuery,
    setSearchQuery,
    lists,
    toggleSelectList,
    isSelected,
    listsSelected,
    isCreateOpen,
    setCreateOpen,
    isUpdateOpen,
    setUpdateOpen,
    isDeleteOpen,
    setDeleteOpen,
    activeListId,
    handleOpenCreateModal,
    handleOpenUpdateModal,
    handleOpenDeleteModal,
  } = useListPageLogics();

  const renderList = (list: List, index: number) => {
    return (
      <CardList
        key={index}
        list={list}
        toggleSelectList={toggleSelectList}
        isSelected={isSelected}
        listsSelected={listsSelected}
        onEdit={handleOpenUpdateModal}
        onDelete={handleOpenDeleteModal}
      />
    );
  };

  const handleListScrollStart = useCallback(() => {
    closeOpenedCardListSwipe();
  }, []);

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
        onScrollBeginDrag={handleListScrollStart}
        ListFooterComponent={() => <View className="h-44 border-t border-border" />}
      />

      <Fab icon={IconPlus} onPress={handleOpenCreateModal} />

      <ListCreateModal open={isCreateOpen} onOpenChange={setCreateOpen} />
      <ListUpdateModal open={isUpdateOpen} listId={activeListId} onOpenChange={setUpdateOpen} />
      <ListDeleteModal open={isDeleteOpen} listId={activeListId} onOpenChange={setDeleteOpen} />
    </View>
  );
});

export default HomeScreen;
