---
name: new-screen-builder
description: Build new screens following PowerLists feature module pattern: Expo Router + NativeWind + Legend App state + @rn-primitives. Use when creating new screens, adding features, or implementing UI designs.
---

# New Screen Builder

## Instructions

Follow this complete workflow to build a new screen in PowerLists:

### 1. Analyze the Design

- Identify layout structure (sections, grid, sticky elements, scroll behavior)
- Break down UI sections top-to-bottom by purpose
- Determine content hierarchy (title, main content, CTAs, modals)

### 2. Map Visual Elements to Components

Use existing components from `src/components/ui/` or `@rn-primitives`:
- Screen header with search → `TopBar` (`@/components/top-bar`)
- Card list item → Custom feature component (`src/features/[name]/components/`)
- Skeleton loading → `Skeleton` (`@/components/ui/skeleton`)
- Floating action button → `Fab` (`@/components/ui/fab`)
- Create/edit/delete modal → `Dialog` (`@/components/ui/dialog`)
- Form input → `Input` + `Label` (`@/components/ui/input`)
- Confirmation dialog → `AlertDialog` (`@/components/ui/alert-dialog`)
- Status chip/tag → `Badge` (`@/components/ui/badge`)
- Tab navigation → `Tabs` (`@/components/ui/tabs`)
- Checkbox → `Checkbox` (`@/components/ui/checkbox`)
- Dropdown → `DropdownMenu` (`@/components/ui/dropdown-menu`)
- Separator → `Separator` (`@/components/ui/separator`)
- Icon → `Icon` wrapper (`@/components/ui/icon`)
- Optimized list → `LegendList` (`@legendapp/list`)
- Progress bar → `Progress` (`@/components/ui/progress`)

### 3. Create Feature Module Structure

```
src/features/[feature-name]/
├── page.tsx              # Screen component (imported by Expo Router screen file)
├── index.ts              # Public exports from this feature
├── types.ts              # TypeScript interfaces for this feature's data
├── hooks/
│   └── use-[feature]-page-logics.ts  # Business logic: state, event handlers
├── components/
│   └── [component-name].tsx          # Feature-specific presentational components
├── modals/
│   ├── [entity]-create-modal.tsx     # CRUD modals using Dialog from @rn-primitives
│   ├── [entity]-update-modal.tsx
│   ├── [entity]-delete-modal.tsx
│   └── index.ts
└── utils/
    └── [entity]-filters.ts           # Filtering, formatting, validation helpers
```

### 4. Create Expo Router Entry

Create thin wrapper in `src/app/(authenticated)/[screen-name].tsx`:

```tsx
// src/app/(authenticated)/[screen-name].tsx
import { FeatureNameScreen } from '@/features/[feature-name]';
export default FeatureNameScreen;
```

### 5. Define Data Structure

Create `src/features/[feature]/types.ts` with interfaces and `src/data/states/[entity].ts` with observable state following the pattern in `src/data/states/lists.ts`.

### 6. Build Business Logic Hook

Create `src/features/[feature]/hooks/use-[feature]-page-logics.ts` following the pattern in `src/features/lists/hooks/use-list-page-logics.ts`.

### 7. Build Screen Component

Create `src/features/[feature]/page.tsx` following the pattern in `src/features/lists/page.tsx`, using `observer()` HOC and proper imports.

### 8. Build CRUD Modals

Create modals in `src/features/[feature]/modals/` using `Dialog`, React Hook Form, Zod validation, and Portuguese (Brazil) strings.

### 9. Register Navigation

- For bottom tabs: add to `src/app/(authenticated)/_layout.tsx`
- For stack screens: create appropriate route files
- Set screen config with `Stack.Screen` options

### 10. Apply NativeWind Styling

Use semantic tokens from `src/css/global.css` via Tailwind classes:
- Backgrounds: `bg-background`, `bg-card`, `bg-muted`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Interactive: `bg-primary`, `border border-border`
- Dark mode: automatic via CSS variable tokens

### 11. Integrate with Supabase

- Mutations go through `src/data/actions/[entity].ts`
- DB columns are `snake_case` → use `convertToSupabaseFormat()` before writing
- Reading → use `convertFromSupabaseFormat()` for `camelCase` objects
- Never call Supabase directly from components — always go through observable store

## Verification Checklist

Before submitting:
- [ ] All user-visible strings are in Portuguese (Brazil)
- [ ] Feature module follows exact directory structure
- [ ] Expo Router entry is a thin wrapper importing from feature module
- [ ] Observable state follows pattern in `src/data/states/lists.ts`
- [ ] Business logic hook uses `useValue()` and proper observable patterns
- [ ] Screen component uses `observer()` HOC
- [ ] All styling uses NativeWind `className`, no `StyleSheet.create()`
- [ ] All icons use `@tabler/icons-react-native`
- [ ] Toast notifications use `showToast()` from `src/services/`
- [ ] Dark mode works automatically via CSS variable tokens
- [ ] Offline-first functionality works (Legend App + MMKV)
- [ ] Proper error handling and validation implemented
- [ ] All `@/` aliases used instead of deep relative paths

## Additional Resources

- For complete implementation examples, see `src/features/lists/`
- For styling tokens, see `src/css/global.css`
- For Tailwind configuration, see `tailwind.config.js`
- For Supabase integration patterns, see `src/data/states/lists.ts` and `src/data/actions/lists.ts`