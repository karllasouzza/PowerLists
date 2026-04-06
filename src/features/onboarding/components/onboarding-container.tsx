import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { View, useWindowDimensions, FlatList, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { OnboardingContainerItem } from './onboarding-container-item';
import { ISlide, SlidesProps } from './types';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const SLIDE_PAGES: ISlide[] = [
  {
    content: {
      img: require('/assets/Images/Slides/Illustration_1.png'),
      title: 'Esqueça o papel!',
      subtitle:
        'Monte listas digitais, adicione preços e saiba na hora quanto vai gastar — sem surpresas na hora de pagar.',
    },
  },
  {
    content: {
      img: require('/assets/Images/Slides/Illustration_2.png'),
      title: 'Tudo organizado e sempre à mão!',
      subtitle:
        'Adicione itens, defina quantidades e compartilhe facilmente com quem você faz compras. Sincronize listas em tempo real com sua família ou amigos.',
    },
  },
  {
    content: {
      img: require('/assets/Images/Slides/Illustration_3.png'),
      title: 'Mais economia com menos esforço!',
      subtitle:
        'Monitore seus gastos, compare preços e descubra oportunidades de economia a cada compra. Faça escolhas inteligentes e aproveite mais.',
    },
  },
];

const OnboardingContainer = ({ completeOnboarding }: SlidesProps) => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<ISlide>>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const isLastSlide = useMemo(() => currentSlide === SLIDE_PAGES.length - 1, [currentSlide]);

  const handleScrollEnd = useCallback(
    (event: any) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setCurrentSlide(index);
    },
    [width],
  );

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      completeOnboarding();
    } else {
      const next = currentSlide + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentSlide(next);
    }
  }, [isLastSlide, completeOnboarding, currentSlide]);

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

export default memo(OnboardingContainer);
