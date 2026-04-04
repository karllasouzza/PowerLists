import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { TopBar } from '@/components/top-bar';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/features/list-items/utils/formatters';

import { DailyPriceBarChart, MetricCard } from './components';
import { useItemPriceComparisonLogics } from './hooks/use-item-price-comparison-logics';

export default function ItemPriceComparisonPage() {
  const router = useRouter();
  const { variation, averageDailyVariation, hasData, periodLabel } = useItemPriceComparisonLogics();

  const totalDeltaValue = useMemo(() => {
    if (!variation) return '0.0%';
    const prefix = variation.changePercent > 0 ? '+' : '';
    return `${prefix}${variation.changePercent.toFixed(1)}%`;
  }, [variation]);

  const averageDailyDeltaValue = useMemo(() => {
    const prefix = averageDailyVariation > 0 ? '+' : '';
    return `${prefix}${averageDailyVariation.toFixed(1)}%`;
  }, [averageDailyVariation]);

  const totalDeltaTitle =
    variation?.changePercent !== undefined && variation.changePercent >= 0
      ? 'Incremento no período'
      : 'Decremento no período';

  return (
    <View className="flex-1 bg-background">
      <TopBar
        title={variation?.title ? `Comparativo: ${variation.title}` : 'Comparativo de item'}
        showBack={true}
        onBack={() => router.back()}
        showSearch={false}
      />

      {!hasData || !variation ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base font-semibold text-foreground">
            Não encontramos dados suficientes para este item.
          </Text>
          <Text variant="muted" className="mt-2 text-center text-sm">
            Tente outro item na lista de variação do dashboard.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4 pb-8">
          <DailyPriceBarChart series={variation.dailySeries} />

          <View className="flex-row gap-3">
            <MetricCard
              title="Quantidade total"
              value={`${variation.totalAmount}`}
              subtitle="Soma das ocorrências no período"
            />
            <MetricCard
              title="Variação média diária"
              value={averageDailyDeltaValue}
              subtitle="Média do delta entre dias"
              valueClassName={averageDailyVariation >= 0 ? 'text-destructive' : 'text-primary'}
            />
          </View>

          <MetricCard
            title={totalDeltaTitle}
            value={totalDeltaValue}
            subtitle={`${periodLabel} | Min ${formatCurrency(variation.minUnitPrice)} | Max ${formatCurrency(variation.maxUnitPrice)}`}
            valueClassName={variation.changePercent >= 0 ? 'text-destructive' : 'text-primary'}
          />
        </ScrollView>
      )}
    </View>
  );
}
