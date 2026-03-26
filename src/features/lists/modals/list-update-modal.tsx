import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useValue } from '@legendapp/state/react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { handleEditList } from '@/features/lists/utils/list-operations';
import { iconMap } from '@/features/lists/utils/icon-map';
import { lists$ } from '@/data/states/lists';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { List } from '@/data/types';
import { cn } from '@/lib/utils';

const listFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  icon: z.string().optional(),
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
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: currentList?.title || '',
        icon: currentList?.icon || 'cart',
      });
    }
  }, [open, currentList?.title, currentList?.icon, reset]);

  const selectedIcon = watch('icon');

  const onSubmit = async (data: ListFormData) => {
    if (!listId) return;

    setIsSubmitting(true);
    try {
      const { success } = await handleEditList(listId, { title: data.title, icon: data.icon });
      if (success) onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94%] p-0">
        <DialogHeader className="px-4 pb-2 pt-4">
          <DialogTitle>Editar lista</DialogTitle>
        </DialogHeader>

        <ScrollView className="max-h-[70vh] px-4" keyboardShouldPersistTaps="handled">
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
        </ScrollView>

        <DialogFooter className="px-4 pb-4 pt-2">
          <Button variant="outline" onPress={() => onOpenChange(false)} disabled={isSubmitting}>
            <Text>Cancelar</Text>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting || !listId}>
            <Text>Salvar</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
