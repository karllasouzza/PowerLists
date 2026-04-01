import { cn } from '@/lib/utils';
import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import React from 'react';
import { Platform } from 'react-native';

const RadioGroup = React.forwardRef<
  RadioGroupPrimitive.RootRef,
  React.ComponentProps<typeof RadioGroupPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return <RadioGroupPrimitive.Root ref={ref} className={cn('gap-3', className)} {...props} />;
});

const RadioGroupItem = React.forwardRef<
  RadioGroupPrimitive.ItemRef,
  React.ComponentProps<typeof RadioGroupPrimitive.Item> & { hideIndicator?: boolean }
>(function RadioGroupItem({ className, children, hideIndicator = false, ...props }, ref) {
  const hasChildren = children !== undefined && children !== null;
  const primitiveChildren = children as unknown as React.ReactNode;

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        hideIndicator
          ? 'aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5'
          : 'border-input dark:bg-input/30 aspect-square size-4 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-black/5',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        props.disabled && 'opacity-50',
        className,
      )}
      {...props}>
      {!hideIndicator && !hasChildren ? (
        <RadioGroupPrimitive.Indicator className="bg-primary size-2 rounded-full" />
      ) : (
        primitiveChildren
      )}
    </RadioGroupPrimitive.Item>
  );
});

RadioGroup.displayName = 'RadioGroup';
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
