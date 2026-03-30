import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Pressable, BackHandler, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { IconSearch, IconArrowLeft, IconX } from '@tabler/icons-react-native';
import { Button } from '../ui/button';

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
  const searchBarOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(1);

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

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const searchBarStyle = useAnimatedStyle(() => ({ opacity: searchBarOpacity.value }));

  useEffect(() => {
    if (isSearchActive) {
      searchInputRef.current?.focus();

      searchBarOpacity.value = withTiming(1, { duration: 200 });
      titleOpacity.value = withTiming(0, { duration: 150 });
    } else {
      searchBarOpacity.value = withTiming(0, { duration: 200 });
      titleOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
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
    <View className="z-40 flex-row justify-between items-center px-4 py-3 border-border border-b w-full">
      {/* Left Section */}
      <View className="flex-row items-center gap-3">
        {showBack && !isSearchActive && (
          <Button
            variant="ghost"
            size="icon"
            onPress={onBack}
            className="active:opacity-70"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon as={IconArrowLeft} size={24} className="text-foreground" />
          </Button>
        )}

        {/* Title - always rendered, animated visibility */}
        <Animated.View style={[titleStyle, { display: isSearchActive ? 'none' : 'flex' }]}>
          <Text className="font-bold text-foreground text-xl">{title}</Text>
        </Animated.View>

        {/* Search Input - always rendered, animated visibility */}
        <Animated.View
          style={[
            searchBarStyle,
            { flexDirection: 'row', display: isSearchActive ? 'flex' : 'none' },
          ]}
          className="flex-row items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onPress={handleCloseSearch}
            className="active:opacity-70">
            <Icon as={IconArrowLeft} size={24} className="text-foreground" />
          </Button>

          <View className="flex-row flex-1 items-center gap-2 px-2 py-1 rounded-xl">
            <Input
              ref={searchInputRef}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChangeText={onSearchChange}
              className="flex-1 bg-muted/50 shadow-none border-0"
            />

            {searchQuery.length > 0 && (
              <Pressable
                onPress={handleClearSearch}
                className="active:opacity-70"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon as={IconX} size={20} className="text-muted-foreground" />
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Right Section */}
      <Animated.View
        style={[titleStyle, { display: isSearchActive ? 'none' : 'flex', flexDirection: 'row' }]}
        className="flex-row items-center gap-2">
        {showSearch && (
          <Button
            variant="ghost"
            size="icon"
            onPress={handleOpenSearch}
            className="bg-muted/50 active:opacity-70 p-2 rounded-full"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon as={IconSearch} size={20} className="text-foreground" />
          </Button>
        )}
        {rightAction}
      </Animated.View>
    </View>
  );
};
