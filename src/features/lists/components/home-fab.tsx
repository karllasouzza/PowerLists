import React from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { IconPlus } from '@tabler/icons-react-native';

interface HomeFabProps {
  isExtended: boolean;
  onPress: () => void;
}

export const HomeFab: React.FC<HomeFabProps> = ({ isExtended, onPress }) => {
  return (
    <Button
      onPress={onPress}
      className={`absolute bottom-4 right-4 h-14 flex-row items-center gap-2 rounded-full shadow-lg ${isExtended ? 'px-4' : 'w-14 justify-center px-0'}`}>
      <Icon as={IconPlus} size={24} className="text-primary-foreground" />
      {isExtended && <Text className="font-bold text-primary-foreground">Nova lista</Text>}
    </Button>
  );
};
