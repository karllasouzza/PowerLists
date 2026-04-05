import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

export function ListItemSkeleton() {
  return (
    <View className="flex-row items-center gap-3 bg-card p-3 w-full min-h-[88px]">
      <Skeleton className="rounded-xl" style={{ width: 64, height: 64 }} />
      <View className="flex-1 justify-center gap-2">
        <Skeleton className="rounded-md w-3/4 h-4" />
        <Skeleton className="rounded-md w-1/2 h-3" />
      </View>
    </View>
  );
}

export function ListItemSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <View className="flex-1 py-2 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </View>
  );
}
