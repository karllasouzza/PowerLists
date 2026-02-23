import { View, Text, ScrollView } from 'react-native';
import { TopBar } from '@/components/top-bar';

export default function ExplorePage() {
  return (
    <View className="flex-1 bg-background">
      <TopBar title="Explore" />
      <ScrollView className="flex-1 px-4">
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-2xl font-bold text-foreground">Explore</Text>
          <Text className="mt-2 text-muted-foreground">Discover new content and features</Text>
        </View>
      </ScrollView>
    </View>
  );
}
