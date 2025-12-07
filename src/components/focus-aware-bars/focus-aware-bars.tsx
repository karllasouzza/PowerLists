import { useFocusEffect } from '@react-navigation/native';
import { SystemBars } from 'react-native-edge-to-edge';

import { useTheme } from '@/context/themes/theme-context';
import { IFocusAwareBarsProps } from './focus-aware-bars.types';

export const FocusAwareBars = ({ color, style }: IFocusAwareBarsProps) => {
  const { colorScheme } = useTheme();

  useFocusEffect(() => {
    SystemBars.setStyle({
      navigationBar: style || colorScheme === 'light' ? 'dark' : 'light',
      statusBar: style || colorScheme === 'light' ? 'dark' : 'light',
    });
  });

  return (
    <>
      <SystemBars style={style || colorScheme === 'light' ? 'dark' : 'light'} />
    </>
  );
};
