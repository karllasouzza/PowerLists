import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { IconUser, IconLogout } from '@tabler/icons-react-native';
import { isGuestUser } from '@/data/types/user';
import { Icon } from '@/components/ui/icon';
import { TopBar } from '@/components/top-bar';
import { observer } from '@legendapp/state/react';
import useProfileData from './use-profile-data';

const AccountScreen = observer(() => {
  const { profile, user, signOut } = useProfileData();

  return (
    <View className="h-full w-full bg-background">
      <TopBar title="Account" />
      <View className="h-[28vh] flex-col items-center justify-center">
        <View className="size-32 items-center justify-center rounded-full">
          <Icon as={IconUser} size={30} color="white" />
        </View>
        <Text className="text-center text-2xl capitalize text-primary-foreground">
          {isGuestUser(user) ? user.name : profile?.name || 'User'}
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
    </View>
  );
});

export default AccountScreen;
