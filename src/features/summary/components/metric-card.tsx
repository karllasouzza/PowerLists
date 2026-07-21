import { memo } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  valueClassName?: string;
};

function MetricCardComponent({ title, value, subtitle, valueClassName }: MetricCardProps) {
  return (
    <View className="min-h-[102px] flex-1 rounded-2xl border border-border bg-card p-4">
      <Text variant="muted" className="mt-0 text-xs">
        {title}
      </Text>
      <Text className={cn('mt-2 text-2xl font-bold text-foreground', valueClassName)}>{value}</Text>
      {subtitle ? (
        <Text variant="muted" className="mt-2 text-xs">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export const MetricCard = memo(MetricCardComponent);
