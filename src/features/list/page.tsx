/**
 * Tela de visualização e gerenciamento de items de uma lista
 *
 * Este componente é "burro" (presentational) - toda a lógica de negócio
 * está encapsulada nos data actions e utilitários.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ListItem from '@/components/list-item';
import NewListItem from '@/components/new-list-item';
import { useTheme } from '@/context/themes/use-themes';
import { themes } from '@/context/themes/theme-config';
import {
  getListItemsByListId,
  toggleCheckListItem,
  deleteListItem,
} from '@/data/actions/list-items.actions';

import { ListItemsHeader, ListItemsFooter } from './components';
import { calculateTotal, formatCurrency, separateItemsByStatus } from './utils';
import type { ListItemsScreenProps, ListItem as ListItemType } from './types';

/**
 * Tela principal de gerenciamento de items de lista
 */
export default function ListItemsScreen({ navigation, route }: ListItemsScreenProps) {
  const { theme, colorScheme } = useTheme();
  const list = route.params?.list;
  const { top, bottom } = useSafeAreaInsets();

  const [items, setItems] = useState<ListItemType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ListItemType | null>(null);

  /**
   * Busca todos os items da lista
   */
  const fetchItems = useCallback(async () => {
    try {
      const { results } = await getListItemsByListId({ listId: list.id });
      if (results) {
        // Mapeia isChecked para status para compatibilidade com o componente
        const mappedItems = results.map((item) => ({
          ...item,
          price: item.price || 0,
          status: item.isChecked,
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('[ListItemsScreen] Error fetching items:', error);
    }
  }, [list.id]);

  // Busca items quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems])
  );

  /**
   * Marca/desmarca um item como concluído
   */
  const handleToggleCheck = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      const success = await toggleCheckListItem({ id, isChecked: !currentStatus });
      if (success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: !currentStatus } : item))
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
  const handleEdit = useCallback((item: ListItemType) => {
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
    fetchItems();
    handleCloseDialog();
  }, [fetchItems, handleCloseDialog]);

  // Separa items em checked e unchecked, ordenados por data
  const { unchecked, checked } = useMemo(() => separateItemsByStatus(items), [items]);

  // Calcula o total de todos os items
  const total = useMemo(() => calculateTotal(items), [items]);

  // Cores do tema
  const themeColors = themes[theme][colorScheme];
  const accentColor = themeColors[`--color-${list.accentColor}`] || themeColors['--color-primary'];
  const backgroundColor = themeColors['--color-card'];
  const textColor = themeColors['--color-foreground'];
  const mutedColor = themeColors['--color-muted'];

  /**
   * Renderiza um item da lista
   */
  const renderItem = useCallback(
    (item: ListItemType) => (
      <ListItem
        key={item.id}
        background={accentColor}
        status={item.status}
        title={item.title}
        item={item}
        price={formatCurrency(item.price)}
        amount={String(item.amount)}
        color={textColor}
        subColor={mutedColor}
        checkColor={accentColor}
        checkHandle={() => handleToggleCheck(item.id, item.status)}
        editHandle={handleEdit}
        deleteHandle={handleDelete}
      />
    ),
    [accentColor, textColor, mutedColor, handleToggleCheck, handleEdit, handleDelete]
  );

  return (
    <View className="flex-1 bg-background">
      <ListItemsHeader
        title={list.title}
        backgroundColor={backgroundColor}
        textColor={textColor}
        topInset={top}
        onBack={() => navigation.goBack()}
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
        bottomInset={bottom}
        onAddPress={handleOpenAdd}
      />

      <NewListItem
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={editingItem ? 'edit' : 'add'}
        type="Items"
        listId={list.id}
        editingItem={editingItem}
        onSuccess={handleSuccess}
      />
    </View>
  );
}
