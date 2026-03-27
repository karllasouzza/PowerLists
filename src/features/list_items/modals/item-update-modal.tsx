import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Decimal } from 'decimal.js';
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
import { updateListItem, listItems$ } from '@/data/states/list-items';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import type { ListItem } from '@/features/list_items/types';

const itemFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  price: z.string().optional(),
  amount: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemFormSchema>;

const parsePrice = (val: string): number => {
  try {
    const d = new Decimal(val.replace(',', '.') || '0');
    return d.isNaN() || d.isNegative() ? 0 : d.toDecimalPlaces(2).toNumber();
  } catch {
    return 0;
  }
};

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
  itemId?: string;
  onOpenChange: (open: boolean) => void;
};

export function ItemUpdateModal({ open, itemId, onOpenChange }: ItemUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listItemsRaw = useValue(listItems$);
  const allItems = convertFromSupabaseFormat(Object.values(listItemsRaw || {})) as ListItem[];
  const currentItem = allItems.find((item) => item.id === itemId);

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
        price: currentItem?.price != null ? String(currentItem.price) : '',
        amount: currentItem?.amount != null ? String(currentItem.amount) : '1',
      });
    }
  }, [open, currentItem?.title, currentItem?.price, currentItem?.amount, reset]);

  const onSubmit = async (data: ItemFormData) => {
    if (!itemId || !currentItem) return;

    setIsSubmitting(true);
    try {
      const success = await updateListItem({
        id: itemId,
        title: data.title,
        price: parsePrice(data.price || '0'),
        amount: parseAmount(data.amount || '1'),
        isChecked: currentItem.isChecked ?? false,
      });
      if (success) onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94%] p-0">
        <DialogHeader className="px-4 pb-2 pt-4">
          <DialogTitle>Editar item</DialogTitle>
        </DialogHeader>

        <View className="gap-4 px-4 pt-4">
          <View className="gap-2">
            <Label nativeID="title">Nome do item</Label>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Meu item..."
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

          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <Label nativeID="price">Preco</Label>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="0.00"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    aria-labelledby="price"
                  />
                )}
              />
            </View>
            <View className="flex-1 gap-2">
              <Label nativeID="amount">Qtd</Label>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="1"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    aria-labelledby="amount"
                  />
                )}
              />
            </View>
          </View>
        </View>

        <DialogFooter className="px-4 pb-4 pt-4">
          <Button variant="outline" onPress={() => onOpenChange(false)} disabled={isSubmitting}>
            <Text>Cancelar</Text>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting || !itemId}>
            <Text>Salvar</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
