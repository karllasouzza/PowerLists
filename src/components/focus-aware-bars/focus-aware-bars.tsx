import { useFocusEffect } from '@react-navigation/native';
import { SystemBars } from 'react-native-edge-to-edge';

import { FocusAwareBarsProps } from './focus-aware-bars.types';

export const FocusAwareBars = ({ colorScheme }: FocusAwareBarsProps) => {
  useFocusEffect(() => {
    SystemBars.setStyle({
      navigationBar: colorScheme || 'light',
      statusBar: colorScheme || 'light',
    });
  });

  return <SystemBars style={colorScheme || 'light'} />;
};
