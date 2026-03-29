import { IconKey, IconUserEdit } from '@tabler/icons-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SettingsRow } from './settings-row';

type AccountSectionProps = {
  onManageProfile: () => void;
  onPasswordSecurity: () => void;
};

export function AccountSection({ onManageProfile, onPasswordSecurity }: AccountSectionProps) {
  return (
    <View className="m-4 overflow-hidden flex flex-col gap-3">
      <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        Conta
      </Text>
      <View className="rounded-2xl border border-border bg-card">
        <SettingsRow icon={IconUserEdit} label="Gerenciar Perfil" onPress={onManageProfile} />
        <View className="mx-5 border-t border-border" />
        <SettingsRow icon={IconKey} label="Senha e Segurança" onPress={onPasswordSecurity} />
      </View>
    </View>
  );
}
