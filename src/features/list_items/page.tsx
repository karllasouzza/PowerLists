import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { observer, useValue } from '@legendapp/state/react';

import ListItemComponent from '@/components/list-item';
// import NewListItem from '@/components/new-list-item';
import { useTheme } from '@/context/themes/use-themes';
import { themes } from '@/context/themes/theme-config';
import { toggleCheckListItem, deleteListItem, listItems$ } from '@/data/states/list-items';

import { ListItemsHeader, ListItemsFooter } from './components';
import { calculateTotal, formatCurrency, separateItemsByStatus } from './utils';
import type { ListItem as ListItem } from './types';
import { lists$ } from '@/data/states/lists';
import { List } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

const ListItemsScreen = observer(() => {
  const router = useRouter();
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const { theme, colorScheme } = useTheme();

  const lists = useValue(lists$ || {});
  const listsFormated = convertFromSupabaseFormat(Object.values(lists || {})) as List[];
  const currentList = listsFormated.find((list) => list.id === listId);

  const listItemsRaw = useValue(listItems$.get());
  const listItemsFormated = convertFromSupabaseFormat(
    Object.values(listItemsRaw || {})
  ) as ListItem[];

  console.log('listItemsRaw', listItemsFormated);

  const [items, setItems] = useState<ListItem[]>(() => {
    const allItems = listItemsFormated.filter((item) => item.listId === listId);
    return allItems as ListItem[];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItem | null>(null);

  /**
   * Marca/desmarca um item como concluído
   */
  const handleToggleCheck = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      const success = await toggleCheckListItem({ id, isChecked: !currentStatus });
      if (success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isChecked: !currentStatus } : item))
        );
      }
    } catch (error) {
      console.error('[ListItemsScreen] Error toggling item check:', error);
    }
  }, []);

  /**
   * Remove um item da lista
   */
  const handleDelete = useCallback(async (id: string) => {
    try {
      const success = await deleteListItem({ itemId: id });
      if (success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('[ListItemsScreen] Error deleting item:', error);
    }
  }, []);

  /**
   * Abre o formulário em modo de adição
   */
  const handleOpenAdd = useCallback(() => {
    setEditingItem(null);
    setIsDialogOpen(true);
  }, []);

  /**
   * Abre o formulário em modo de edição
   */
  const handleEdit = useCallback((item: ListItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  }, []);

  /**
   * Fecha o formulário
   */
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingItem(null);
  }, []);

  /**
   * Callback após sucesso na criação/edição
   */
  const handleSuccess = useCallback(() => {
    handleCloseDialog();
  }, [handleCloseDialog]);

  // Separa items em checked e unchecked, ordenados por data
  const { unchecked, checked } = useMemo(() => separateItemsByStatus(items), [items]);

  // Calcula o total de todos os items
  const total = useMemo(() => calculateTotal(items), [items]);

  // Cores do tema
  const themeColors = themes[theme][colorScheme];
  const accentColor =
    themeColors[`--color-${currentList?.accentColor || 'primary'}`] ||
    themeColors['--color-primary'];
  const backgroundColor = themeColors['--color-card'];
  const textColor = themeColors['--color-foreground'];
  const mutedColor = themeColors['--color-muted'];

  /**
   * Renderiza um item da lista
   */
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
        editHandle={handleEdit}
        deleteHandle={handleDelete}
      />
    ),
    [accentColor, textColor, mutedColor, handleToggleCheck, handleEdit, handleDelete]
  );

  if (!currentList?.id) return null;

  return (
    <View className="flex-1 bg-background">
      <ListItemsHeader
        title={currentList?.title ?? ''}
        backgroundColor={backgroundColor}
        textColor={textColor}
        topInset={0}
        onBack={() => router.back()}
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

      {/* <NewListItem
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={editingItem ? 'edit' : 'add'}
        type="Items"
        listId={currentList?.id || ''}
        editingItem={editingItem}
        onSuccess={handleSuccess}
      /> */}
    </View>
  );
});

export default ListItemsScreen;
