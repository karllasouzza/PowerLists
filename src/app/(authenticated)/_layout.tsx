import React from 'react';
import { type Href, usePathname } from 'expo-router';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { IconHome, IconListLetters, IconUser } from '@tabler/icons-react-native';

import { TabButton } from '@/components/tab-button';

export default function AuthenticatedLayout() {
  const pathname = usePathname();
  const isListScreen = pathname === '/list' || pathname.startsWith('/list/');
  const isItemVariationsScreen =
    pathname === '/item-variations' || pathname.startsWith('/item-variations/');
  const isItemComparisonScreen =
    pathname === '/item-comparison' || pathname.startsWith('/item-comparison/');
  const shouldHideTabs = isListScreen || isItemVariationsScreen || isItemComparisonScreen;

  return (
    <Tabs className="flex bg-background">
      <TabSlot />

      <TabList
        className="h-16 border-t border-border"
        style={shouldHideTabs ? { display: 'none' } : undefined}>
        <TabTrigger name="list" href={'/list' as Href} style={{ display: 'none' }} />
        <TabTrigger
          name="item-variations"
          href={'/item-variations' as Href}
          style={{ display: 'none' }}
        />
        <TabTrigger
          name="item-comparison"
          href={'/item-comparison' as Href}
          style={{ display: 'none' }}
        />

        <TabTrigger name="index" href={'/' as Href} asChild>
          <TabButton icon={IconHome} label="Dashboard" />
        </TabTrigger>
        <TabTrigger name="lists" href={'/lists' as Href} asChild>
          <TabButton icon={IconListLetters} label="Listas" />
        </TabTrigger>
        <TabTrigger name="account" href={'/account' as Href} asChild>
          <TabButton icon={IconUser} label="Perfil" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
