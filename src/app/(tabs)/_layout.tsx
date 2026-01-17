import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { NativeTabs, Icon, Label, Badge, VectorIcon } from 'expo-router/unstable-native-tabs';

import { getProfile } from '@/data/actions/profile';
import '@/css/global.css';
import { HomeIcon, SettingsIcon, UserIcon } from 'lucide-react-native';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { profile } = await getProfile();
      if (!profile) {
        router.replace('/account');
      }
    };
    init();
  }, [router]);

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.TabBar backgroundColor="white" />
        <Icon src={<HomeIcon className="text-foreground" size={24} />} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.TabBar backgroundColor="white" />
        <Icon src={<UserIcon className="text-foreground" size={24} />} />
        <Label>Account</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.TabBar backgroundColor="white" />
        <Icon src={<SettingsIcon className="text-foreground" size={24} />} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
