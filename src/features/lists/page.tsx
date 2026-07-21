import React, { Suspense, useCallback } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { CardListSkeletonList } from '@/features/lists/components/card-list-skeleton';
import { closeOpenedSwipeable } from '@/components/swipeable';
import { TopBar } from '@/components/top-bar';

import { useListPageLogics } from './hooks/use-lists-page';
import { IconPlus, IconChartBar } from '@tabler/icons-react-native';
import { Fab } from '@/components/ui/fab';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ListCreateModal, ListDeleteModal, ListUpdateModal } from './modals';
import { EmptyListsState } from './components/empty-lists-state';
import type { List } from '@/types';

const AsyncCardList = React.lazy(async () => {
  const module = await import('@/features/lists/components/card-list');
  return { default: module.CardList };
});

const HomeScreen = () => {
  const router = useRouter();
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

  const isEmpty = lists.length === 0;

  return (
    <View className="flex flex-1 items-center bg-background p-0! w-full h-full">
      <TopBar
        title="Minhas Listas"
        showSearch={!isEmpty}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Procurando por algo?"
        rightAction={
          !isEmpty ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver resumo de gastos"
              onPress={() => router.push('/dashboard')}
              className="flex-row items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
              <Icon as={IconChartBar} size={18} className="text-foreground" />
              <Text variant="small" className="font-semibold text-foreground">
                Resumo
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      {isEmpty ? (
        <EmptyListsState onCreateList={handleOpenCreateModal} />
      ) : (
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
      )}

      {!isEmpty && (
        <Fab
          icon={IconPlus}
          label="Adicionar Lista"
          accessibilityLabel="Adicionar nova lista"
          accessibilityRole="button"
          onPress={handleOpenCreateModal}
        />
      )}

      <ListCreateModal open={isCreateOpen} onOpenChange={setCreateOpen} />
      <ListUpdateModal open={isUpdateOpen} listId={activeListId} onOpenChange={setUpdateOpen} />
      <ListDeleteModal open={isDeleteOpen} listId={activeListId} onOpenChange={setDeleteOpen} />
    </View>
  );
};

export default HomeScreen;
