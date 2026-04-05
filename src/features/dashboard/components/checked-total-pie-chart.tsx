import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/themes';
import { rawColors } from '@/context/themes/theme-config';
import { DEFAULT_ACCENT_COLOR, isAccentColorToken } from '@/features/lists/utils/accent-colors';
import { formatCurrency } from '@/utils/formatters';
import { getThemeColorHex } from '@/utils/tailwind-color';
import { Poppins_500Medium } from '@expo-google-fonts/poppins';
import { useFont } from '@shopify/react-native-skia';
import React, { memo, useMemo } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

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

const createdAtFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
});

function CheckedTotalPieChartComponent({
  slices,
  totalCheckedPrice,
  periodLabel,
}: CheckedTotalPieChartProps) {
  const { width } = useWindowDimensions();
  const axisFont = useFont(Poppins_500Medium, 11);

  const { theme: themeName, colorScheme } = useTheme();
  const themeVars = rawColors[themeName][colorScheme];

  const chartData = useMemo<ChartBar[]>(() => {
    return slices
      .filter((slice) => slice.y > 0)
      .map((slice, index) => {
        const rawColor = slice.color ?? DEFAULT_ACCENT_COLOR;
        let resolvedColor = String(rawColor);

        if (isAccentColorToken(resolvedColor)) {
          resolvedColor = getThemeColorHex({
            themeVars,
            varName: `--color-${resolvedColor}`,
            fallback: '#4C8E4A',
          });
        }

        return {
          key: slice.listId,
          position: index + 1,
          createdAtLabel: createdAtFormatter.format(slice.createdAt),
          total: Number(slice.y.toFixed(2)),
          color: resolvedColor,
        };
      });
  }, [slices, themeVars]);

  const labelColor = getThemeColorHex({
    themeVars,
    varName: '--color-muted-foreground',
    fallback: '#6E6E6E',
  });

  const lineColor = getThemeColorHex({
    themeVars,
    varName: '--color-border',
    fallback: '#D6D6D6',
  });

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
                  ...(axisFont ? { font: axisFont } : {}),
                  labelOffset: 5,
                  labelColor,
                  lineColor,
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
                    ...(axisFont ? { font: axisFont } : {}),
                    labelColor,
                    lineColor,
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

export const CheckedTotalPieChart = memo(CheckedTotalPieChartComponent);
