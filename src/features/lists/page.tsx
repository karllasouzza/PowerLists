import React, { Suspense, useCallback } from 'react';
import { View, FlatList } from 'react-native';

import { CardListSkeletonList } from '@/features/lists/components/card-list-skeleton';
import { closeOpenedSwipeable } from '@/components/swipeable';
import { TopBar } from '@/components/top-bar';

import { useListPageLogics } from './hooks/use-list-page-logics';
import { IconPlus } from '@tabler/icons-react-native';
import { Fab } from '@/components/ui/fab';
import { ListCreateModal, ListDeleteModal, ListUpdateModal } from './modals';

const AsyncCardList = React.lazy(async () => {
  const module = await import('@/features/lists/components/card-list');
  return { default: module.CardList };
});

const HomeScreen = () => {
  const {
    searchQuery,
    setSearchQuery,
    lists,
    listTotalsById,
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
    (list: any) => (
      <AsyncCardList
        list={list}
        totalPrice={listTotalsById[list.id] ?? 'R$ 0,00'}
        onEdit={handleOpenUpdateModal}
        onDelete={handleOpenDeleteModal}
      />
    ),
    [handleOpenDeleteModal, handleOpenUpdateModal, listTotalsById],
  );

  const handleListScrollStart = useCallback(() => {
    closeOpenedSwipeable();
  }, []);

  return (
    <View className="flex flex-1 items-center bg-background p-0! w-full h-full">
      <TopBar
        title="Minhas Listas"
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Procurando por algo?"
      />

      <Suspense fallback={<CardListSkeletonList />}>
        <FlatList
          data={lists}
          renderItem={({ item }) => renderList(item)}
          keyExtractor={(item) => item.id}
          extraData={listTotalsById}
          onScrollBeginDrag={handleListScrollStart}
          ListFooterComponent={<View className="h-20" />}
          className="flex flex-1 w-full h-full"
        />
      </Suspense>

      <Fab icon={IconPlus} label="Adicionar Lista" onPress={handleOpenCreateModal} />

      <ListCreateModal open={isCreateOpen} onOpenChange={setCreateOpen} />
      <ListUpdateModal open={isUpdateOpen} listId={activeListId} onOpenChange={setUpdateOpen} />
      <ListDeleteModal open={isDeleteOpen} listId={activeListId} onOpenChange={setDeleteOpen} />
    </View>
  );
};

export default HomeScreen;
