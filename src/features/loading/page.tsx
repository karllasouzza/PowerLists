import React from 'react';
import { View } from 'react-native';
import { cssInterop } from 'nativewind';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { Text } from '@/components/ui/text';

export default function LoadingPage() {
  const [assets, error] = useAssets([require('../../..//assets/adaptive-icon.png')]);

  const StyledExpoImage = cssInterop(Image, {
    className: 'style',
  });

  return (
    <View className="flex h-full w-full items-center justify-center bg-background">
      {assets && !error && (
        <StyledExpoImage source={assets[0]} className="rounded-lg! !size-52" alt="Power Lists" />
      )}
      <Text variant="h1">Power Lists</Text>
    </View>
  );
}
