import React from 'react';
import { View, Pressable } from 'react-native';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { IconSearch, IconArrowLeft } from '@tabler/icons-react-native';

interface HomeAppbarProps {
  top: number;
  onSearch: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setOnSearch: (value: boolean) => void;
  refSearchbar: React.RefObject<any>;
}

export const HomeAppbar: React.FC<HomeAppbarProps> = ({
  top,
  onSearch,
  searchQuery,
  setSearchQuery,
  setOnSearch,
  refSearchbar,
}) => {
  return (
    <View
      style={{
        paddingTop: top,
        height: (onSearch ? 110 : 90) + top,
      }}
      className="w-full justify-end bg-background px-5 pb-2 shadow-sm">
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
