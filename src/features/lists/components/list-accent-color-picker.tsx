import React from 'react';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getAccentColorToken,
  LIST_ACCENT_COLOR_OPTIONS,
  type AccentColorToken,
} from '@/features/lists/utils/accent-colors';

type ListAccentColorPickerProps = {
  value?: string;
  onChange: (value: AccentColorToken) => void;
};

export function ListAccentColorPicker({ value, onChange }: ListAccentColorPickerProps) {
  const selectedColor = getAccentColorToken(value);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-3 p-1">
        {LIST_ACCENT_COLOR_OPTIONS.map((option) => {
          const isSelected = selectedColor === option.value;

          return (
            <Button
              key={option.value}
              variant="outline"
              size="icon"
              onPress={() => onChange(option.value)}
              className={cn(
                'items-center justify-center rounded-full border-2',
                isSelected ? 'border-foreground bg-background' : 'border-border bg-background',
              )}>
              <View
                className={cn(
                  'size-7 rounded-full border border-border/50',
                  option.swatchClassName,
                )}
              />
            </Button>
          );
        })}
      </View>
    </ScrollView>
  );
}
