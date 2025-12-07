import React, { useRef, useEffect, useMemo } from 'react';
import { View, useWindowDimensions, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { OnboardingContainerItem } from './onboarding-container-item';
import { useTheme } from '@/context/themes/use-themes';
import { SlidesProps } from './';
import { OnboardingCheckButton } from './onboarding-check-button';

export const OnboardingContainer = ({
  current_slide,
  nextSlide,
  prevSlide,
  completeOnboarding,
  goToSlide,
}: SlidesProps) => {
  const { setBars } = useTheme();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<any>>(null);

  const slide_pages = useMemo(
    () => [
      {
        content: {
          img: require('../../../assets/Images/Slides/Illustration_1.png'),
          title: 'Planeje suas compras',
          subtitle: 'Comece marcando o incio de um ciclo de produtividade!',
        },
      },
      {
        content: {
          img: require('../../../assets/Images/Slides/Illustration_2.png'),
          title: 'Evite anotações físicas',
          subtitle: 'Marque o fim da dependência exclusiva de papel para anotar suas compras!',
        },
      },
      {
        content: {
          img: require('../../../assets/Images/Slides/Illustration_3.png'),
          title: 'Liste suas financias',
          subtitle: 'Marque todas as suas financias em um único lugar!',
        },
      },
    ],
    []
  );

  // Update NavigationBar color when slide changes
  useEffect(() => {
    const colorVar = `--color-onboarding-${current_slide + 1}`;
    if (colorVar) {
      console.log(colorVar);
      setBars({
        color: colorVar,
        style: 'dark',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current_slide, slide_pages]);

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

  return (
    <View className="h-full w-full flex-1">
      <Animated.FlatList
        ref={flatListRef}
        data={slide_pages}
        renderItem={({ item, index }) => <OnboardingContainerItem item={item} index={index} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(_, index) => index.toString()}
      />

      <View className="absolute bottom-8 w-full flex-col items-center gap-4">
        {slide_pages
          .filter((_, index) => index <= current_slide)
          .map((slide, index) => (
            <OnboardingCheckButton
              key={`onboard-button-${index}`}
              index={index}
              current_slide={current_slide}
              goToSlide={goToSlide}
              nextSlide={nextSlide}
              completeOnboarding={completeOnboarding}
              slide_pages={slide_pages}
              slide={slide}
            />
          ))}
      </View>
    </View>
  );
};
