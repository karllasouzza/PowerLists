import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { IconUser, IconLogout } from '@tabler/icons-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/auth/auth-store';
import { Icon } from '@/components/ui/icon';

export default function AccountScreen() {
  const { signOut, user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="bg-primary-container h-[28vh] flex-col justify-around pt-2.5">
        <View className="h-25 w-25 mx-auto items-center justify-center rounded-full bg-primary">
          <Icon as={IconUser} size={30} color="white" />
        </View>
        <Text className="text-on-primary-container text-center text-3xl capitalize">
          {user?.name || 'User'}
        </Text>
      </View>

      <View className="m-0 p-0">
        <Pressable
          onPress={signOut}
          className="bg-error-container flex h-[100px] w-full flex-row items-center justify-evenly px-5">
          <Icon as={IconLogout} size={30} color="black" />
          <Text className="text-on-primary-container text-3xl capitalize">Sair</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
