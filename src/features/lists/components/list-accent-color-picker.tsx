import React from 'react';
import { ScrollView } from 'react-native';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
    <ScrollView
      horizontal
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 4 }}>
      <RadioGroup
        value={selectedColor}
        onValueChange={(nextValue) => onChange(getAccentColorToken(nextValue))}
        className="flex-row gap-3"
        aria-labelledby="color">
        {LIST_ACCENT_COLOR_OPTIONS.map((option) => {
          const isSelected = selectedColor === option.value;

          return (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              hideIndicator
              className={cn(
                'size-8 rounded-full border-2',
                option.swatchClassName,
                isSelected ? 'border-foreground' : 'border-border/50',
              )}
              accessibilityLabel={`Cor ${option.label}`}
            />
          );
        })}
      </RadioGroup>
    </ScrollView>
  );
}
