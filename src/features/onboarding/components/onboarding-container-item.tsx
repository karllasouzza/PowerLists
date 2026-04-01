import React from 'react';
import { Image, View, useWindowDimensions } from 'react-native';

import { Text } from '@/components/ui/text';
import { SlideItemProps } from './types';

export const OnboardingContainerItem = ({ item }: SlideItemProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="flex-1 items-center justify-start bg-background">
      <View className="w-full flex-1 items-center justify-center">
        <Image source={item.content.img} resizeMode="contain" className="size-[300px]" />
      </View>

      <View className="w-full items-center gap-3 px-8 pb-4">
        <Text variant="h2" className="border-0 text-center font-bold text-foreground">
          {item.content.title}
        </Text>
        <Text variant="default" className="text-center text-muted-foreground">
          {item.content.subtitle}
        </Text>
      </View>
    </View>
  );
};
