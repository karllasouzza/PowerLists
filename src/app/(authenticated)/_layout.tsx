import React from 'react';
import { type Href, usePathname } from 'expo-router';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { IconHome, IconUser } from '@tabler/icons-react-native';

import { TabButton } from '@/components/tab-button';

export default function AuthenticatedLayout() {
  const pathname = usePathname();
  const isListScreen = pathname === '/list';

  return (
    <Tabs className="flex bg-background">
      <TabSlot />

      <TabList
        className="h-16 border-t border-border"
        style={isListScreen ? { display: 'none' } : undefined}>
        <TabTrigger name="list" href={'/list' as Href} style={{ display: 'none' }} />
        <TabTrigger name="index" href={'/' as Href} asChild>
          <TabButton icon={IconHome} label="Início" />
        </TabTrigger>
        <TabTrigger name="account" href={'/account' as Href} asChild>
          <TabButton icon={IconUser} label="Perfil" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
