import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from '@legendapp/state/react';
import { IconPlus } from '@tabler/icons-react-native';

import ListItemComponent from '@/features/list_items/components/list-item';
import { TopBar } from '@/components/top-bar';
import { Text } from '@/components/ui/text';

import { formatCurrency } from './utils';
import type { SortMode } from './utils';
import type { ListItem } from './types';
import { ItemCreateModal, ItemDeleteModal, ItemUpdateModal } from './modals';
import { useListItemsPageLogics } from './hooks/use-list-items-page-logics';
import { cn } from '@/lib/utils';
import { Fab } from '@/components/ui/fab';
import { ListItemsContent, ListItemsFooter } from './components';

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'default', label: 'Padrão' },
  { key: 'az', label: 'A-Z' },
  { key: 'price', label: '$ → $$' },
];

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
    total,
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
        checkHandle={() => handleToggleCheck(item.id, item.isChecked)}
        onEdit={handleOpenUpdate}
        onDelete={handleOpenDelete}
      />
    ),
    [handleToggleCheck, handleOpenUpdate, handleOpenDelete],
  );

  if (!currentList?.id) return null;

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

      {/* Sort Bar */}
      <View className="flex-row items-center gap-2 px-4 py-3">
        {SORT_OPTIONS.map((opt) => {
          const isActive = sortMode === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setSortMode(opt.key)}
              className={cn('rounded-full px-4 py-1.5', isActive && 'bg-accent')}>
              <Text
                className={cn(
                  'text-sm font-semibold',
                  isActive ? 'text-white' : 'text-muted-foreground',
                )}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ListItemsContent unchecked={unchecked} checked={checked} renderItem={renderItem} />

      <ListItemsFooter total={total} />

      <Fab onPress={handleOpenAdd} icon={IconPlus} label="Adicionar Item" />

      <ItemCreateModal open={isCreateOpen} listId={listId} onOpenChange={setCreateOpen} />
      <ItemUpdateModal open={isUpdateOpen} itemId={activeItemId} onOpenChange={setUpdateOpen} />
      <ItemDeleteModal open={isDeleteOpen} itemId={activeItemId} onOpenChange={setDeleteOpen} />
    </View>
  );
});

export default ListItemsScreen;
