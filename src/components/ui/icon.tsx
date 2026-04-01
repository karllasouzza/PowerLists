import { cn } from '@/lib/utils';
import type { Icon as TablerIcon, IconProps as TablerIconProps } from '@tabler/icons-react-native';
import { cssInterop } from 'nativewind';

type IconProps = TablerIconProps & {
  as: TablerIcon;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
      height: 'size',
      width: 'size',
    },
  },
});

/**
 * A wrapper component for Tabler icons with Nativewind `className` support via `cssInterop`.
 *
 * This component allows you to render any Tabler icon while applying utility classes
 * using `nativewind`. It avoids the need to wrap or configure each icon individually.
 *
 * @component
 * @example
 * ```tsx
 * import { IconArrowRight } from '@tabler/icons-react-native';
 * import { Icon } from '@/registry/components/ui/icon';
 *
 * <Icon as={IconArrowRight} className="text-red-500" size={16} />
 * ```
 *
 * @param {TablerIcon} as - The Tabler icon component to render.
 * @param {string} className - Utility classes to style the icon using Nativewind.
 * @param {number} size - Icon size (defaults to 14).
 * @param {...TablerIconProps} ...props - Additional Tabler icon props passed to the "as" icon.
 */
function Icon({ as: IconComponent, className, size = 14, ...props }: IconProps) {
  return (
    <IconImpl
      as={IconComponent}
      className={cn('text-foreground', className)}
      size={size}
      {...props}
    />
  );
}

export { Icon };
