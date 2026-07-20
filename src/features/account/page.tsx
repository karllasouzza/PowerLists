import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { IconLogout, IconUserPlus } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { isGuestUser } from '@/types/user';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

import { ProfileCard } from './components/profile-card';
import { AccountSection } from './components/account-section';
import { PreferencesSection } from './components/preferences-section';
import { ManageProfileModal } from './components/manage-profile-modal';
import { PasswordSecurityModal } from './components/password-security-modal';
import useProfileData from './use-account-page';
import { Icon } from '@/components/ui/icon';

const AccountScreen = () => {
  const { profile, user, signOut, theme, colorScheme, setTheme, setColorScheme } = useProfileData();
  const router = useRouter();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const isGuest = isGuestUser(user);
  const displayName = isGuest
    ? user.name || 'Usuário'
    : profile?.name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = isGuest ? user.email || '' : user?.email || '';
  const avatarUrl = profile?.avatarUrl || null;

  return (
    <View className="h-full w-full bg-background">
      <ScrollView contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <ProfileCard name={displayName} email={displayEmail} avatarUrl={avatarUrl} />

        {isGuest && (
          <View className="m-4 gap-3">
            <View className="rounded-2xl border border-border bg-card p-5 gap-3">
              <Text className="text-base font-semibold text-foreground">Conta Local</Text>
              <Text className="text-sm text-muted-foreground">
                Seus dados estão salvos apenas neste dispositivo. Faça login para sincronizar
                entre dispositivos.
              </Text>
              <Button
                variant="default"
                className="h-12 flex-row items-center justify-center gap-2"
                onPress={() => router.navigate('/login')}>
                <Icon as={IconUserPlus} size={20} className="text-primary-foreground" />
                <Text className="text-base font-bold text-primary-foreground">Fazer Login</Text>
              </Button>
            </View>
          </View>
        )}

        <AccountSection
          isGuest={isGuest}
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
        profileId={profile?.id}
      />

      <PasswordSecurityModal open={passwordModalOpen} onOpenChange={setPasswordModalOpen} />
    </View>
  );
};

export default AccountScreen;
