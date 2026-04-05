import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import type { DashboardRecentListCard } from '../types';
import { RecentListSquareCard } from './recent-list-square-card';

type RecentListsSectionProps = {
  cards: DashboardRecentListCard[];
  onViewAll: () => void;
  onPressCard: (listId: string) => void;
};

export function RecentListsSection({ cards, onViewAll, onPressCard }: RecentListsSectionProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-4">
        <Text className="text-lg font-semibold text-foreground">Listas recentes</Text>
        <Button variant="ghost" size="sm" onPress={onViewAll}>
          <Text className="font-semibold text-primary">Ver todas</Text>
        </Button>
      </View>

      {cards.length ? (
        <ScrollView
          horizontal
          className="w-full"
          contentContainerClassName="gap-3 px-4"
          showsHorizontalScrollIndicator={false}>
          {cards.map((card) => (
            <RecentListSquareCard key={card.listId} card={card} onPress={onPressCard} />
          ))}
        </ScrollView>
      ) : (
        <View className="mx-4 rounded-2xl border border-dashed border-border bg-card px-4 py-5">
          <Text className="text-sm text-muted-foreground">Nenhuma lista encontrada.</Text>
        </View>
      )}
    </View>
  );
}
