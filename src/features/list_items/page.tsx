import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { IconPlus } from '@tabler/icons-react-native';

import ListItemComponent from '@/features/list_items/components/list-item';
import { TopBar } from '@/components/top-bar';

import { formatCurrency } from './utils';
import type { ListItem } from './types';
import { ItemCreateModal, ItemDeleteModal, ItemUpdateModal } from './modals';
import { useListItemsPageLogics } from './hooks/use-list-items-page-logics';
import { Fab } from '@/components/ui/fab';
import { ListItemsContent, ListItemsFooter, ListItemsSortBar, ListItemSkeletonList } from './components';

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

  const renderItem = useCallback(
    (item: ListItem) => (
      <ListItemComponent
        key={item.id}
        id={item.id}
        status={item.isChecked}
        title={item.title}
        price={formatCurrency(item.price ?? 0)}
        amount={String(item.amount ?? 0)}
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
        onPress={handleOpenAdd}
        icon={IconPlus}
        label="Adicionar Item"
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
