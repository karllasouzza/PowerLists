import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { View, useWindowDimensions, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { IconSquare, IconSquareCheck } from '@tabler/icons-react-native';
import FocusAwareStatusBar from '../focus-aware-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SlideItem } from './SlideItem';
import { Button } from '../ui/button';
import { Icon } from '../ui/icon';
import { useTheme } from '@/context/themes/use-themes';
import { themes } from '@/context/themes/themeConfig';

interface SlidesProps {
  current_slide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  completeOnboarding: () => void;
}

const Slides = ({ current_slide, nextSlide, prevSlide, completeOnboarding }: SlidesProps) => {
  const { theme, colorScheme } = useTheme();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<any>>(null);

  const slide_pages = useMemo(
    () => [
      {
        className: 'bg-primary',
        statusBarColorVar: '--color-primary',
        checkClassName: 'text-primary-foreground',
        checkBgClassName: 'text-background',
        content: {
          img: require('../../../assets/Images/Slides/Illustration_1.png'),
          title: 'Planeje suas compras',
          subtitle: 'Comece marcando o incio de um ciclo de produtividade!',
        },
      },
      {
        className: 'bg-secondary',
        statusBarColorVar: '--color-secondary',
        checkClassName: 'text-secondary-foreground',
        checkBgClassName: 'text-background',
        content: {
          img: require('../../../assets/Images/Slides/Illustration_2.png'),
          title: 'Evite anotações físicas',
          subtitle: 'Marque o fim da dependência exclusiva de papel para anotar suas compras!',
        },
      },
      {
        className: 'bg-destructive',
        statusBarColorVar: '--color-destructive',
        checkClassName: 'text-destructive-foreground',
        checkBgClassName: 'text-background',
        content: {
          img: require('../../../assets/Images/Slides/Illustration_3.png'),
          title: 'Liste suas financias',
          subtitle: 'Marque todas as suas financias em um único lugar!',
        },
      },
    ],
    []
  );

  // Helper to resolve theme color variable to value
  const getThemeColor = useCallback(
    (variable: string) => {
      // @ts-ignore
      return themes[theme][colorScheme][variable];
    },
    [theme, colorScheme]
  );

  // Update NavigationBar color when slide changes
  useEffect(() => {
    const colorVar = slide_pages[current_slide]?.statusBarColorVar;
    if (colorVar) {
      const color = getThemeColor(colorVar);
      if (color) {
        NavigationBar.setBackgroundColorAsync(color);
      }
    }
  }, [current_slide, slide_pages, getThemeColor]);

  // Sync FlatList with current_slide prop
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: current_slide,
        animated: true,
      });
    }
  }, [current_slide]);

  const handleScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);

    if (currentIndex > current_slide) {
      nextSlide();
    } else if (currentIndex < current_slide) {
      prevSlide();
    }
  };

  const currentStatusBarColor = getThemeColor(slide_pages[current_slide].statusBarColorVar);

  return (
    <View className="flex-1">
      <FocusAwareStatusBar color={currentStatusBarColor} />

      <Animated.FlatList
        ref={flatListRef}
        data={slide_pages}
        renderItem={({ item }) => <SlideItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(_, index) => index.toString()}
      />

      <View className="absolute bottom-10 w-full flex-row justify-center gap-4">
        {slide_pages
          .filter((_, index) => index <= current_slide)
          .map((slide, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onPress={() => {
                if (index < current_slide) {
                  prevSlide();
                } else if (index === slide_pages.length - 1) {
                  // Último slide, completa o onboarding
                  completeOnboarding();
                } else {
                  nextSlide();
                }
              }}>
              <Icon
                as={index < current_slide ? IconSquareCheck : IconSquare}
                size={32}
                className={index < current_slide ? slide.checkClassName : slide.checkBgClassName}
              />
            </Button>
          ))}
      </View>
    </View>
  );
};

export default Slides;
