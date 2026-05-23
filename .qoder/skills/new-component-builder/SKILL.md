---
name: new-component-builder
description: Add new UI components to PowerLists following React Native + Expo + NativeWind + CVA pattern. Use when creating shared UI components in src/components/ui/ or feature-specific components in src/features/[feature]/components/.
---

# New Component Builder

## Purpose
Add new UI components to the PowerLists project following the established React Native + Expo + NativeWind + CVA pattern with proper accessibility and platform-specific considerations.

## Input Requirements
- Component name and purpose
- Understanding of current PowerLists stack: React Native + Expo + NativeWind 4.1, @rn-primitives, CVA, @tabler/icons-react-native

## Workflow Steps

### 1. Check If Component Already Exists
- Check the 27 existing components in `src/components/ui/`
- Check if component exists in `@rn-primitives` packages (already installed)
- Decision flow:
  - Component exists → import and use directly
  - Component doesn't exist but is a primitive → use appropriate `@rn-primitives` package
  - Needs new shared component → build in `src/components/ui/`
  - Feature-specific component → build in `src/features/[feature]/components/`

### 2. Build the Component Using Standard Pattern
- Use CVA (`class-variance-authority`) for variant definitions
- Use NativeWind `className` for styling (no `StyleSheet.create()`)
- Use `Platform.select()` for web-only classes (hover, focus-visible, aria attributes)
- Use `active:` prefix for React Native press states (not `hover:`)
- Import using `@/` alias pointing to `src/`

### 3. Component Structure Template
```tsx
// src/components/ui/[component-name].tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable, View } from 'react-native';
// For accessible primitives, import from @rn-primitives:
// import * as DialogPrimitive from '@rn-primitives/dialog';

const componentVariants = cva(
  // Base classes applied to all variants:
  cn(
    'flex-row items-center justify-center rounded-md',
    Platform.select({
      // Web-only classes (hover, focus-visible, etc.):
      web: 'outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none',
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary active:bg-primary/90',
          Platform.select({ web: 'hover:bg-primary/90' }),
        ),
        outline: cn(
          'border border-border bg-background active:bg-accent',
          Platform.select({ web: 'hover:bg-accent' }),
        ),
        ghost: cn(
          'active:bg-accent',
          Platform.select({ web: 'hover:bg-accent' }),
        ),
        destructive: cn(
          'bg-destructive active:bg-destructive/90',
          Platform.select({ web: 'hover:bg-destructive/90' }),
        ),
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 gap-1.5 rounded-md',
        lg: 'h-11 px-6 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ComponentProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof componentVariants> & {
    className?: string;
    // Add component-specific props here
  };

const MyComponent = ({ variant, size, className, ...props }: ComponentProps) => {
  return (
    <Pressable
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  );
};

export { MyComponent, componentVariants };
export type { ComponentProps };
```

### 4. Icon Usage
- Use `@tabler/icons-react-native` icons with `Icon` wrapper from `src/components/ui/icon.tsx`
- Available naming: `Icon[Name]` (e.g., `IconHome`, `IconUser`, `IconSettings`)

### 5. File Location and Exports
- Shared UI component: `src/components/ui/[component-name].tsx`
- Feature-specific component: `src/features/[feature-name]/components/[component-name].tsx`
- Export from nearest `index.ts` file

### 6. Component Usage
- Import using `@/` alias: `import { MyComponent } from '@/components/ui/[component-name]'`
- Test in existing feature screens (e.g., `src/features/lists/page.tsx`)
- Verify in both light and dark modes

## Verification Checklist
- [ ] Component checked against existing `src/components/ui/` components
- [ ] Appropriate `@rn-primitives` used when available
- [ ] No `StyleSheet.create()` used
- [ ] All styling via NativeWind `className` with semantic tokens
- [ ] `Platform.select()` used for web-specific interactions
- [ ] `active:` states used instead of `hover:` for press states
- [ ] Proper icon usage with `@tabler/icons-react-native`
- [ ] All user-facing strings in Portuguese (Brazil)
- [ ] Component verified visually on Android, iOS, and web
- [ ] Component works in both light and dark modes

## Additional Resources
- For complete component development documentation, see [.github/agents/new-component.md](/home/karllasouzza/Projects/me/PowerLists/.github/agents/new-component.md)
