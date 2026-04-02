import { cn } from '@/lib/utils';
import { Pressable, PressableProps, View } from 'react-native';
import { Icon } from './ui/icon';
import type { Icon as TablerIcon } from '@tabler/icons-react-native';
import { Text } from './ui/text';

type TabButtonProps = PressableProps & {
  isFocused?: boolean;
  icon: TablerIcon;
  label?: string;
};

export function TabButton({ isFocused = false, icon: IconComponent, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={{ flex: 1 }} className="items-center justify-center">
      <View
        className={cn(
          'items-center justify-center gap-1 p-2 shrink-0 flex-col rounded-lg shadow-none pointer-events-none',
        )}>
        <Icon
          as={IconComponent}
          className={cn('stroke-2', isFocused ? 'stroke-primary' : 'stroke-muted-foreground')}
          size={24}
        />
        <Text
          variant="small"
          className={cn('text-xs', isFocused ? 'text-primary' : 'text-muted-foreground')}>
          {props.label}
        </Text>
      </View>
    </Pressable>
  );
}
