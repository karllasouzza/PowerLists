# New Screen Development — PowerLists

Build a new screen following the feature module pattern: Expo Router + NativeWind + Legend App state + @rn-primitives.

## Input

[SCREENSHOT, FIGMA URL, OR DESCRIPTION]

## Project Stack

- **React Native** 0.83 + **Expo** 55 + **Expo Router** (file-based routing in `src/app/`)
- **NativeWind** 4.1 — Tailwind CSS via `className` on React Native primitives
- **@legendapp/state** — observable state with Supabase sync (offline-first)
- **@rn-primitives** + `src/components/ui/` — accessible UI components
- **React Hook Form** + **Zod** — form handling and validation
- **@tabler/icons-react-native** — icons
- **sonner-native** → `showToast()` from `src/services/` — toast notifications
- All user-visible strings in **Portuguese (Brazil)**

## Feature Module Structure

Every screen lives as a feature module. Follow this exact folder layout:

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

The Expo Router screen file is a thin wrapper:

```tsx
// src/app/(authenticated)/[screen-name].tsx
import { FeatureNameScreen } from '@/features/[feature-name]';
export default FeatureNameScreen;
```

## Workflow

### 1. Analyze the Design Visually

Look at the screenshot/reference and identify:

**Layout Structure:**

- How many main sections? (header, list, FAB, bottom sheet?)
- Grid: single column, cards, or two-column?
- Sticky elements (top bar, FAB)?
- Pull-to-refresh or infinite scroll?

**UI Sections (top to bottom):**

Break down each section by purpose: "TopBar with search", "Card list", "Empty state", "FAB button", "Create modal"

**Content Hierarchy:**

- Primary heading / screen title
- Main content (list, grid, form)
- CTAs (FAB, buttons)
- Modals / bottom sheets

### 2. Map Visual Elements to Components

Map each UI element to an existing component from `src/components/ui/` or @rn-primitives:

| Visual Element | Component | Import |
| --- | --- | --- |
| Screen header with search | `TopBar` | `@/components/top-bar` |
| Card list item | Custom feature component | `src/features/[name]/components/` |
| Skeleton loading | `Skeleton` | `@/components/ui/skeleton` |
| Floating action button | `Fab` | `@/components/ui/fab` |
| Create/edit/delete modal | `Dialog` | `@/components/ui/dialog` |
| Form input | `Input` + `Label` | `@/components/ui/input` |
| Confirmation dialog | `AlertDialog` | `@/components/ui/alert-dialog` |
| Status chip/tag | `Badge` | `@/components/ui/badge` |
| Tab navigation | `Tabs` | `@/components/ui/tabs` |
| Checkbox | `Checkbox` | `@/components/ui/checkbox` |
| Dropdown | `DropdownMenu` | `@/components/ui/dropdown-menu` |
| Separator | `Separator` | `@/components/ui/separator` |
| Icon | `Icon` wrapper | `@/components/ui/icon` |
| Optimized list | `LegendList` | `@legendapp/list` |
| Progress bar | `Progress` | `@/components/ui/progress` |

> **IMPORTANT:** Prioritize importing from `src/components/ui/` over building new components.

### 3. Define the Feature Module Files

Plan which files to create:

```
Page: [FEATURE NAME]
├── src/app/(authenticated)/[screen-name].tsx    ← router entry (thin wrapper)
└── src/features/[feature-name]/
    ├── page.tsx                     ← actual screen UI
    ├── index.ts                     ← exports page component
    ├── types.ts                     ← data types
    ├── hooks/
    │   └── use-[feature]-page-logics.ts
    ├── components/
    │   └── card-[entity].tsx
    ├── modals/
    │   ├── [entity]-create-modal.tsx
    │   ├── [entity]-update-modal.tsx
    │   ├── [entity]-delete-modal.tsx
    │   └── index.ts
    └── utils/
        └── [entity]-filters.ts
```

### 4. Define the Data Structure

**Types file** (`src/features/[feature]/types.ts`):

```ts
export interface FeatureEntity {
  id: string;
  profileId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntityProps {
  title: string;
}

export interface UpdateEntityProps {
  id: string;
  title?: string;
}
```

**Observable state** (`src/data/states/[entity].ts`) — follow the pattern in `src/data/states/lists.ts`:

```ts
import { observable } from '@legendapp/state';
import { customSynced, getCurrentUserId } from '../database';
import { supabase } from '@/lib/supabase';

export const entity$ = observable(
  customSynced({
    initial: {} as Record<string, any>,
    supabase,
    collection: '[table_name]',               // Supabase table (snake_case)
    select: (from: any) =>
      from.select('id,profile_id,title,created_at,updated_at'),
    filter: (select: any) => select.eq('profile_id', getCurrentUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: '[entity]', retrySync: true },
    realtime: {
      get filter() {
        return `profile_id=eq.${getCurrentUserId()}`;
      },
    },
  }),
);
```

