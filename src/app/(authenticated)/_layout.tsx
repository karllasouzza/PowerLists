import React, { useMemo } from 'react';
import { type Href, usePathname } from 'expo-router';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import {
  IconFolder,
  IconFolderFilled,
  IconHome,
  IconHomeFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react-native';

import { TabButton } from '@/components/tab-button';
const SCREENS_WITH_HIDDEN_TABS = ['/list', '/item-variations', '/item-comparison'];

export default function AuthenticatedLayout() {
  const pathname = usePathname();

  const shouldHideTabs = useMemo(
    () =>
      SCREENS_WITH_HIDDEN_TABS.some(
        (screen) => pathname === screen || pathname.startsWith(`${screen}/`),
      ),
    [pathname],
  );

  return (
    <Tabs className="flex bg-background">
      <TabSlot />

      <TabList
        className="h-16 border-t border-border"
        style={shouldHideTabs ? { display: 'none' } : undefined}>
        <TabTrigger name="list" href={'/list' as Href} style={{ display: 'none' }} />
        <TabTrigger name="assistant" href={'/assistant' as Href} style={{ display: 'none' }} />
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
          <TabButton icon={IconHome} focusedIcon={IconHomeFilled} label="Dashboard" />
        </TabTrigger>
        <TabTrigger name="lists" href={'/lists' as Href} asChild>
          <TabButton icon={IconFolder} focusedIcon={IconFolderFilled} label="Listas" />
        </TabTrigger>
        <TabTrigger name="account" href={'/account' as Href} asChild>
          <TabButton icon={IconUser} focusedIcon={IconUserFilled} label="Perfil" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
