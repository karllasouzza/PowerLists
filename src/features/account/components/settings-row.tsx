import { cn } from '@/lib/utils';
import type { Icon as TablerIcon } from '@tabler/icons-react-native';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { IconChevronRight } from '@tabler/icons-react-native';

type SettingsRowProps = {
  icon: TablerIcon;
  label: string;
  onPress?: () => void;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
  className?: string;
};

export function SettingsRow({
  icon,
  label,
  onPress,
  rightContent,
  showChevron = true,
  destructive = false,
  className,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn('flex-row items-center gap-4 px-5 py-4 active:opacity-70', className)}>
      <Icon
        as={icon}
        size={22}
        className={cn(destructive ? 'text-destructive' : 'text-foreground')}
      />
      <Text
        className={cn('flex-1 text-base', destructive ? 'text-destructive' : 'text-foreground')}>
        {label}
      </Text>
      {rightContent && <View>{rightContent}</View>}
      {!rightContent && showChevron && (
        <Icon as={IconChevronRight} size={18} className="text-muted-foreground" />
      )}
    </Pressable>
  );
}
