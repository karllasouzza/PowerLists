import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Pressable, Animated, BackHandler, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { IconSearch, IconArrowLeft, IconX } from '@tabler/icons-react-native';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export const TopBar = ({
  title,
  showBack = false,
  onBack,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  rightAction,
  className,
}: TopBarProps) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Animation values
  const searchBarOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(1)).current;

  const handleCloseSearch = useCallback(() => {
    setIsSearchActive(false);
    onSearchChange?.('');
  }, [onSearchChange]);

  const handleOpenSearch = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const handleClearSearch = useCallback(() => {
    onSearchChange?.('');
    searchInputRef.current?.focus();
  }, [onSearchChange]);

  useEffect(() => {
    if (isSearchActive) {
      searchInputRef.current?.focus();

      Animated.parallel([
        Animated.timing(searchBarOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(searchBarOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isSearchActive) {
        handleCloseSearch();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isSearchActive, searchBarOpacity, titleOpacity, handleCloseSearch]);

  return (
    <View className="z-40 w-full flex-row items-center justify-between rounded-2xl px-4 py-3">
      {/* Left Section */}
      <View className="flex-row items-center gap-3">
        {showBack && (
          <Pressable
            onPress={onBack}
            className="active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon as={IconArrowLeft} size={24} className="text-muted" />
          </Pressable>
        )}

        {/* Title - always rendered, animated visibility */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            display: isSearchActive ? 'none' : 'flex',
          }}>
          <Text className="text-xl font-bold text-foreground">{title}</Text>
        </Animated.View>

        {/* Search Input - always rendered, animated visibility */}
        <Animated.View
          style={{
            opacity: searchBarOpacity,
            flexDirection: 'row',
            display: isSearchActive ? 'flex' : 'none',
          }}
          className="flex-row items-center gap-2">
          <Pressable
            onPress={handleCloseSearch}
            className="active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon as={IconArrowLeft} size={24} className="text-foreground" />
          </Pressable>

          <Input
            ref={searchInputRef}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChangeText={onSearchChange}
            className="bg-muted/50 flex-1 border-0"
          />

          {searchQuery.length > 0 && (
            <Pressable
              onPress={handleClearSearch}
              className="active:opacity-70"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon as={IconX} size={20} className="text-muted-foreground" />
            </Pressable>
          )}
        </Animated.View>
      </View>

      {/* Right Section */}
      <Animated.View
        style={{
          opacity: titleOpacity,
          display: isSearchActive ? 'none' : 'flex',
          flexDirection: 'row',
        }}
        className="flex-row items-center gap-2">
        {showSearch && (
          <Pressable
            onPress={handleOpenSearch}
            className="bg-muted/50 rounded-full p-2 active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon as={IconSearch} size={20} className="text-foreground" />
          </Pressable>
        )}
        {rightAction}
      </Animated.View>
    </View>
  );
};
