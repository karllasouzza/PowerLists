import React from 'react';
import { ScrollView } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { iconMap } from '@/features/lists/utils/icon-map';

const AVAILABLE_ICONS = Object.keys(iconMap);

type ListIconPickerProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function ListIconPicker({ value, onChange }: ListIconPickerProps) {
  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-1">
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex-row gap-3"
        aria-labelledby="icon">
        {AVAILABLE_ICONS.map((iconName) => {
          const IconComponent = iconMap[iconName];
          const isSelected = value === iconName;

          return (
            <RadioGroupItem
              key={iconName}
              value={iconName}
              hideIndicator
              className={cn(
                'h-10 w-10 items-center justify-center rounded-full border',
                isSelected
                  ? 'border-primary bg-primary'
                  : 'border-border dark:bg-input/30 bg-transparent',
              )}
              accessibilityLabel={`Icone ${iconName}`}>
              <Icon
                as={IconComponent}
                size={20}
                className={isSelected ? 'text-primary-foreground' : 'text-foreground'}
              />
            </RadioGroupItem>
          );
        })}
      </RadioGroup>
    </ScrollView>
  );
}
