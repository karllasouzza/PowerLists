import React, { Suspense, useCallback } from 'react';
import { View, FlatList } from 'react-native';

import { CardListSkeletonList } from '@/features/lists/components/card-list-skeleton';
import { closeOpenedSwipeable } from '@/components/swipeable';
import { TopBar } from '@/components/top-bar';

import { useListPageLogics } from './hooks/use-lists-page';
import { IconFolderOff, IconPlus } from '@tabler/icons-react-native';
import { Fab } from '@/components/ui/fab';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
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

  const isEmpty = lists.length === 0;

  return (
    <View className="flex flex-1 items-center bg-background p-0! w-full h-full">
      <TopBar
        title="Minhas Listas"
        showSearch={!isEmpty}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Procurando por algo?"
      />

      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-8">
          <Icon as={IconFolderOff} size={48} className="text-muted-foreground" />
          <Text className="mt-4 text-lg font-semibold text-foreground">Nenhuma lista ainda</Text>
          <Text variant="muted" className="mt-1 text-center">
            Crie sua primeira lista e saiba exatamente{'\n'}quanto vai gastar em cada compra.
          </Text>
          <Button
            variant="default"
            className="mt-6 h-12 px-8"
            onPress={handleOpenCreateModal}>
            <Icon as={IconPlus} size={20} className="text-primary-foreground" />
            <Text className="text-base font-bold text-primary-foreground">Criar primeira lista</Text>
          </Button>
        </View>
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
