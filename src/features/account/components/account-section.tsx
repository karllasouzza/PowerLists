import { IconKey, IconUserEdit } from '@tabler/icons-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SettingsRow } from './settings-row';

type AccountSectionProps = {
  isGuest?: boolean;
  onManageProfile: () => void;
  onPasswordSecurity: () => void;
};

export function AccountSection({ isGuest, onManageProfile, onPasswordSecurity }: AccountSectionProps) {
  return (
    <View className="m-4 overflow-hidden flex flex-col gap-3">
      <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        Conta
      </Text>
      <View className="rounded-2xl border border-border bg-card">
        <SettingsRow icon={IconUserEdit} label="Editar Perfil" onPress={onManageProfile} />
        {!isGuest && (
          <>
            <View className="mx-5 border-t border-border" />
            <SettingsRow icon={IconKey} label="Alterar Senha" onPress={onPasswordSecurity} />
          </>
        )}
      </View>
    </View>
  );
}
