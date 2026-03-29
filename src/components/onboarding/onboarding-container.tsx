import React, { useRef, useEffect } from 'react';
import { View, useWindowDimensions, FlatList } from 'react-native';
import Animated from 'react-native-reanimated';
import { OnboardingContainerItem } from './onboarding-container-item';
import { SlidesProps } from './';
import { OnboardingCheckButton } from './onboarding-check-button';
import { useTheme } from '@/context/themes';

const SLIDE_PAGES = [
  {
    content: {
      img: require('../../../assets/Images/Slides/Illustration_1.png'),
      title: 'Sua lista de compras, só que mais inteligente.',
      subtitle:
        'Deixe o papel no passado. Crie listas digitais, adicione os preços e saiba exatamente quanto vai gastar antes de chegar ao caixa.',
      checkLabel: 'Faça sua primeira lista',
    },
  },
];

export const OnboardingContainer = ({
  current_slide,
  nextSlide,
  prevSlide,
  completeOnboarding,
  goToSlide,
}: SlidesProps) => {
  const { backgroundColor } = useTheme();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<any>>(null);

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
    <View className="h-full w-full flex-1" style={{ backgroundColor: backgroundColor }}>
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDE_PAGES}
        renderItem={({ item, index }) => <OnboardingContainerItem item={item} index={index} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(_, index) => index.toString()}
      />

      <View className="absolute bottom-8 w-full flex-col items-center gap-4">
        {SLIDE_PAGES.filter((_, index) => index <= current_slide).map((slide, index) => (
          <OnboardingCheckButton
            key={`onboard-button-${index}`}
            index={index}
            current_slide={current_slide}
            goToSlide={goToSlide}
            nextSlide={nextSlide}
            completeOnboarding={completeOnboarding}
            slide_pages={SLIDE_PAGES}
            slide={slide}
          />
        ))}
      </View>
    </View>
  );
};
