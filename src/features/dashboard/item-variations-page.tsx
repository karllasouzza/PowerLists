import React, { Suspense } from 'react';
import { ScrollView, View } from 'react-native';

import { TopBar } from '@/components/top-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import { useItemVariationsPageLogics } from './hooks/use-item-variations-page-logics';

const AsyncItemVariationRow = React.lazy(async () => {
  const module = await import('./components/item-variation-row');
  return { default: module.ItemVariationRow };
});

function ItemVariationsLoading() {
  return (
    <View className="gap-3 p-4">
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </View>
  );
}

function ItemVariationsRowsLoading() {
  return (
    <View className="mt-3 gap-2">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </View>
  );
}

export default function ItemVariationsPage() {
  const {
    tab,
    periodLabel,
    selectedItems,
    isLoading,
    handleTabChange,
    handleOpenItemComparison,
    handleBack,
  } = useItemVariationsPageLogics();

  return (
    <View className="flex-1 bg-background">
      <TopBar title="Comparativo por item" showBack={true} onBack={handleBack} showSearch={false} />

      {isLoading ? (
        <ItemVariationsLoading />
      ) : (
        <View className="flex-1 px-4 py-4">
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="h-11 w-full rounded-xl bg-muted/70">
              <TabsTrigger value="decreases" className="flex-1 rounded-lg">
                <Text className="text-sm font-semibold">Quedas</Text>
              </TabsTrigger>
              <TabsTrigger value="increases" className="flex-1 rounded-lg">
                <Text className="text-sm font-semibold">Altas</Text>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Text variant="muted" className="mt-2 text-xs">
            {periodLabel}
          </Text>

          <Suspense fallback={<ItemVariationsRowsLoading />}>
            <ScrollView className="mt-3 flex-1" contentContainerClassName="gap-2 pb-8">
              {selectedItems.length ? (
                selectedItems.map((item) => (
                  <AsyncItemVariationRow
                    key={item.key}
                    item={item}
                    onPress={handleOpenItemComparison}
                  />
                ))
              ) : (
                <View className="rounded-xl border border-dashed border-border bg-card px-3 py-4">
                  <Text variant="muted" className="mt-0 text-xs">
                    {tab === 'decreases' ? 'Sem quedas no período.' : 'Sem altas no período.'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Suspense>
        </View>
      )}
    </View>
  );
}
