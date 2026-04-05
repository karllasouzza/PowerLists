import { View } from 'react-native';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';

import type { DashboardPeriod } from '../types';

type PeriodFilterProps = {
  period: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
};

export function PeriodFilter({ period, onChange }: PeriodFilterProps) {
  return (
    <View className="px-4">
      <Tabs value={period} onValueChange={(value) => onChange(value as DashboardPeriod)}>
        <TabsList className="h-11 w-full rounded-xl bg-muted/70">
          <TabsTrigger value="all" className="flex-1 rounded-lg">
            <Text className="text-sm font-semibold">Tudo</Text>
          </TabsTrigger>
          <TabsTrigger value="week" className="flex-1 rounded-lg">
            <Text className="text-sm font-semibold">Semana</Text>
          </TabsTrigger>
          <TabsTrigger value="month" className="flex-1 rounded-lg">
            <Text className="text-sm font-semibold">Mês</Text>
          </TabsTrigger>
          <TabsTrigger value="year" className="flex-1 rounded-lg">
            <Text className="text-sm font-semibold">Ano</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </View>
  );
}
