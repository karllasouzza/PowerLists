import React, { Suspense, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from '@legendapp/state/react';

import { TopBar } from '@/components/top-bar';
import { Skeleton } from '@/components/ui/skeleton';

import { useDashboardPageLogics } from './hooks/use-dashboard-page-logics';
import type { DashboardItemVariation } from './types';

const AsyncPeriodFilter = React.lazy(async () => {
  const module = await import('./components/period-filter');
  return { default: module.PeriodFilter };
});

const AsyncCheckedTotalPieChart = React.lazy(async () => {
  const module = await import('./components/checked-total-pie-chart');
  return { default: module.CheckedTotalPieChart };
});

const AsyncRecentListsSection = React.lazy(async () => {
  const module = await import('./components/recent-lists-section');
  return { default: module.RecentListsSection };
});

const AsyncItemVariationSection = React.lazy(async () => {
  const module = await import('./components/item-variation-section');
  return { default: module.ItemVariationSection };
});

const DashboardLoading = () => {
  return (
    <View className="gap-4 px-4 py-4">
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-3xl" />
      <View className="flex-row gap-3">
        <Skeleton className="h-36 flex-1 rounded-2xl" />
        <Skeleton className="h-36 flex-1 rounded-2xl" />
      </View>
      <View className="flex-row gap-3">
        <Skeleton className="h-44 flex-1 rounded-2xl" />
        <Skeleton className="h-44 flex-1 rounded-2xl" />
      </View>
    </View>
  );
};

function DashboardPage() {
  const router = useRouter();
  const {
    period,
    setPeriod,
    periodLabel,
    isLoading,
    totalCheckedPrice,
    pieSlices,
    recentLists,
    increases,
    decreases,
  } = useDashboardPageLogics();

  const handleViewAllLists = useCallback(() => {
    router.push('/lists');
  }, [router]);

  const handleOpenList = useCallback(
    (listId: string) => {
      router.push({
        pathname: '/list',
        params: { id: listId },
      });
    },
    [router],
  );

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

  const handleViewAllItemVariations = useCallback(() => {
    router.push({
      pathname: '/item-variations',
      params: { period },
    });
  }, [period, router]);

  return (
    <View className="flex-1 bg-background">
      <TopBar title="Dashboard" showSearch={false} />

      {isLoading ? (
        <DashboardLoading />
      ) : (
        <Suspense fallback={<DashboardLoading />}>
          <ScrollView className="flex-1" contentContainerClassName="gap-5 py-4 pb-8">
            <AsyncPeriodFilter period={period} onChange={setPeriod} />

            <AsyncCheckedTotalPieChart
              slices={pieSlices}
              totalCheckedPrice={totalCheckedPrice}
              periodLabel={periodLabel}
            />

            <AsyncRecentListsSection
              cards={recentLists}
              onViewAll={handleViewAllLists}
              onPressCard={handleOpenList}
            />

            <AsyncItemVariationSection
              increases={increases}
              decreases={decreases}
              onViewAll={handleViewAllItemVariations}
              onPressItem={handleOpenItemComparison}
            />
          </ScrollView>
        </Suspense>
      )}
    </View>
  );
}

export default observer(DashboardPage);
