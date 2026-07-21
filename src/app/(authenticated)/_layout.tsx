import React, { useMemo } from 'react';
import { type Href, usePathname } from 'expo-router';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import {
  IconFolder,
  IconFolderFilled,
  IconChartBar,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react-native';

import { TabButton } from '@/components/tab-button';
const SCREENS_WITH_HIDDEN_TABS = ['/lists/', '/item-variations', '/item-comparison'];

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
          <TabButton icon={IconFolder} focusedIcon={IconFolderFilled} label="Listas" />
        </TabTrigger>
        <TabTrigger name="dashboard" href={'/dashboard' as Href} asChild>
          <TabButton icon={IconChartBar} label="Resumo" />
        </TabTrigger>
        <TabTrigger name="account" href={'/account' as Href} asChild>
          <TabButton icon={IconUser} focusedIcon={IconUserFilled} label="Perfil" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
