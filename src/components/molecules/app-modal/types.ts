import type * as DialogPrimitive from '@rn-primitives/dialog';
import type React from 'react';
import type { ViewProps } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export type AppModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export type AppModalContentProps = DialogPrimitive.ContentProps &
  React.RefAttributes<DialogPrimitive.ContentRef> & {
    portalHost?: string;
  };

export type AppModalHeaderProps = ViewProps & {
  title: string;
  titleClassName?: string;
};

export type AppModalFooterProps = {
  onCancel: () => void;
  cancelLabel?: string;
  onConfirm: () => void;
  confirmLabel: string;
  confirmingLabel?: string;
  confirmVariant?: 'default' | 'destructive';
  confirmButtonClassName?: string;
  confirmLabelClassName?: string;
  isLoading?: boolean;
  isConfirmDisabled?: boolean;
};

export type AppModalContextType = { open: boolean; onOpenChange: (open: boolean) => void };

export type AppModalDragContextType = {
  translateY: SharedValue<number>;
  close: () => void;
};
