import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export function CardListSkeleton() {
  return (
    <View className="flex-row items-center gap-3 bg-card px-4 py-4">
      <Skeleton className="rounded-full size-[50px] animate-pulse" />
      <View className="flex-col flex-1 gap-2">
        <Skeleton className="rounded-md w-2/3 h-4 animate-pulse" />
        <Skeleton className="rounded-md w-1/3 h-4 animate-pulse" />
      </View>
    </View>
  );
}

export function CardListSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <View className="flex-1 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <CardListSkeleton key={i} />
      ))}
    </View>
  );
}
