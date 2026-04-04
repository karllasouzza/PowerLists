import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { TopBar } from '@/components/top-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import { ItemVariationRow } from './components';
import { useItemVariationsPageLogics } from './hooks/use-item-variations-page-logics';
import type { DashboardItemVariation } from './types';

type VariationTab = 'decreases' | 'increases';

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

export default function ItemVariationsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<VariationTab>('decreases');
  const { period, periodLabel, increases, decreases, isLoading } = useItemVariationsPageLogics();

  const handleOpenItemComparison = useCallback(
    (item: DashboardItemVariation) => {
      router.push({
        pathname: '/item-comparison',
        params: {
          itemKey: item.key,
          itemTitle: item.title,
          period,
        },
      });
    },
    [period, router],
  );

  const selectedItems = useMemo(() => {
    return tab === 'decreases' ? decreases : increases;
  }, [decreases, increases, tab]);

  const handleBack = () => router.back();

  return (
    <View className="flex-1 bg-background">
      <TopBar title="Comparativo por item" showBack={true} onBack={handleBack} showSearch={false} />

      {isLoading ? (
        <ItemVariationsLoading />
      ) : (
        <View className="flex-1 px-4 py-4">
          <Tabs value={tab} onValueChange={(value) => setTab(value as VariationTab)}>
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

          <ScrollView className="mt-3 flex-1" contentContainerClassName="gap-2 pb-8">
            {selectedItems.length ? (
              selectedItems.map((item) => (
                <ItemVariationRow key={item.key} item={item} onPress={handleOpenItemComparison} />
              ))
            ) : (
              <View className="rounded-xl border border-dashed border-border bg-card px-3 py-4">
                <Text variant="muted" className="mt-0 text-xs">
                  {tab === 'decreases' ? 'Sem quedas no período.' : 'Sem altas no período.'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
