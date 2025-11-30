import React, { useEffect } from 'react';
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
import { themes } from '@/context/themes/themeConfig';
import {
  IconShoppingCart,
  IconCreditCard,
  IconMoodKid,
  IconBriefcase,
  IconAmbulance,
  IconBook,
  IconChefHat,
  IconX,
} from '@tabler/icons-react-native';

// Schema de validação
const formSchema = z.object({
  title: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  price: z.string().optional(),
  amount: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

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
  mode: 'add' | 'edit' | null;
  type: 'Lists' | 'Items';
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
  colors?: string[];
  icons?: string[];
}

export default function NewListItem({
  open,
  onOpenChange,
  mode,
  type,
  onSubmit,
  defaultValues,
  colors,
  icons,
}: NewListItemProps) {
  const { theme, colorScheme } = useTheme();
  // @ts-ignore
  const currentTheme = themes[theme][colorScheme];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      price: '',
      amount: '',
      color: 'primary',
      icon: 'cart',
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  // Reset form when opening or defaultValues change
  useEffect(() => {
    if (open) {
      reset({
        title: defaultValues?.title || '',
        price: defaultValues?.price || '',
        amount: defaultValues?.amount || '',
        color: defaultValues?.color || 'primary',
        icon: defaultValues?.icon || 'cart',
      });
    }
  }, [open, defaultValues, reset]);

  const onFormSubmit = (data: FormData) => {
    onSubmit(data);
    // onOpenChange(false); // Let parent handle closing if needed, or close here
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
                    // Resolve color value from theme config
                    // Assuming color is a key like 'primary', 'secondary'
                    // And theme config has --color-primary
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
          <Button onPress={handleSubmit(onFormSubmit)}>
            <Text>{mode === 'add' ? 'Criar' : 'Salvar'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
