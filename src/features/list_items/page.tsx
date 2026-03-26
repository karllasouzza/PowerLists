import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from '@legendapp/state/react';

import ListItemComponent from '@/components/list-item';
import { TopBar } from '@/components/top-bar';

import { ListItemsFooter } from './components';
import { formatCurrency } from './utils';
import type { ListItem as ListItem } from './types';
import { ItemCreateModal, ItemDeleteModal, ItemUpdateModal } from './modals';
import { useListItemsPageLogics } from './hooks/use-list-items-page-logics';

const ListItemsScreen = observer(() => {
  const router = useRouter();
  const {
    listId,
    currentList,
    searchQuery,
    setSearchQuery,
    unchecked,
    checked,
    total,
    accentColor,
    backgroundColor,
    textColor,
    mutedColor,
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
        background={accentColor}
        status={item.isChecked}
        title={item.title}
        item={item}
        price={formatCurrency(item.price)}
        amount={String(item.amount)}
        color={textColor}
        subColor={mutedColor}
        checkColor={accentColor}
        checkHandle={() => handleToggleCheck(item.id, item.isChecked)}
        onEdit={handleOpenUpdate}
        onDelete={handleOpenDelete}
      />
    ),
    [accentColor, textColor, mutedColor, handleToggleCheck, handleOpenUpdate, handleOpenDelete],
  );

  if (!currentList?.id) return null;

  return (
    <View className="flex-1 bg-background">
      <TopBar
        title={currentList?.title ?? 'List'}
        showBack={true}
        onBack={() => router.back()}
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search items..."
      />

      <ScrollView className="w-full flex-1">
        {/* Items não marcados primeiro */}
        {unchecked.map(renderItem)}

        {/* Items marcados por último */}
        {checked.map(renderItem)}
      </ScrollView>

      <ListItemsFooter
        total={total}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        textColor={textColor}
        bottomInset={0}
        onAddPress={handleOpenAdd}
      />

      <ItemCreateModal open={isCreateOpen} listId={listId} onOpenChange={setCreateOpen} />
      <ItemUpdateModal open={isUpdateOpen} itemId={activeItemId} onOpenChange={setUpdateOpen} />
      <ItemDeleteModal open={isDeleteOpen} itemId={activeItemId} onOpenChange={setDeleteOpen} />
    </View>
  );
});

export default ListItemsScreen;
