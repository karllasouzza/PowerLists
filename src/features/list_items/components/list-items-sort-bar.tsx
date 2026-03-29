/**
 * Componente de cabeçalho para a tela de items
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { SortMode } from '../utils';
import { Button } from '@/components/ui/button';

interface ListItemsSortBarProps {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
  accentBgClassName: string;
  accentForegroundClassName: string;
}

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'default', label: 'Padrão' },
  { key: 'az', label: 'A-Z' },
  { key: 'price', label: '$ → $$' },
];

export const ListItemsSortBar = ({
  sortMode,
  setSortMode,
  accentBgClassName,
  accentForegroundClassName,
}: ListItemsSortBarProps) => {
  return (
    <View className="w-full flex flex-row items-center gap-2 px-4 py-3 overflow-x-auto">
      {SORT_OPTIONS.map((opt) => {
        const isActive = sortMode === opt.key;
        return (
          <Button
            key={opt.key}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'rounded-full flex-shrink-0',
              isActive ? accentBgClassName : 'border-border bg-background',
            )}
            onPress={() => setSortMode(opt.key)}>
            <Text className={cn('font-semibold', isActive ? accentForegroundClassName : 'text-foreground')}>
              {opt.label}
            </Text>
          </Button>
        );
      })}
    </View>
  );
};
