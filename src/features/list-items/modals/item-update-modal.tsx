import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Decimal } from 'decimal.js';

import { showToast } from '@/services';
import { updateListItem } from '@/data/states/list-items';
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
import { ListItem } from '../types';
import { numberToBRLInput, parseBRLToNumber, formatBRL } from '../utils';

const itemFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  price: z.string().optional(),
  amount: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemFormSchema>;

const parseAmount = (val: string): number => {
  try {
    const d = new Decimal(val.replace(',', '.') || '1').toDecimalPlaces(0);
    return d.lessThan(1) ? 1 : d.toNumber();
  } catch {
    return 1;
  }
};

type ItemUpdateModalProps = {
  open: boolean;
  currentItem: ListItem | null;
  onOpenChange: (open: boolean) => void;
  accentBgClassName: string;
  accentForegroundClassName: string;
};

export function ItemUpdateModal({
  open,
  currentItem,
  onOpenChange,
  accentBgClassName,
  accentForegroundClassName,
}: ItemUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<TextInput>(null);
  const priceRef = useRef<TextInput>(null);
  const amountRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      title: '',
      price: '',
      amount: '1',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: currentItem?.title || '',
        price: currentItem?.price != null ? numberToBRLInput(currentItem.price) : '',
        amount: currentItem?.amount != null ? String(currentItem.amount) : '1',
      });
      const focusRef = currentItem?.price === 0 ? priceRef : titleRef;
      const timer = setTimeout(() => focusRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [open, currentItem?.title, currentItem?.price, currentItem?.amount, reset]);

  const onSubmit = async (data: ItemFormData) => {
    if (!currentItem) return;

    setIsSubmitting(true);
    try {
      const success = await updateListItem({
        id: currentItem.id,
        title: data.title,
        price: parseBRLToNumber(data.price || ''),
        amount: parseAmount(data.amount || '1'),
        isChecked: currentItem.isChecked ?? false,
      });
      if (success) onOpenChange(false);
    } catch {
      showToast({
        type: 'error',
        title: 'Erro ao salvar item',
        subtitle: 'Não foi possível atualizar o item. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitForm = handleSubmit(onSubmit);

  return (
    <AppModal open={open} onOpenChange={onOpenChange}>
      <AppModalContent>
        <AppModalHandle />
        <AppModalHeader title="Editar item" />

        <View className="gap-6 px-6 pb-2">
          <View className="gap-2">
            <Label nativeID="title">Nome do item</Label>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  ref={titleRef}
                  placeholder="Meu item..."
                  value={value}
                  onChangeText={onChange}
                  aria-labelledby="title"
                  returnKeyType="next"
                  onSubmitEditing={() => amountRef.current?.focus()}
                  submitBehavior="newline"
                />
              )}
            />
            {errors.title && (
              <Text className="text-sm text-destructive">{errors.title.message}</Text>
            )}
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Label nativeID="amount">Quantidade</Label>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={amountRef}
                    placeholder="1"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    aria-labelledby="amount"
                    returnKeyType="next"
                    onSubmitEditing={() => priceRef.current?.focus()}
                    submitBehavior="newline"
                  />
                )}
              />
            </View>
            <View className="flex-1 gap-2">
              <Label nativeID="price">Preço</Label>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={priceRef}
                    placeholder="R$ 0,00"
                    value={value}
                    onChangeText={(text) => onChange(formatBRL(text))}
                    keyboardType="numeric"
                    aria-labelledby="price"
                    returnKeyType="done"
                    onSubmitEditing={submitForm}
                    submitBehavior="blurAndSubmit"
                  />
                )}
              />
            </View>
          </View>
        </View>

        <AppModalFooter
          onCancel={() => onOpenChange(false)}
          onConfirm={submitForm}
          confirmLabel="Editar Item"
          confirmButtonClassName={accentBgClassName}
          confirmLabelClassName={accentForegroundClassName}
          isLoading={isSubmitting}
          isConfirmDisabled={!currentItem?.title || !!errors.title}
        />
      </AppModalContent>
    </AppModal>
  );
}
