import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useValue } from '@legendapp/state/react';

import {
  AppModal,
  AppModalContent,
  AppModalHandle,
  AppModalHeader,
  AppModalFooter,
} from '@/components/molecules/app-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { ListAccentColorPicker } from '@/features/lists/components/list-accent-color-picker';
import { handleEditList } from '@/features/lists/utils/list-operations';
import {
  DEFAULT_ACCENT_COLOR,
  LIST_ACCENT_COLOR_TOKENS,
  getAccentColorToken,
} from '@/features/lists/utils/accent-colors';
import { iconMap } from '@/features/lists/utils/icon-map';
import { lists$ } from '@/data/states/lists';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { List } from '@/data/types';
import { cn } from '@/lib/utils';

const listFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  icon: z.string().optional(),
  color: z.enum(LIST_ACCENT_COLOR_TOKENS).optional(),
});

type ListFormData = z.infer<typeof listFormSchema>;

const AVAILABLE_ICONS = Object.keys(iconMap);

type ListUpdateModalProps = {
  open: boolean;
  listId?: string;
  onOpenChange: (open: boolean) => void;
};

export function ListUpdateModal({ open, listId, onOpenChange }: ListUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listsRaw = useValue(lists$);
  const lists = convertFromSupabaseFormat(Object.values(listsRaw || {})) as List[];
  const currentList = lists.find((list) => list.id === listId);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ListFormData>({
    resolver: zodResolver(listFormSchema),
    defaultValues: {
      title: '',
      icon: 'cart',
      color: DEFAULT_ACCENT_COLOR,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: currentList?.title || '',
        icon: currentList?.icon || 'cart',
        color: getAccentColorToken(currentList?.accentColor),
      });
    }
  }, [open, currentList?.title, currentList?.icon, currentList?.accentColor, reset]);

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  const onSubmit = useCallback(
    async (data: ListFormData) => {
      if (!listId) return;

      setIsSubmitting(true);
      try {
        const { success } = await handleEditList(listId, {
          title: data.title,
          icon: data.icon,
          color: data.color,
        });
        if (success) onOpenChange(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [listId, onOpenChange],
  );

  return (
    <AppModal open={open} onOpenChange={onOpenChange}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Editar lista" />

        <ScrollView className="max-h-[60vh] px-6" keyboardShouldPersistTaps="handled">
          <View className="mb-4 gap-2">
            <Label nativeID="title">Nome da lista</Label>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Minha lista..."
                  value={value}
                  onChangeText={onChange}
                  aria-labelledby="title"
                />
              )}
            />
            {errors.title && (
              <Text className="text-sm text-destructive">{errors.title.message}</Text>
            )}
          </View>

          <View className="mb-2 gap-2">
            <Label>Icone</Label>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-4 p-1">
                {AVAILABLE_ICONS.map((iconName) => {
                  const IconComponent = iconMap[iconName];
                  const isSelected = selectedIcon === iconName;
                  return (
                    <Button
                      variant="outline"
                      size="icon"
                      key={iconName}
                      onPress={() => setValue('icon', iconName)}
                      className={cn(
                        'items-center justify-center rounded-full border',
                        isSelected ? 'border-primary bg-primary' : 'border-border bg-transparent',
                      )}>
                      <Icon
                        as={IconComponent}
                        size={20}
                        className={isSelected ? 'text-primary-foreground' : 'text-foreground'}
                      />
                    </Button>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View className="mb-2 gap-2">
            <Label>Cor da lista</Label>
            <ListAccentColorPicker
              value={selectedColor}
              onChange={(color) => setValue('color', color)}
            />
          </View>
        </ScrollView>

        <AppModalFooter
          onCancel={() => onOpenChange(false)}
          onConfirm={handleSubmit(onSubmit)}
          confirmLabel="Salvar"
          isLoading={isSubmitting}
          isConfirmDisabled={!listId}
        />
      </AppModalContent>
    </AppModal>
  );
}
