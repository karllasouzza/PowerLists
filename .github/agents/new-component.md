# New Component Development — PowerLists

Add a new UI component to the PowerLists project following the established React Native + NativeWind + CVA pattern.

## Project Stack

- **React Native** + **Expo** + **NativeWind** 4.1 (Tailwind CSS via `className`)
- **@rn-primitives** — accessible primitive components (Pressable, Dialog, Checkbox, Select, Tabs, etc.)
- **CVA** (`class-variance-authority`) — component variant definitions
- **cn()** — class merging utility at `src/lib/utils.ts` (`clsx` + `tailwind-merge`)
- **@tabler/icons-react-native** — primary icon library (+ `lucide-react-native` as secondary)
- **Platform.select()** — web-specific classes (hover, focus-visible, aria attributes)
- All imports use the `@/` path alias pointing to `src/`

## Step 1: Check If Component Already Exists

**Before building anything**, check the 27 existing components in `src/components/ui/`:

```
src/components/ui/
├── accordion.tsx        ├── alert.tsx           ├── alert-dialog.tsx
├── aspect-ratio.tsx     ├── badge.tsx           ├── button.tsx
├── checkbox.tsx         ├── dialog.tsx          ├── dropdown-menu.tsx
├── fab.tsx              ├── hover-card.tsx      ├── icon.tsx
├── input.tsx            ├── label.tsx           ├── native-only-animated-view.tsx
├── popover.tsx          ├── progress.tsx        ├── select.tsx
├── separator.tsx        ├── skeleton.tsx        ├── tabs.tsx
├── text.tsx             ├── textarea.tsx        ├── toggle.tsx
└── toggle-group.tsx     └── tooltip.tsx
```

**Decision:**

- Component exists → import and use it directly
- Component doesn't exist in `src/components/ui/` but is a primitive → check `@rn-primitives` (already installed: accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, hover-card, label, popover, select, separator, tabs, toggle, tooltip)
- Needs a new shared component → go to Step 2 (build in `src/components/ui/`)
- Feature-specific component → build in `src/features/[feature]/components/`

## Step 2: Check @rn-primitives (for new UI primitives)

If the component needs an accessible primitive that isn't in `src/components/ui/` yet, check the already-installed @rn-primitives packages:

`@rn-primitives/accordion`, `@rn-primitives/alert-dialog`, `@rn-primitives/avatar`, `@rn-primitives/checkbox`, `@rn-primitives/dialog`, `@rn-primitives/dropdown-menu`, `@rn-primitives/hover-card`, `@rn-primitives/label`, `@rn-primitives/popover`, `@rn-primitives/select`, `@rn-primitives/separator`, `@rn-primitives/tabs`, `@rn-primitives/toggle`, `@rn-primitives/tooltip`.

Use an `@rn-primitives` package as the headless foundation, then layer on NativeWind styling — this is exactly how all existing `src/components/ui/` components are built.

## Step 3: Build the Component

### Standard Component Pattern (CVA + NativeWind + Platform.select)

All shared UI components follow this exact pattern. Reference `src/components/ui/button.tsx` as the canonical example:

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

### Key Styling Rules

```tsx
// CORRECT — NativeWind className, semantic tokens
<View className="bg-background border border-border rounded-lg p-4" />
<Text className="text-foreground text-sm font-medium" />
<Pressable className="bg-primary active:bg-primary/90 rounded-md px-4 py-2" />

// NEVER — no StyleSheet.create for new code
// const styles = StyleSheet.create({ ... }); ❌
```

### Icon Usage

Icons come from `@tabler/icons-react-native`. Use the `Icon` wrapper at `src/components/ui/icon.tsx` for NativeWind `className` support:

```tsx
import { Icon } from '@/components/ui/icon';
import { IconSearch, IconPlus, IconTrash } from '@tabler/icons-react-native';

// With the Icon wrapper (supports className):
<Icon as={IconSearch} className="text-primary" size={20} />

// Direct usage (no className support, use color prop):
<IconPlus size={24} color="#000" />
```

Available Tabler icon naming: `Icon[Name]` — e.g., `IconHome`, `IconUser`, `IconSettings`, `IconArrowLeft`, `IconCheck`.

### Using cssInterop for Custom NativeWind Bridges

If you need NativeWind `className` on a component that doesn't support it natively:

```tsx
import { cssInterop } from 'nativewind';
import { SomeComponent } from 'some-library';

cssInterop(SomeComponent, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: true, width: 'size', height: 'size' },
  },
});
```

## Step 4: File Location and Exports

**Shared UI component** (reusable across features):

```
src/components/ui/[component-name].tsx
```

**Feature-specific component** (only used within one feature):

```
src/features/[feature-name]/components/[component-name].tsx
```

**Export from the nearest index.ts:**

```ts
// src/features/[feature]/index.ts
export { MyFeatureComponent } from './components/[component-name]';
export type { ComponentProps } from './components/[component-name]';
```

## Step 5: Using the Component

Import using the `@/` alias — never use relative paths that go more than one level up:

```tsx
// From shared UI:
import { MyComponent } from '@/components/ui/[component-name]';

// From feature components:
import { MyFeatureComponent } from '@/features/[feature]';
```

## Step 6: Verify in a Feature Screen

Test the component by using it in an existing feature screen (e.g., `src/features/lists/page.tsx`). Run the app:

```bash
yarn android   # test on Android
yarn ios       # test on iOS
yarn web       # test on web
```

Verify in both **light mode** and **dark mode** (toggle via `useColorScheme` from `nativewind`).

---

## Component Showcase Pattern (dev-only)

For testing variants visually, add a temporary dev screen:

```tsx
// src/app/(authenticated)/dev-showcase.tsx (dev only — remove before shipping)
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { MyComponent } from '@/components/ui/[component-name]';

export default function DevShowcaseScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-4 gap-4">
      <View className="gap-2">
        <Text className="text-muted-foreground text-xs font-medium uppercase">Variantes</Text>
        <MyComponent variant="default">Padrão</MyComponent>
        <MyComponent variant="outline">Contorno</MyComponent>
        <MyComponent variant="ghost" size="sm">Fantasma pequeno</MyComponent>
        <MyComponent variant="destructive">Destrutivo</MyComponent>
      </View>
    </ScrollView>
  );
}
```

> All user-visible strings must be in **Portuguese (Brazil)**.

---

## Directory Structure

```
src/
├── components/
│   ├── ui/                         # Shared UI primitives (27 components)
│   │   ├── button.tsx              # Canonical component pattern reference
│   │   ├── icon.tsx                # Icon wrapper with cssInterop
│   │   └── [new-component].tsx     # New shared component goes here
│   └── molecules/                  # Composed molecules (app-modal, circular-carousel)
└── features/
    └── [feature]/
        └── components/             # Feature-specific components
            └── [component].tsx
```

---

## Output

- Component created at `src/components/ui/[name].tsx` or `src/features/[feature]/components/[name].tsx`
- Exported from nearest `index.ts`
- All variants implemented and verified visually on device
- No `StyleSheet.create()` used
- All user-facing strings in Portuguese (Brazil)

---

## Notes

- **Extend, don't rebuild** — compose existing `src/components/ui/` components before building from scratch
- **Use @rn-primitives** as the accessible headless base for interactive primitives (dialog, select, checkbox, etc.)
- **`Platform.select()`** is required for web-only interactions (hover, focus-visible, aria)
- **Active states** use `active:` prefix (React Native press) not `hover:` (which is web-only)
- **Never use HTML elements** (`div`, `span`, `button`) — always React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`)
- **Import alias** `@/` points to `src/` — always use it
