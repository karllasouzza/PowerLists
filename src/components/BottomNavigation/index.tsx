import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from '../../features/home/page';
import AccountScreen from '../../features/account/page';
import Footer from '../Footer';
import { useTheme } from '@/context/themes/use-themes';
import { themes } from '@/context/themes/themeConfig';

export default function BottomNavigation({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const { theme, colorScheme } = useTheme();

  // Helper to resolve theme colors
  // @ts-ignore
  const currentTheme = themes[theme][colorScheme];

  const routes = [
    { key: 'home', title: 'Inicio', component: HomeScreen },
    { key: 'account', title: 'Conta', component: AccountScreen },
  ];

  const renderScene = () => {
    const RouteComponent = routes[index].component;
    return <RouteComponent navigation={navigation} />;
  };

  const handleTabChange = (newIndex: number) => {
    setIndex(newIndex);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">{renderScene()}</View>

      <Footer
        background={currentTheme['--color-background']}
        iconColor={currentTheme['--color-foreground']} // Or muted foreground
        onIconColor={currentTheme['--color-primary']}
        onIconBackground={currentTheme['--color-secondary']} // Or primary container
        mode={index === 1 ? 'account' : 'default'}
        route={index === 0 ? 'Home' : 'Account'}
        homeHandle={() => handleTabChange(0)}
        accountHandle={() => handleTabChange(1)}
        addHandle={() => {
          // Logic for add button
          // If on Home, maybe trigger something?
          // For now, just log or do nothing as HomeScreen has its own FAB
          console.log('Add button pressed');
        }}
      />
    </View>
  );
}
