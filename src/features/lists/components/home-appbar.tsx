import React, { useEffect, useState } from 'react';
import { View, Pressable, BackHandler } from 'react-native';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { IconSearch, IconArrowLeft } from '@tabler/icons-react-native';
import { cn } from '@/lib/utils';

interface HomeAppbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HomeAppbar = ({ searchQuery, setSearchQuery }: HomeAppbarProps) => {
  const [onSearch, setOnSearch] = useState(false);
  const refSearchbar = React.useRef<any>(null);

  useEffect(() => {
    if (onSearch && refSearchbar.current) {
      refSearchbar.current.focus();
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onSearch) {
        setOnSearch(false);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [onSearch, refSearchbar]);

  return (
    <View
      className={cn(
        'shadow-s w-full justify-end bg-background px-5 pb-2',
        !onSearch ? 'max-h-20' : 'max-h-110'
      )}>
      {onSearch ? (
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => setOnSearch(false)}>
            <Icon as={IconArrowLeft} size={24} className="text-foreground" />
          </Pressable>
          <Input
            ref={refSearchbar}
            placeholder="Pesquisar listas"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1"
          />
        </View>
      ) : (
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Listas</Text>
          <Pressable onPress={() => setOnSearch(true)} className="p-2">
            <Icon as={IconSearch} size={24} className="text-foreground" />
          </Pressable>
        </View>
      )}
    </View>
  );
};
