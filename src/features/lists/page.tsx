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

const LIST_CARD_ESTIMATED_ITEM_SIZE = 96;
const LIST_CARD_DRAW_DISTANCE = 700;

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
    (list: List) => (
      <CardList list={list} onEdit={handleOpenUpdateModal} onDelete={handleOpenDeleteModal} />
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
        renderItem={({ item }) => renderList(item)}
        estimatedItemSize={LIST_CARD_ESTIMATED_ITEM_SIZE}
        drawDistance={LIST_CARD_DRAW_DISTANCE}
        className="flex h-full w-full flex-1"
        keyExtractor={(item) => item.id}
        extraData={searchQuery}
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