### 5. Build the Business Logic Hook

Follow the pattern in `src/features/lists/hooks/use-list-page-logics.ts`:

```ts
// src/features/[feature]/hooks/use-[feature]-page-logics.ts
import { useMemo, useState } from 'react';
import { useValue } from '@legendapp/state/react';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { entity$ } from '@/data/states/[entity]';
import type { FeatureEntity } from '../types';

export const useFeaturePageLogics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>();

  // Read from observable (triggers re-render on change)
  const rawData = useValue(entity$.get());
  const isLoading = rawData === null || rawData === undefined;
  const items = convertFromSupabaseFormat(Object.values(rawData || {})) as FeatureEntity[];

  const filtered = useMemo(
    () => items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [items, searchQuery],
  );

  const handleOpenCreate = () => setCreateOpen(true);
  const handleOpenUpdate = (id: string) => { setActiveId(id); setUpdateOpen(true); };
  const handleOpenDelete = (id: string) => { setActiveId(id); setDeleteOpen(true); };

  return {
    items: filtered, isLoading,
    searchQuery, setSearchQuery,
    isCreateOpen, setCreateOpen,
    isUpdateOpen, setUpdateOpen,
    isDeleteOpen, setDeleteOpen,
    activeId,
    handleOpenCreate, handleOpenUpdate, handleOpenDelete,
  };
};
```

### 6. Build the Screen Component

Follow the pattern in `src/features/lists/page.tsx`:

```tsx
// src/features/[feature]/page.tsx
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { observer } from '@legendapp/state/react';

import { TopBar } from '@/components/top-bar';
import { Fab } from '@/components/ui/fab';
import { IconPlus } from '@tabler/icons-react-native';

import type { FeatureEntity } from './types';
import { CardEntity } from './components/card-entity';
import { CardEntitySkeletonList } from './components/card-entity-skeleton';
import { EntityCreateModal, EntityUpdateModal, EntityDeleteModal } from './modals';
import { useFeaturePageLogics } from './hooks/use-feature-page-logics';

const ESTIMATED_ITEM_SIZE = 96;

const FeatureNameScreen = observer(() => {
  const {
    items, isLoading, searchQuery, setSearchQuery,
    isCreateOpen, setCreateOpen,
    isUpdateOpen, setUpdateOpen,
    isDeleteOpen, setDeleteOpen,
    activeId, handleOpenCreate, handleOpenUpdate, handleOpenDelete,
  } = useFeaturePageLogics();

  const renderItem = useCallback(
    (item: FeatureEntity) => (
      <CardEntity item={item} onEdit={handleOpenUpdate} onDelete={handleOpenDelete} />
    ),
    [handleOpenUpdate, handleOpenDelete],
  );

  return (
    <View className="flex-1 bg-background">
      <TopBar
        title="Título da Tela"
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Procurar..."
      />

      {isLoading ? (
        <CardEntitySkeletonList />
      ) : (
        <LegendList
          data={items}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={item => item.id}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          contentContainerClassName="px-4 py-2 gap-3"
        />
      )}

      <Fab onPress={handleOpenCreate} className="absolute bottom-6 right-6">
        <IconPlus size={24} className="text-primary-foreground" />
      </Fab>

      <EntityCreateModal open={isCreateOpen} onClose={() => setCreateOpen(false)} />
      <EntityUpdateModal open={isUpdateOpen} onClose={() => setUpdateOpen(false)} id={activeId} />
      <EntityDeleteModal open={isDeleteOpen} onClose={() => setDeleteOpen(false)} id={activeId} />
    </View>
  );
});

export { FeatureNameScreen };
```

### 7. Build CRUD Modals

```tsx
// src/features/[feature]/modals/[entity]-create-modal.tsx
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/services';
import { entity$ } from '@/data/states/[entity]';
import { generateId } from '@/data/utils';

const schema = z.object({
  title: z.string().min(3, 'Título precisa ter pelo menos 3 caracteres'),
});
type FormData = z.infer<typeof schema>;

interface EntityCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function EntityCreateModal({ open, onClose }: EntityCreateModalProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const id = generateId();
    entity$[id].set({ id, title: data.title, created_at: new Date().toISOString() });
    showToast({ title: 'Item criado com sucesso!' });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo item</DialogTitle>
        </DialogHeader>
        <View className="gap-3 py-2">
          <Label>Título</Label>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input value={value} onChangeText={onChange} placeholder="Nome do item" />
            )}
          />
          {errors.title && (
            <Text className="text-destructive text-sm">{errors.title.message}</Text>
          )}
        </View>
        <DialogFooter>
          <Button variant="outline" onPress={onClose}><Text>Cancelar</Text></Button>
          <Button onPress={handleSubmit(onSubmit)}><Text>Criar</Text></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 8. Register the Expo Router Screen

**New bottom tab** — add to `src/app/(authenticated)/_layout.tsx`:

```tsx
<Tabs.Screen
  name="[screen-name]"
  options={{
    title: 'Rótulo da Aba',
    tabBarIcon: ({ focused }) =>
      focused ? <IconNameFilled size={24} /> : <IconName size={24} />,
  }}
