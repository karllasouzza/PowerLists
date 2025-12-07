import React, { useMemo, useRef, useCallback } from 'react';
import { View, ScrollView, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useObserve } from '@legendapp/state/react';
import humps from 'humps';
import { CardList } from '@/components/card-list';
import NewListItem from '@/components/new-list-item';
import { useTheme } from '@/context/themes/use-themes';
import { themes } from '@/context/themes/theme-config';
import { lists$ } from '@/data/actions/lists.actions';

import { HomeScreenProps } from './types';
import { useHomeState } from './hooks/use-home-state';
import { handleDeleteList } from './utils/list-operations';
import { filterListsByQuery } from './utils/list-filters';
import { transformListForDisplay } from './utils/list-transformer';
import { HomeAppbar } from './components/home-appbar';
import { HomeFab } from './components/home-fab';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { top } = useSafeAreaInsets();
  const { theme, colorScheme } = useTheme();
  const refSearchbar = useRef<any>(null);

  const {
    setListEditId,
    mode,
    setMode,
    defaultValues,
    setDefaultValues,
    onSearch,
    setOnSearch,
    searchQuery,
    setSearchQuery,
    isExtended,
    setIsExtended,
    returnOfMode,
  } = useHomeState();

  // Observa mudanças no observable lists$
  const listsData = useObserve(lists$);

  // Converte o objeto observable para array e camelCase
  const lists = useMemo(() => {
    const listsArray = Object.values(listsData || {});
    return humps.camelizeKeys(listsArray) as any[];
  }, [listsData]);

  // Back handler para Android
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (mode === 'add' || mode === 'edit') {
          returnOfMode();
          return true;
        } else if (onSearch) {
          setOnSearch(false);
          return true;
        }
        return false;
      });

      if (onSearch) {
        refSearchbar?.current?.focus();
      }

      return () => {
        backHandler.remove();
      };
    }, [mode, onSearch, returnOfMode, setOnSearch])
  );

  const onScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const filteredLists = filterListsByQuery(lists, searchQuery);

  const onDeleteList = async (id: string) => {
    await handleDeleteList(id);
  };

  const renderList = (list: any, index: number) => {
    const themeVars = themes[theme][colorScheme];
    const themeBackground = themeVars['--color-background'] || '#fff';
    const transformedList = transformListForDisplay(list, themeBackground);

    return (
      <CardList
        key={index}
        list={{
          ...transformedList,
          accentColor: {
            name: list.accentColor,
            value: list.accentColor,
          },
        }}
        pressHandler={() =>
          navigation.navigate('List', {
            list: {
              ...list,
              accentColor: list.accentColor,
            },
            action: 'viewListItens',
          })
        }
        deleteHandle={onDeleteList}
        editHandle={(id, title, color, hideMenu) => {
          setMode('edit');
          setListEditId(id);
          setDefaultValues({
            title,
            color,
            icon: list.icon || 'cart',
          });
          hideMenu();
        }}
      />
    );
  };

  return (
    <View className="flex-1 items-center bg-background">
      <HomeAppbar
        top={top}
        onSearch={onSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setOnSearch={setOnSearch}
        refSearchbar={refSearchbar}
      />

      <ScrollView className="w-full py-2.5" onScroll={onScroll} scrollEventThrottle={16}>
        {searchQuery.length > 0 && onSearch
          ? filteredLists?.map(renderList)
          : lists?.map(renderList)}
      </ScrollView>

      <HomeFab
        isExtended={isExtended}
        onPress={() => {
          setMode('add');
          setDefaultValues({});
        }}
      />

      {(mode === 'add' || mode === 'edit') && (
        <NewListItem
          type="Lists"
          mode={mode}
          open={true}
          onOpenChange={(open) => !open && returnOfMode()}
          editingItem={mode === 'edit' ? defaultValues : undefined}
          onSuccess={() => returnOfMode()}
          colors={['primary', 'secondary', 'tertiary', 'error']}
          icons={[
            'cart',
            'credit-card-chip',
            'baby-carriage',
            'bag-suitcase',
            'ambulance',
            'book',
            'chef-hat',
          ]}
        />
      )}
    </View>
  );
}
