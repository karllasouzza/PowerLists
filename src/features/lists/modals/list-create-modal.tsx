import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
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
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { ListAccentColorPicker } from '@/features/lists/components/list-accent-color-picker';
import { ListIconPicker } from '@/features/lists/components/list-icon-picker';
import { handleAddNewList } from '@/features/lists/utils/list-operations';
import { showToast } from '@/services';
import {
  DEFAULT_ACCENT_COLOR,
  LIST_ACCENT_COLOR_TOKENS,
} from '@/features/lists/utils/accent-colors';

const listFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  icon: z.string().optional(),
  color: z.enum(LIST_ACCENT_COLOR_TOKENS).optional(),
});

type ListFormData = z.infer<typeof listFormSchema>;

type ListCreateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ListCreateModal({ open, onOpenChange }: ListCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ListFormData>({
    resolver: zodResolver(listFormSchema),
    defaultValues: { title: '', icon: 'cart', color: DEFAULT_ACCENT_COLOR },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  const closeModal = () => {
    onOpenChange(false);
    reset({ title: '', icon: 'cart', color: DEFAULT_ACCENT_COLOR });
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => titleRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const onSubmit = async (data: ListFormData) => {
    setIsSubmitting(true);
    try {
      const { success } = await handleAddNewList({
        title: data.title,
        icon: data.icon,
        color: data.color,
      });
      if (success) closeModal();
    } catch {
      showToast({
        type: 'error',
        title: 'Erro ao salvar lista',
        subtitle: 'Não foi possível criar a lista. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = () => {
    titleRef.current?.focus();
  };

  const submitForm = handleSubmit(onSubmit, onInvalid);

  return (
    <AppModal open={open} onOpenChange={onOpenChange}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Nova lista" />

        <ScrollView className="max-h-[60vh] px-6" keyboardShouldPersistTaps="handled">
          <View className="gap-6 pb-2">
            <View className="gap-2">
              <Label nativeID="title">Nome da lista</Label>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={titleRef}
                    placeholder="Minha lista..."
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="title"
                    returnKeyType="done"
                    onSubmitEditing={submitForm}
                  />
                )}
              />
              {errors.title && (
                <Text className="text-sm text-destructive">{errors.title.message}</Text>
              )}
            </View>

            <View className="gap-2">
              <Label nativeID="icon">Ícone</Label>
              <ListIconPicker value={selectedIcon} onChange={(icon) => setValue('icon', icon)} />
            </View>

            <View className="gap-2">
              <Label nativeID="color">Cor da lista</Label>
              <ListAccentColorPicker
                value={selectedColor}
                onChange={(color) => setValue('color', color)}
              />
            </View>
          </View>
        </ScrollView>

        <AppModalFooter
          onCancel={closeModal}
          onConfirm={submitForm}
          confirmLabel="Criar Lista"
          isLoading={isSubmitting}
        />
      </AppModalContent>
    </AppModal>
  );
}
