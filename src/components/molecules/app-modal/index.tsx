import { NativeOnlyAnimatedView } from '@/components/ui/native-only-animated-view';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import * as React from 'react';
import { Platform, Pressable, View, type ViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  default as Animated,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

import { Text } from '@/components/ui/text';
import type {
  AppModalContextType,
  AppModalDragContextType,
  AppModalFooterProps,
  AppModalHeaderProps,
  AppModalProps,
} from '@/components/molecules/app-modal/types';
import { Button } from '@/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react-native';

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

export const AppModalContext = React.createContext<AppModalContextType | null>(null);
const AppModalDragContext = React.createContext<AppModalDragContextType | null>(null);

function AppModal({ open, onOpenChange, children }: AppModalProps) {
  return (
    <AppModalContext.Provider value={{ open, onOpenChange }}>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        {children}
      </DialogPrimitive.Root>
    </AppModalContext.Provider>
  );
}

function AppModalOverlay({
  className,
  children,
  ...props
}: Omit<DialogPrimitive.OverlayProps, 'asChild'> &
  React.RefAttributes<DialogPrimitive.OverlayRef> & {
    children?: React.ReactNode;
  }) {
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          'absolute bottom-0 left-0 right-0 top-0 z-50 flex justify-end bg-black/50',
          Platform.select({
            web: 'animate-in fade-in-0 fixed cursor-default [&>*]:cursor-auto',
          }),
          className,
        )}
        {...props}
        asChild={Platform.OS !== 'web'}>
        <NativeOnlyAnimatedView entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
          {children}
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function AppModalContent({
  className,
  portalHost,
  children,
  ...props
}: DialogPrimitive.ContentProps &
  React.RefAttributes<DialogPrimitive.ContentRef> & {
    portalHost?: string;
  }) {
  const modalCtx = React.useContext(AppModalContext);
  const translateY = useSharedValue(0);

  const close = React.useCallback(() => {
    modalCtx?.onOpenChange(false);
  }, [modalCtx]);

  // Reset drag offset every time the modal opens
  React.useEffect(() => {
    if (modalCtx?.open) {
      translateY.value = 0;
    }
  }, [modalCtx?.open, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <DialogPrimitive.Portal hostName={portalHost}>
      <AppModalOverlay>
        {/* Backdrop: tapping the dark area closes the modal */}
        <Pressable className="flex-1" onPress={close} />
        {/* Outer: entering/exiting animation only — no style transform here */}
        <NativeOnlyAnimatedView
          entering={SlideInDown.duration(300).springify().damping(32).stiffness(180).mass(0.8)}
          exiting={SlideOutDown.duration(220)}
          className="w-full">
          {/* Inner: drag offset only — no entering/exiting here */}
          <Animated.View style={animatedStyle}>
            <AppModalDragContext.Provider value={{ translateY, close }}>
              <DialogPrimitive.Content
                className={cn(
                  'bg-background z-50 w-full rounded-t-3xl pb-8 overflow-hidden border border-b-0 border-border',
                  Platform.select({
                    web: 'animate-in slide-in-from-bottom duration-300',
                  }),
                  className,
                )}
                {...props}>
                {children}
              </DialogPrimitive.Content>
            </AppModalDragContext.Provider>
          </Animated.View>
        </NativeOnlyAnimatedView>
      </AppModalOverlay>
    </DialogPrimitive.Portal>
  );
}

function AppModalHandle({ className, ...props }: ViewProps) {
  const dragCtx = React.useContext(AppModalDragContext);

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      if (!dragCtx) return;
      dragCtx.translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (!dragCtx) return;
      const shouldClose = e.translationY > 80 || e.velocityY > 600;
      if (shouldClose) {
        // Don't reset translateY here — let SlideOutDown compose with the current
        // drag offset so the modal continues sliding down without snapping back.
        return dragCtx.close();
      }

      return (dragCtx.translateY.value = withSpring(0, { damping: 20, stiffness: 200 }));
    });

  const handleBar = (
    <View className={cn('mb-4 items-center py-4 bg-bottom-bar/40', className)} {...props}>
      <View className="bg-muted-foreground/30 h-1 w-10 rounded-full" />
    </View>
  );

  if (!dragCtx) return handleBar;

  return <GestureDetector gesture={gesture}>{handleBar}</GestureDetector>;
}

function AppModalHeader({ title, className, titleClassName, ...props }: AppModalHeaderProps) {
  return (
    <View className={cn('items-center px-6 pb-4', className)} {...props}>
      <Text variant="large" className={cn('text-foreground font-bold', titleClassName)}>
        {title}
      </Text>
    </View>
  );
}

function AppModalFooter({
  onCancel,
  cancelLabel = 'Cancelar',
  onConfirm,
  confirmLabel = 'Save',
  confirmingLabel = 'Saving...',
  confirmVariant = 'default',
  confirmButtonClassName,
  confirmLabelClassName,
  isLoading = false,
  isConfirmDisabled = false,
}: AppModalFooterProps) {
  const isDisabled = isLoading || isConfirmDisabled;

  return (
    <View className="mt-4 flex-row gap-3 px-6">
      <Button
        variant="outline"
        onPress={onCancel}
        disabled={isLoading}
        className={cn(isLoading && 'opacity-50')}>
        <Text className="text-foreground font-semibold">{cancelLabel}</Text>
      </Button>

      <Button
        onPress={onConfirm}
        disabled={isDisabled}
        className={cn(
          'flex-1 items-center justify-center rounded-full py-3',
          confirmButtonClassName,
        )}
        variant={confirmVariant}>
        {isLoading && (
          <IconLoader2
            size={20}
            className={cn('text-primary-foreground animate-spin', confirmLabelClassName)}
          />
        )}

        <Text className={cn('font-semibold text-primary-foreground', confirmLabelClassName)}>
          {isLoading ? confirmingLabel : confirmLabel}
        </Text>
      </Button>
    </View>
  );
}

export { AppModal, AppModalContent, AppModalFooter, AppModalHandle, AppModalHeader };
