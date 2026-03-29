import React, { useCallback } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { observer } from '@legendapp/state/react';

import type { List } from '@/data/types';
import { CardList } from '@/features/lists/components/card-list';
import { closeOpenedSwipeable } from '@/components/swipeable';
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

  const renderList = useCallback(
    (list: List, index: number) => (
      <CardList
        key={list.id}
        list={list}
        onEdit={handleOpenUpdateModal}
        onDelete={handleOpenDeleteModal}
      />
    ),
    [handleOpenUpdateModal, handleOpenDeleteModal],
  );

  const handleListScrollStart = useCallback(() => {
    closeOpenedSwipeable();
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
        estimatedItemSize={200}
        drawDistance={500}
        className="flex h-full w-full flex-1"
        keyExtractor={(item) => item.id}
        recycleItems
        onScrollBeginDrag={handleListScrollStart}
      />

      <Fab icon={IconPlus} label="Adicionar Lista" onPress={handleOpenCreateModal} />

      <ListCreateModal open={isCreateOpen} onOpenChange={setCreateOpen} />
      <ListUpdateModal open={isUpdateOpen} listId={activeListId} onOpenChange={setUpdateOpen} />
      <ListDeleteModal open={isDeleteOpen} listId={activeListId} onOpenChange={setDeleteOpen} />
    </View>
  );
});

export default HomeScreen;
