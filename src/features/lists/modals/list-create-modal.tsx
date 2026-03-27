import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { handleAddNewList } from '@/features/lists/utils/list-operations';
import { iconMap } from '@/features/lists/utils/icon-map';
import { cn } from '@/lib/utils';

const listFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  icon: z.string().optional(),
});

type ListFormData = z.infer<typeof listFormSchema>;

const AVAILABLE_ICONS = Object.keys(iconMap);

type ListCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ListCreateModal({ open, onOpenChange }: ListCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ListFormData>({
    resolver: zodResolver(listFormSchema),
    defaultValues: { title: '', icon: 'cart' },
  });

  const selectedIcon = watch('icon');

  const closeModal = () => {
    onOpenChange(false);
    reset({ title: '', icon: 'cart' });
  };

  const onSubmit = async (data: ListFormData) => {
    setIsSubmitting(true);
    try {
      const { success } = await handleAddNewList({ title: data.title, icon: data.icon });
      if (success) closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppModal open={open} onOpenChange={onOpenChange}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Nova lista" />

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
        </ScrollView>

        <AppModalFooter
          onCancel={closeModal}
          onConfirm={handleSubmit(onSubmit)}
          confirmLabel="Salvar"
          isLoading={isSubmitting}
        />
      </AppModalContent>
    </AppModal>
  );
}
