import React, { useRef, useState } from 'react';
import { View, useWindowDimensions, FlatList, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { OnboardingContainerItem } from './onboarding-container-item';
import { ISlide, SlidesProps } from './types';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const SLIDE_PAGES: ISlide[] = [
  {
    content: {
      img: require('../../../assets/Images/Slides/Illustration_1.png'),
      title: 'Sua lista de compras, só que mais inteligente.',
      subtitle:
        'Deixe o papel no passado. Crie listas digitais, adicione os preços e saiba exatamente quanto vai gastar antes de chegar ao caixa.',
    },
  },
  {
    content: {
      img: require('../../../assets/Images/Slides/Illustration_2.png'),
      title: 'Organize tudo em um só lugar.',
      subtitle:
        'Adicione itens, defina quantidades e compartilhe suas listas com a família ou amigos com facilidade.',
    },
  },
  {
    content: {
      img: require('../../../assets/Images/Slides/Illustration_3.png'),
      title: 'Economize mais em cada compra.',
      subtitle:
        'Acompanhe seus gastos, compare preços e tome decisões mais inteligentes na hora de comprar.',
    },
  },
];

export const OnboardingContainer = ({ completeOnboarding }: SlidesProps) => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<ISlide>>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLastSlide = currentSlide === SLIDE_PAGES.length - 1;

  const handleScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      completeOnboarding();
    } else {
      const next = currentSlide + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentSlide(next);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDE_PAGES}
        renderItem={({ item }) => <OnboardingContainerItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(_, index) => index.toString()}
        style={{ flex: 1 }}
      />

      <View className="gap-6 px-8 pb-12 pt-4">
        <View className="flex-row items-center justify-center gap-2">
          {SLIDE_PAGES.map((_, index) => (
            <View
              key={index}
              className={cn(
                'h-2 rounded-full bg-primary transition-all',
                index === currentSlide ? 'w-6' : 'w-2 opacity-30',
              )}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          className="w-full items-center justify-center rounded-full bg-primary py-4">
          <Text className="text-base font-semibold text-primary-foreground">
            {isLastSlide ? 'Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
