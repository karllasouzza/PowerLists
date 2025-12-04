import React from 'react';
import { Image, View, useWindowDimensions } from 'react-native';
import { Text } from '../ui/text';
import { SlideItemProps } from './';

export const OnboardingContainerItem = ({ item }: SlideItemProps) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{ width }}
      className={`flex-1 items-center justify-center bg-red-400 px-8 ${item.className}`}>
      <Image
        source={item.content.img}
        style={{ width: width * 0.8, height: width * 0.8 }}
        resizeMode="contain"
        className="mb-8"
      />

      <View className="items-center gap-2">
        <Text variant="h2" className="text-center font-bold text-white">
          {item.content.title}
        </Text>
        <Text variant="lead" className="text-center text-white/90">
          {item.content.subtitle}
        </Text>
      </View>
    </View>
  );
};
