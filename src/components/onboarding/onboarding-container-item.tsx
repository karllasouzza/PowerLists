import React from 'react';
import { Image, View, useWindowDimensions } from 'react-native';
import { Text } from '../ui/text';
import { SlideItemProps } from './';
import { cn } from '@/lib/utils';

export const OnboardingContainerItem = ({ item, index }: SlideItemProps) => {
  const { width } = useWindowDimensions();

  const color = `bg-onboarding-${index + 1}`;
  const colorForeground = `text-onboarding-${index + 1}-foreground`;

  return (
    <View
      style={{ width }}
      className={cn('flex flex-1 flex-col items-center justify-start gap-6', color)}>
      <View className="h-full max-h-[400px] w-full flex-1 items-center justify-center">
        <Image source={item.content.img} resizeMode="contain" className="size-[300px]" />
      </View>

      <View className="w-full items-center gap-2 px-8">
        <Text variant="h2" className={cn('border-0 text-center font-bold', colorForeground)}>
          {item.content.title}
        </Text>
        <Text variant="default" className={cn('text-center', colorForeground)}>
          {item.content.subtitle}
        </Text>
      </View>
    </View>
  );
};
