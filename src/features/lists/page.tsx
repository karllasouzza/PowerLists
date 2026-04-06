import React, { Suspense, useCallback } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { observer } from '@legendapp/state/react';

import type { List } from '@/data/types';
import { CardListSkeletonList } from '@/features/lists/components/card-list-skeleton';
import { closeOpenedSwipeable } from '@/components/swipeable';
import { TopBar } from '@/components/top-bar';

import { useListPageLogics } from './hooks/use-list-page-logics';
import { IconPlus } from '@tabler/icons-react-native';
import { Fab } from '@/components/ui/fab';
import { ListCreateModal, ListDeleteModal, ListUpdateModal } from './modals';

const LIST_CARD_ESTIMATED_ITEM_SIZE = 96;
const LIST_CARD_DRAW_DISTANCE = 700;

const AsyncCardList = React.lazy(async () => {
  const module = await import('@/features/lists/components/card-list');
  return { default: module.CardList };
});

const HomeScreen = observer(() => {
  const {
    searchQuery,
    setSearchQuery,
    lists,
    listTotalsById,
    isLoading,
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

      {isLoading ? (
        <CardListSkeletonList />
      ) : (
        <Suspense fallback={<CardListSkeletonList />}>
          <LegendList
            data={lists}
            renderItem={({ item }) => renderList(item)}
            estimatedItemSize={LIST_CARD_ESTIMATED_ITEM_SIZE}
            drawDistance={LIST_CARD_DRAW_DISTANCE}
            className="flex flex-1 w-full h-full"
            keyExtractor={(item) => item.id}
            extraData={listTotalsById}
            recycleItems
            onScrollBeginDrag={handleListScrollStart}
            ListFooterComponent={<View className="h-20" />}
          />
        </Suspense>
      )}

      <Fab icon={IconPlus} label="Adicionar Lista" onPress={handleOpenCreateModal} />

      <ListCreateModal open={isCreateOpen} onOpenChange={setCreateOpen} />
      <ListUpdateModal open={isUpdateOpen} listId={activeListId} onOpenChange={setUpdateOpen} />
      <ListDeleteModal open={isDeleteOpen} listId={activeListId} onOpenChange={setDeleteOpen} />
    </View>
  );
});

export default HomeScreen;
