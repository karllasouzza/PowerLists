import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from '@legendapp/state/react';

import { TopBar } from '@/components/top-bar';
import { Skeleton } from '@/components/ui/skeleton';

import {
  CheckedTotalPieChart,
  ItemVariationSection,
  PeriodFilter,
  RecentListsSection,
} from './components';
import { useDashboardPageLogics } from './hooks/use-dashboard-page-logics';
import type { DashboardItemVariation } from './types';

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

  const handleOpenItemVariations = useCallback(
    (item: DashboardItemVariation) => {
      router.push({
        pathname: '/item-variations',
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
        <ScrollView className="flex-1" contentContainerClassName="gap-5 py-4 pb-8">
          <PeriodFilter period={period} onChange={setPeriod} />

          <CheckedTotalPieChart
            slices={pieSlices}
            totalCheckedPrice={totalCheckedPrice}
            periodLabel={periodLabel}
          />

          <RecentListsSection
            cards={recentLists}
            onViewAll={handleViewAllLists}
            onPressCard={handleOpenList}
          />

          <ItemVariationSection
            increases={increases}
            decreases={decreases}
            onViewAll={handleViewAllItemVariations}
            onPressItem={handleOpenItemVariations}
          />
        </ScrollView>
      )}
    </View>
  );
}

export default observer(DashboardPage);
