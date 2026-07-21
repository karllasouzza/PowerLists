import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  IconPlus,
  IconMicrophone,
  IconChartBar,
  IconShoppingCart,
} from '@tabler/icons-react-native';

interface EmptyListsStateProps {
  onCreateList: () => void;
}

export function EmptyListsState({ onCreateList }: EmptyListsStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <Icon as={IconShoppingCart} size={48} className="text-primary" />
      </View>

      <Text className="text-2xl font-bold text-foreground">
        Comece a economizar
      </Text>

      <Text variant="muted" className="mt-2 text-center text-base">
        Crie listas de compras, acompanhe gastos{'\n'}e compare preços para pagar menos.
      </Text>

      <View className="mt-8 w-full gap-4">
        <View className="flex-row items-center gap-3 rounded-xl bg-card p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-violet-100">
            <Icon as={IconMicrophone} size={20} className="text-violet-600" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground">Adicione itens por voz</Text>
            <Text variant="small" className="text-muted-foreground">
              Use o assistente para adicionar rápido
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3 rounded-xl bg-card p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Icon as={IconChartBar} size={20} className="text-blue-600" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground">Compare preços</Text>
            <Text variant="small" className="text-muted-foreground">
              Veja altas e quedas de preço
            </Text>
          </View>
        </View>
      </View>

      <Button
        variant="default"
        className="mt-8 h-14 w-full"
        onPress={onCreateList}>
        <Icon as={IconPlus} size={20} className="text-primary-foreground" />
        <Text className="text-base font-bold text-primary-foreground">
          Criar primeira lista
        </Text>
      </Button>
    </View>
  );
}
