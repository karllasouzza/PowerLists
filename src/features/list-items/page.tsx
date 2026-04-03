import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { IconPlus, IconMicrophone } from '@tabler/icons-react-native';

import { TopBar } from '@/components/top-bar';
import { Fab } from '@/components/ui/fab';

import { useListItemsPageLogics } from './hooks/use-list-items-page-logics';
import { ItemCreateModal, ItemDeleteModal, ItemUpdateModal } from './modals';
import {
  ListItemsContent,
  ListItemsFooter,
  ListItemsSortBar,
  ListItemSkeletonList,
} from './components';
import ListItemCard from './components/list-item-card';
import type { ListItem } from './types';

const ListItemsScreen = observer(() => {
  const router = useRouter();
  const {
    listId,
    currentList,
    searchQuery,
    setSearchQuery,
    sortMode,
    setSortMode,
    unchecked,
    checked,
    payableTotal,
    accentBgClassName,
    accentForegroundClassName,
    isCreateOpen,
    setCreateOpen,
    isUpdateOpen,
    setUpdateOpen,
    isDeleteOpen,
    setDeleteOpen,
    activeItemId,
    handleToggleCheck,
    handleOpenAdd,
    handleOpenUpdate,
    handleOpenDelete,
  } = useListItemsPageLogics();

  const handleOpenAssistant = useCallback(() => {
    router.push({
      pathname: '/list/assistant',
      params: { id: listId },
    });
  }, [listId, router]);

  const renderItem = useCallback(
    (item: ListItem) => (
      <ListItemCard
        key={item.id}
        id={item.id}
        status={item.isChecked}
        title={item.title}
        price={item.price ?? 0}
        amount={item.amount ?? 0}
        accentBgClassName={accentBgClassName}
        accentForegroundClassName={accentForegroundClassName}
        checkHandle={() => handleToggleCheck(item.id, item.isChecked)}
        onEdit={handleOpenUpdate}
        onDelete={handleOpenDelete}
      />
    ),
    [
      accentBgClassName,
      accentForegroundClassName,
      handleToggleCheck,
      handleOpenUpdate,
      handleOpenDelete,
    ],
  );

  if (!currentList?.id) {
    return (
      <View className="flex-1 bg-background">
        <TopBar
          title="Lista"
          showBack={true}
          onBack={() => router.back()}
          showSearch={false}
          searchQuery=""
          onSearchChange={() => {}}
          searchPlaceholder="Buscar itens..."
        />
        <ListItemSkeletonList />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TopBar
        title={currentList?.title ?? 'Lista'}
        showBack={true}
        onBack={() => router.back()}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Buscar itens..."
      />
      <ListItemsSortBar
        sortMode={sortMode}
        setSortMode={setSortMode}
        accentBgClassName={accentBgClassName}
        accentForegroundClassName={accentForegroundClassName}
      />

      <ListItemsContent
        unchecked={unchecked}
        checked={checked}
        accentBgClassName={accentBgClassName}
        accentForegroundClassName={accentForegroundClassName}
        renderItem={renderItem}
      />

      <ListItemsFooter
        total={payableTotal}
        accentBgClassName={accentBgClassName}
        accentForegroundClassName={accentForegroundClassName}
      />

      <Fab
        className="!bottom-36"
        onPress={handleOpenAssistant}
        icon={IconMicrophone}
        buttonClassName={'bg-blue-400'}
        iconClassName={accentForegroundClassName}
        labelClassName={accentForegroundClassName}
      />
      <Fab
        className="!bottom-20"
        onPress={handleOpenAdd}
        icon={IconPlus}
        buttonClassName={accentBgClassName}
        iconClassName={accentForegroundClassName}
        labelClassName={accentForegroundClassName}
      />

      <ItemCreateModal
        open={isCreateOpen}
        listId={listId}
        onOpenChange={setCreateOpen}
        accentBgClassName={accentBgClassName}
        accentForegroundClassName={accentForegroundClassName}
      />
      <ItemUpdateModal
        open={isUpdateOpen}
        itemId={activeItemId}
        onOpenChange={setUpdateOpen}
        accentBgClassName={accentBgClassName}
        accentForegroundClassName={accentForegroundClassName}
      />
      <ItemDeleteModal open={isDeleteOpen} itemId={activeItemId} onOpenChange={setDeleteOpen} />
    </View>
  );
});

export default ListItemsScreen;
