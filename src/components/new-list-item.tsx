import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  IconShoppingCart,
  IconCreditCard,
  IconMoodKid,
  IconBriefcase,
  IconAmbulance,
  IconBook,
  IconChefHat,
} from '@tabler/icons-react-native';
import { createNewListItem, updateListItem } from '@/data/states/list-items';
import { cn } from '@/lib/utils';

// Schema de validação para Items
const itemFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  price: z.string().optional(),
  amount: z.string().optional(),
});

// Schema de validação para Lists
const listFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  icon: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemFormSchema>;
type ListFormData = z.infer<typeof listFormSchema>;

// Mapeamento de nomes de ícones para componentes Tabler
export const iconMap: Record<string, any> = {
  cart: IconShoppingCart,
  'credit-card-chip': IconCreditCard,
  'baby-carriage': IconMoodKid,
  'bag-suitcase': IconBriefcase,
  ambulance: IconAmbulance,
  book: IconBook,
  'chef-hat': IconChefHat,
};

const AVAILABLE_ICONS = Object.keys(iconMap);

interface NewListItemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  type: 'Lists' | 'Items';
  listId?: string;
  currentItem?: any;
  onSuccess?: () => void;
}

export default function NewListItem({
  open,
  onOpenChange,
  mode,
  type,
  listId,
  currentItem,
  onSuccess,
}: NewListItemProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = type === 'Items' ? itemFormSchema : listFormSchema;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === 'Items'
        ? {
            title: '',
            price: '',
            amount: '1',
          }
        : {
            title: '',
            icon: 'cart',
          },
  });

  const selectedIcon = watch('icon');

  // Reset form when opening or currentItem changes
  useEffect(() => {
    if (open) {
      if (currentItem) {
        reset({
          title: currentItem.title || '',
          price: currentItem.price ? String(currentItem.price) : '',
          amount: currentItem.amount ? String(currentItem.amount) : '1',
          icon: currentItem.icon || 'cart',
        });
      } else {
        reset(
          type === 'Items'
            ? {
                title: '',
                price: '',
                amount: '1',
              }
            : {
                title: '',
                icon: 'cart',
              },
        );
      }
    }
  }, [open, currentItem, reset, type]);

  /**
   * Converte string de preço para número
   */
  const parsePrice = (priceStr: string): number => {
    const parsed = parseFloat(priceStr);
    return isNaN(parsed) ? 0 : parsed;
  };

  /**
   * Converte string de quantidade para número
   */
  const parseAmount = (amountStr: string): number => {
    const parsed = parseInt(amountStr, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  };

  const onFormSubmit = async (data: ItemFormData | ListFormData) => {
    if (type !== 'Items' || !listId) {
      // TODO: Implementar lógica para Lists
      console.warn('List creation/editing not implemented yet');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemData = data as ItemFormData;

      if (mode === 'add') {
        const success = await createNewListItem({
          title: itemData.title,
          price: parsePrice(itemData.price || '0'),
          amount: parseAmount(itemData.amount || '1'),
          listId,
          profileId: '', // Será preenchido pela action
          isChecked: false,
        });

        if (success) {
          onSuccess?.();
          onOpenChange(false);
        }
      } else if (mode === 'edit' && currentItem) {
        const success = await updateListItem({
          id: currentItem.id,
          title: itemData.title,
          price: parsePrice(itemData.price || '0'),
          amount: parseAmount(itemData.amount || '1'),
          isChecked: currentItem.isChecked || false,
        });

        if (success) {
          onSuccess?.();
          onOpenChange(false);
        }
      }
    } catch (error) {
      console.error('[NewListItem] Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? `Nova ${type === 'Lists' ? 'lista' : 'item'}`
              : `Editar ${type === 'Lists' ? 'lista' : 'item'}`}
          </DialogTitle>
        </DialogHeader>

        <View className="gap-4 py-4">
          {/* Title Input */}
          <View className="gap-2">
            <Label nativeID="title">{type === 'Lists' ? 'Nome da lista' : 'Nome do item'}</Label>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={type === 'Lists' ? 'Minha lista...' : 'Meu item...'}
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

          {/* Price & Amount (Items only) */}
          {type === 'Items' && (
            <View className="flex-row gap-4">
              <View className="flex-1 gap-2">
                <Label nativeID="price">Preço</Label>
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
          )}

          {/* Icons (Lists only) */}
          {type === 'Lists' && (
            <View className="gap-2">
              <Label>Ícone</Label>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 p-1">
                  {AVAILABLE_ICONS.map((iconName) => {
                    const IconComponent = iconMap[iconName] || IconShoppingCart;
                    const isSelected = selectedIcon === iconName;

                    return (
                      <Button
                        variant="outline"
                        size="icon"
                        key={iconName}
                        onPress={() => setValue('icon', iconName)}
                        className={cn(
                          'items-center justify-center rounded-full border',
                          isSelected ? 'bg-primary border-primary' : 'bg-transparent border-border',
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
          )}
        </View>

        <DialogFooter>
          <Button onPress={handleSubmit(onFormSubmit)} disabled={isSubmitting}>
            <Text>{mode === 'add' ? 'Criar' : 'Salvar'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
