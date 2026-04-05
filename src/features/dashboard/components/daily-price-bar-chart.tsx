import { View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';
import { useTheme } from '@/context/themes';
import { rawColors } from '@/context/themes/theme-config';
import { getThemeColorHex } from '@/utils/tailwind-color';

import { Text } from '@/components/ui/text';

import type { DashboardDatePoint } from '../types';

type DailyPriceBarChartProps = {
  series: DashboardDatePoint[];
};

export function DailyPriceBarChart({ series }: DailyPriceBarChartProps) {
  const chartData = series.map((point) => ({
    day: point.label,
    price: Number(point.averageUnitPrice.toFixed(2)),
  }));

  const { theme: themeName, colorScheme } = useTheme();
  const themeVars = rawColors[themeName][colorScheme];

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
  if (!chartData.length) {
    return (
      <View className="rounded-3xl border border-dashed border-border bg-card px-4 py-6">
        <Text className="text-sm text-muted-foreground">
          Não há histórico suficiente para montar o gráfico diário.
        </Text>
      </View>
    );
  }

  return (
    <View className="rounded-3xl border border-border bg-card p-4">
      <Text className="text-base font-semibold text-foreground">Preço unitário por dia</Text>
      <Text variant="muted" className="mt-1 text-xs">
        Eixo X: dia | Eixo Y: preço
      </Text>

      <View className="mt-4 h-64 w-full">
        <CartesianChart
          data={chartData}
          xKey="day"
          yKeys={['price']}
          domainPadding={{ left: 28, right: 22, top: 18 }}
          xAxis={{ tickCount: 6, labelColor, lineColor }}
          yAxis={[
            {
              tickCount: 4,
              labelColor,
              lineColor,
              formatYLabel: (value) => `R$ ${Number(value).toFixed(0)}`,
            },
          ]}>
          {({ points, chartBounds }) => (
            <Bar
              points={points.price}
              chartBounds={chartBounds}
              color="#4C8E4A"
              roundedCorners={{ topLeft: 6, topRight: 6 }}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}
