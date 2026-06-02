import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';

export default function IndexScreen() {
  const { isLoading } = useAuth();
  const { user } = useUser();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (user) return <Redirect href="/(authenticated)" />;

  return <Redirect href="/onboarding" />;
}