/>
```

**Stack screen within authenticated area** — create the file:

```tsx
// src/app/(authenticated)/[screen-name].tsx
import { FeatureNameScreen } from '@/features/[feature-name]';
export default FeatureNameScreen;
```

**Nested detail screen** (e.g., `/lists/[id]`):

```tsx
// src/app/(authenticated)/[entity]/[id].tsx
import { EntityDetailScreen } from '@/features/[feature-name]';
export default EntityDetailScreen;
```

**Screen config** (set inside the screen component):

```tsx
import { Stack } from 'expo-router';
<Stack.Screen options={{ title: 'Título da Tela', headerShown: false }} />
```

### 9. Write Feature index.ts

```ts
// src/features/[feature-name]/index.ts
export { FeatureNameScreen } from './page';
export type { FeatureEntity, CreateEntityProps } from './types';
```

### 10. NativeWind Styling

Use semantic tokens from `src/css/global.css` via Tailwind classes:

```tsx
// Backgrounds
<View className="flex-1 bg-background" />
<View className="bg-card rounded-lg p-4" />
<View className="bg-muted rounded-md p-2" />

// Text
<Text className="text-foreground text-base" />
<Text className="text-muted-foreground text-sm" />
<Text className="text-primary font-semibold" />

// Interactive elements
<Pressable className="bg-primary active:bg-primary/90 rounded-md px-4 py-2" />
<Pressable className="border border-border active:bg-accent rounded-md px-4 py-2" />

// Dark mode: automatic via CSS variable tokens — no extra logic needed
```

Custom palette available: `bg-moss-green-{50–950}`, `bg-beige-{50–950}`, `bg-mint-cream-{50–950}`, `bg-hunter-green-{50–950}`, `bg-bright-snow-{50–950}`.

---

## Supabase Data Integration

Mutations go through `src/data/actions/`. Follow `src/data/actions/lists.ts` as reference:

```ts
// src/data/actions/[entity].ts
import { entity$ } from '@/data/states/[entity]';
import { convertToSupabaseFormat } from '@/lib/supabase/utils';

export const updateEntity = ({ id, ...data }: UpdateEntityProps) => {
  entity$[id].update(prev => ({
    ...prev,
    ...convertToSupabaseFormat(data),
    updated_at: new Date().toISOString(),
  }));
};

export const deleteEntity = (id: string) => entity$[id].delete();
```

Key rules:

- DB columns are `snake_case` → use `convertToSupabaseFormat()` before writing to the store
- Reading from observable → use `convertFromSupabaseFormat()` to get `camelCase` TypeScript objects
- Never call Supabase directly from components — always go through the observable store
- Legend App handles bidirectional sync (Supabase ↔ MMKV) automatically (offline-first)

---

## Directory Structure

```
src/
├── app/
│   └── (authenticated)/
│       ├── _layout.tsx             ← tab/stack navigation config
│       └── [screen-name].tsx       ← router entry (imports feature page)
├── data/
│   ├── states/[entity].ts          ← Legend App observable
│   └── actions/[entity].ts         ← Supabase mutations
└── features/
    └── [feature-name]/
        ├── page.tsx                ← screen UI (observer HOC)
        ├── index.ts                ← public exports
        ├── types.ts
        ├── hooks/use-[feature]-page-logics.ts
        ├── components/card-[entity].tsx
        ├── modals/
        │   ├── [entity]-create-modal.tsx
        │   ├── [entity]-update-modal.tsx
        │   ├── [entity]-delete-modal.tsx
        │   └── index.ts
        └── utils/[entity]-filters.ts
```

---

## Output

- Feature module created at `src/features/[feature-name]/`
- Observable state at `src/data/states/[entity].ts`
- Actions at `src/data/actions/[entity].ts`
- Router entry at `src/app/(authenticated)/[screen-name].tsx`
- Tab registered in `src/app/(authenticated)/_layout.tsx` (if tab screen)
- CRUD modals with `Dialog` + React Hook Form + Zod
- All user-visible strings in Portuguese (Brazil)
- Dark mode works automatically via CSS variable tokens

---

## Notes

- `observer()` HOC is required on any component that reads observables — always wrap the main screen component
- `useValue()` subscribes to observable values inside hooks and components
- Never use HTML elements — always React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`)
- Never use `StyleSheet.create()` — all styling via NativeWind `className`
- `@/` alias points to `src/` — always use it, never deep relative paths
- All user-visible text must be in **Portuguese (Brazil)**: labels, placeholders, error messages, button text, toasts
- Offline-first: Legend App + MMKV makes the app work without connectivity; Supabase syncs in background
