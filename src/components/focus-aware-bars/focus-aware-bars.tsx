import { useFocusEffect } from '@react-navigation/native';
import { SystemBars } from 'react-native-edge-to-edge';

import { IFocusAwareBarsProps } from './focus-aware-bars.types';

export const FocusAwareBars = ({ style, colorScheme }: IFocusAwareBarsProps) => {
  useFocusEffect(() => {
    SystemBars.setStyle({
      navigationBar: style || colorScheme || 'light',
      statusBar: style || colorScheme || 'light',
    });
  });

  return (
    <>
      <SystemBars style={style || colorScheme || 'light'} />
    </>
  );
};
