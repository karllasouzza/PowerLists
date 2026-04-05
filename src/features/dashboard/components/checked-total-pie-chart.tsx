import { useMemo } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Poppins_500Medium } from '@expo-google-fonts/poppins';
import { useFont } from '@shopify/react-native-skia';
import { Bar, CartesianChart } from 'victory-native';

import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/features/list-items/utils/formatters';

import type { DashboardPieSlice } from '../types';

type CheckedTotalPieChartProps = {
  slices: DashboardPieSlice[];
  totalCheckedPrice: number;
  periodLabel: string;
};

type ChartBar = {
  key: string;
  position: number;
  createdAtLabel: string;
  total: number;
  color: string;
};

export function CheckedTotalPieChart({
  slices,
  totalCheckedPrice,
  periodLabel,
}: CheckedTotalPieChartProps) {
  const { width } = useWindowDimensions();
  const axisFont = useFont(Poppins_500Medium, 11);

  const formatCreatedAt = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  const chartData = useMemo<ChartBar[]>(() => {
    return slices
      .filter((slice) => slice.y > 0)
      .map((slice, index) => ({
        key: slice.listId,
        position: index + 1,
        createdAtLabel: formatCreatedAt(slice.createdAt),
        total: Number(slice.y.toFixed(2)),
        color: slice.color,
      }));
  }, [slices]);

  const xTickValues = useMemo(() => {
    return chartData.map((item) => item.position);
  }, [chartData]);

  const labelByPosition = useMemo(() => {
    return new Map(chartData.map((item) => [item.position, item.createdAtLabel]));
  }, [chartData]);

  const barWidth = 50;

  const chartWidth = useMemo(() => {
    const minVisibleWidth = Math.max(width - 80, 260);
    const widthByBars = Math.max(chartData.length * (barWidth + 26), 260);
    return Math.max(minVisibleWidth, widthByBars);
  }, [chartData.length, width]);

  return (
    <View className="rounded-b-2xl p-4">
      <Text className="text-base font-semibold text-foreground">Total pago em compras</Text>
      <Text variant="muted" className="mt-1 text-xs">
        Distribuição dos valores por lista
      </Text>

      {chartData.length ? (
        <View className="mt-4 w-full">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
            <View style={{ width: chartWidth, height: 300 }}>
              <CartesianChart
                data={chartData}
                xKey="position"
                yKeys={['total']}
                domainPadding={{ left: 36, right: 36, top: 18, bottom: 18 }}
                xAxis={{
                  tickValues: xTickValues,
                  tickCount: xTickValues.length,
                  font: axisFont,
                  labelOffset: 5,
                  labelColor: '#6E6E6E',
                  lineColor: '#D6D6D6',
                  formatXLabel: (value) => {
                    const numeric = Number(value);
                    if (Number.isNaN(numeric)) return '';

                    return (
                      labelByPosition.get(numeric) ?? labelByPosition.get(Math.round(numeric)) ?? ''
                    );
                  },
                }}
                yAxis={[
                  {
                    tickCount: 5,
                    font: axisFont,
                    labelColor: '#6E6E6E',
                    lineColor: '#d6d6d6a2',
                    formatYLabel: (value) => `R$ ${Number(value).toFixed(0)}`,
                  },
                ]}>
                {({ points, chartBounds }) => (
                  <>
                    {chartData.map((bar, index) => {
                      const point = points.total[index];
                      if (!point) return null;

                      return (
                        <Bar
                          key={bar.key}
                          points={[point]}
                          chartBounds={chartBounds}
                          color={bar.color}
                          barWidth={barWidth}
                          roundedCorners={{ topLeft: 26, topRight: 26 }}
                        />
                      );
                    })}
                  </>
                )}
              </CartesianChart>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View className="mt-4 rounded-2xl border border-dashed border-border px-4 py-6">
          <Text className="text-sm text-muted-foreground">Sem dados suficientes...</Text>
        </View>
      )}

      <View className="mt-4 items-center px-8">
        <Text variant="muted" className="text-center text-xs">
          Total pago
        </Text>
        <Text className="mt-1 text-center text-2xl font-bold text-foreground">
          {formatCurrency(totalCheckedPrice)}
        </Text>
        <Text variant="muted" className="mt-1 text-center text-xs">
          {periodLabel}
        </Text>
      </View>
    </View>
  );
}
