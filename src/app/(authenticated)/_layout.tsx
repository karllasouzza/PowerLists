import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { IconHome, IconUser } from '@tabler/icons-react-native';
import { TabButton } from '@/components/tab-button';

export default function AuthenticatedLayout() {
  return (
    <Tabs className="flex bg-background">
      <TabSlot />

      <TabList className="h-16 border-t border-border">
        <TabTrigger name="index" href="/" asChild>
          <TabButton icon={IconHome} label="Início" />
        </TabTrigger>
        <TabTrigger name="account" href="/account" asChild>
          <TabButton icon={IconUser} label="Perfil" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
