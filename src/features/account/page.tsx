import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IconLogout } from '@tabler/icons-react-native';
import { observer } from '@legendapp/state/react';
import { isGuestUser } from '@/data/types/user';
import { TopBar } from '@/components/top-bar';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

import { ProfileCard } from './components/profile-card';
import { AccountSection } from './components/account-section';
import { PreferencesSection } from './components/preferences-section';
import { ManageProfileModal } from './components/manage-profile-modal';
import { PasswordSecurityModal } from './components/password-security-modal';
import useProfileData from './use-profile-data';
import { Icon } from '@/components/ui/icon';

const AccountScreen = observer(() => {
  const { profile, user, signOut, theme, colorScheme, setTheme, setColorScheme } = useProfileData();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const displayName = isGuestUser(user)
    ? user.name || 'Usuário'
    : profile?.name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = isGuestUser(user) ? user.email || '' : user?.email || '';
  const avatarUrl = profile?.avatar_url || null;

  return (
    <View className="h-full w-full bg-background">
      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <ProfileCard name={displayName} email={displayEmail} avatarUrl={avatarUrl} />

        <AccountSection
          onManageProfile={() => setProfileModalOpen(true)}
          onPasswordSecurity={() => setPasswordModalOpen(true)}
        />

        <PreferencesSection
          colorScheme={colorScheme}
          theme={theme}
          onColorSchemeChange={setColorScheme}
          onThemeChange={setTheme}
        />

        {/* Logout card */}
        <Button
          variant="outline"
          onPress={signOut}
          className="h-14 mx-4 mt-6 flex-row items-center justify-center gap-3 bg-destructive/10 border-destructive">
          <Icon as={IconLogout} size={20} className="text-destructive" />
          <Text className="text-destructive text-base font-semibold">Sair</Text>
        </Button>
      </ScrollView>

      <ManageProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        currentName={displayName}
        currentEmail={displayEmail}
      />

      <PasswordSecurityModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
    </View>
  );
});

export default AccountScreen;
