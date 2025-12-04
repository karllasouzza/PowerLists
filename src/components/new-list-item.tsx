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
import { useTheme } from '@/context/themes/use-themes';
import { themes } from '@/context/themes/theme-config';
import {
  IconShoppingCart,
  IconCreditCard,
  IconMoodKid,
  IconBriefcase,
  IconAmbulance,
  IconBook,
  IconChefHat,
} from '@tabler/icons-react-native';
import { createNewListItem, updateListItem } from '@/data/actions/list-items.actions';

// Schema de validação para Items
const itemFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  price: z.string().optional(),
  amount: z.string().optional(),
});

// Schema de validação para Lists
const listFormSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  color: z.string().optional(),
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

interface NewListItemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  type: 'Lists' | 'Items';
  listId?: string;
  editingItem?: any;
  onSuccess?: () => void;
  colors?: string[];
  icons?: string[];
}

export default function NewListItem({
  open,
  onOpenChange,
  mode,
  type,
  listId,
  editingItem,
  onSuccess,
  colors,
  icons,
}: NewListItemProps) {
  const { theme, colorScheme } = useTheme();
  // @ts-ignore
  const currentTheme = themes[theme][colorScheme];
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
            color: 'primary',
            icon: 'cart',
          },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  // Reset form when opening or editingItem changes
  useEffect(() => {
    if (open) {
      if (editingItem) {
        reset({
          title: editingItem.title || '',
          price: editingItem.price ? String(editingItem.price) : '',
          amount: editingItem.amount ? String(editingItem.amount) : '1',
          color: editingItem.accentColor || 'primary',
          icon: editingItem.icon || 'cart',
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
                color: 'primary',
                icon: 'cart',
              }
        );
      }
    }
  }, [open, editingItem, reset, type]);

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
      } else if (mode === 'edit' && editingItem) {
        const success = await updateListItem({
          id: editingItem.id,
          title: itemData.title,
          price: parsePrice(itemData.price || '0'),
          amount: parseAmount(itemData.amount || '1'),
          isChecked: editingItem.isChecked || false,
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

          {/* Colors (Lists only) */}
          {type === 'Lists' && colors && (
            <View className="gap-2">
              <Label>Cor</Label>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 p-1">
                  {colors.map((color) => {
                    const colorVar = `--color-${color}`;
                    const bgStyle = currentTheme[colorVar] || color;

                    return (
                      <Pressable
                        key={color}
                        onPress={() => setValue('color', color)}
                        className={`h-10 w-10 rounded-full border-2 ${
                          selectedColor === color ? 'border-foreground' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: bgStyle }}
                      />
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Icons (Lists only) */}
          {type === 'Lists' && icons && (
            <View className="gap-2">
              <Label>Ícone</Label>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 p-1">
                  {icons.map((iconName) => {
                    const IconComponent = iconMap[iconName] || IconShoppingCart;
                    const isSelected = selectedIcon === iconName;

                    return (
                      <Pressable
                        key={iconName}
                        onPress={() => setValue('icon', iconName)}
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                          isSelected ? 'bg-primary/20' : 'bg-transparent'
                        }`}>
                        <Icon as={IconComponent} size={24} className="text-foreground" />
                      </Pressable>
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
