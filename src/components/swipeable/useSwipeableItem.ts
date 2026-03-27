import { useCallback, useEffect } from 'react';
import type { UseSwipeableItemOptions, UseSwipeableItemReturn } from './types';

let openedSwipeable: ReturnType<UseSwipeableItemOptions['ref'] | any> | null = null;

export function useSwipeableItem({
  ref,
  onOpen,
  onClose,
}: UseSwipeableItemOptions): UseSwipeableItemReturn {
  const handleSwipeableWillOpen = useCallback(() => {
    if (openedSwipeable && openedSwipeable !== ref.current) {
      openedSwipeable.close();
    }
    openedSwipeable = ref.current ?? null;
  }, [ref]);

  const handleSwipeableOpen = useCallback(
    (direction: 'left' | 'right') => {
      onOpen?.(direction);
    },
    [onOpen],
  );

  const handleSwipeableWillClose = useCallback(() => {
    if (openedSwipeable === ref.current) {
      openedSwipeable = null;
    }
    onClose?.();
  }, [ref, onClose]);

  const handleSwipeableClose = useCallback(() => {
    if (openedSwipeable === ref.current) {
      openedSwipeable = null;
    }
    onClose?.();
  }, [ref, onClose]);

  useEffect(() => {
    const instance = ref.current;
    return () => {
      if (openedSwipeable === instance) {
        openedSwipeable = null;
      }
    };
  }, [ref]);

  return {
    handlers: {
      onSwipeableWillOpen: handleSwipeableWillOpen,
      onSwipeableOpen: handleSwipeableOpen,
      onSwipeableWillClose: handleSwipeableWillClose,
      onSwipeableClose: handleSwipeableClose,
    },
  };
}

export function closeOpenedSwipeable(): void {
  if (openedSwipeable) {
    openedSwipeable.close();
    openedSwipeable = null;
  }
}
