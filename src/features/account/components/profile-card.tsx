import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type ProfileCardProps = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function ProfileCard({ name, email, avatarUrl }: ProfileCardProps) {
  return (
    <View className="items-center mx-4 mt-4 overflow-hidden flex flex-col gap-3 px-6 py-6">
      <Avatar className="size-20" alt="Avatar do usuário">
        {avatarUrl ? <AvatarImage source={{ uri: avatarUrl }} /> : null}
        <AvatarFallback>
          <Text className="text-foreground text-2xl font-semibold">{getInitials(name)}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="items-center gap-1">
        <Text className="text-foreground text-xl font-semibold">{name}</Text>
        <Text className="text-muted-foreground text-sm">{email}</Text>
      </View>
    </View>
  );
}
