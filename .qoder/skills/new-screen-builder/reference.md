# New Screen Builder Reference

## Complete Implementation Examples

### Feature Module Structure Example

```
src/features/lists/
├── page.tsx              # Screen component
├── index.ts              # Public exports
├── types.ts              # TypeScript interfaces
├── hooks/
│   └── use-list-page-logics.ts  # Business logic
├── components/
│   └── card-list.tsx          # Presentational components
├── modals/
│   ├── list-create-modal.tsx     # CRUD modals
│   ├── list-update-modal.tsx
│   ├── list-delete-modal.tsx
│   └── index.ts
└── utils/
    └── list-filters.ts           # Helpers
```

### Observable State Pattern (src/data/states/lists.ts)

```ts
import { observable } from '@legendapp/state';
import { supabaseSynced, getCurrentUserId } from '../database';
import { supabase } from '@/lib/supabase';

export const lists$ = observable(
  supabaseSynced({
    initial: {} as Record<string, any>,
    supabase,
    collection: 'lists',               // Supabase table (snake_case)
    select: (from: any) =>
      from.select('id,profile_id,title,created_at,updated_at'),
    filter: (select: any) => select.eq('profile_id', getCurrentUserId()),
    actions: ['read', 'create', 'update', 'delete'],
    persist: { name: 'lists', retrySync: true },
    realtime: {
      get filter() {
        return `profile_id=eq.${getCurrentUserId()}`;
      },
    },
  }),
);
```

### Business Logic Hook Pattern (src/features/lists/hooks/use-list-page-logics.ts)

```ts
// src/features/lists/hooks/use-list-page-logics.ts
import { useMemo, useState } from 'react';
import { useValue } from '@legendapp/state/react';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { lists$ } from '@/data/states/lists';
import type { ListEntity } from '../types';

export const useListPageLogics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>();

  // Read from observable (triggers re-render on change)
  const rawData = useValue(lists$.get());
  const isLoading = rawData === null || rawData === undefined;
  const items = convertFromSupabaseFormat(Object.values(rawData || {})) as ListEntity[];

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

### Screen Component Pattern (src/features/lists/page.tsx)

```tsx
// src/features/lists/page.tsx
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { observer } from '@legendapp/state/react';

import { TopBar } from '@/components/top-bar';
import { Fab } from '@/components/ui/fab';
import { IconPlus } from '@tabler/icons-react-native';

import type { ListEntity } from './types';
import { CardList } from './components/card-list';
import { CardListSkeletonList } from './components/card-list-skeleton';
import { ListCreateModal, ListUpdateModal, ListDeleteModal } from './modals';
import { useListPageLogics } from './hooks/use-list-page-logics';

const ESTIMATED_ITEM_SIZE = 96;

const ListsScreen = observer(() => {
  const {
    items, isLoading, searchQuery, setSearchQuery,
    isCreateOpen, setCreateOpen,
    isUpdateOpen, setUpdateOpen,
    isDeleteOpen, setDeleteOpen,
    activeId, handleOpenCreate, handleOpenUpdate, handleOpenDelete,
  } = useListPageLogics();

  const renderItem = useCallback(
    (item: ListEntity) => (
      <CardList item={item} onEdit={handleOpenUpdate} onDelete={handleOpenDelete} />
    ),
    [handleOpenUpdate, handleOpenDelete],
  );

  return (
    <View className="flex-1 bg-background">
      <TopBar
        title="Minhas Listas"
        showSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Procurar listas..."
      />

      {isLoading ? (
        <CardListSkeletonList />
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

      <ListCreateModal open={isCreateOpen} onClose={() => setCreateOpen(false)} />
      <ListUpdateModal open={isUpdateOpen} onClose={() => setUpdateOpen(false)} id={activeId} />
      <ListDeleteModal open={isDeleteOpen} onClose={() => setDeleteOpen(false)} id={activeId} />
    </View>
  );
});

export { ListsScreen };
```

### CRUD Modal Pattern (src/features/lists/modals/list-create-modal.tsx)

```tsx
// src/features/lists/modals/list-create-modal.tsx
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
import { lists$ } from '@/data/states/lists';
import { generateId } from '@/data/utils';

const schema = z.object({
  title: z.string().min(3, 'Título precisa ter pelo menos 3 caracteres'),
});
type FormData = z.infer<typeof schema>;

interface ListCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function ListCreateModal({ open, onClose }: ListCreateModalProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const id = generateId();
    lists$[id].set({ id, title: data.title, created_at: new Date().toISOString() });
    showToast({ title: 'Lista criada com sucesso!' });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova lista</DialogTitle>
        </DialogHeader>
        <View className="gap-3 py-2">
          <Label>Título</Label>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input value={value} onChangeText={onChange} placeholder="Nome da lista" />
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

## Key Technical Requirements

### Portuguese (Brazil) Localization
All user-visible strings must be in Portuguese (Brazil):
- Labels: "Título", "Descrição", "Criar", "Atualizar", "Excluir"
- Placeholders: "Nome da lista", "Procurar listas..."
- Error messages: "Título precisa ter pelo menos 3 caracteres"
- Toast notifications: "Lista criada com sucesso!"

### NativeWind Styling Guidelines
- Use semantic tokens: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`
- Custom palette: `bg-moss-green-{50–950}`, `bg-beige-{50–950}`, `bg-mint-cream-{50–950}`, `bg-hunter-green-{50–950}`, `bg-bright-snow-{50–950}`
- Never use `StyleSheet.create()` - all styling via `className`
- Dark mode works automatically via CSS variable tokens

### Legend App State Patterns
- Always wrap main screen components with `observer()` HOC
- Use `useValue()` to subscribe to observable values in hooks/components
- Never call Supabase directly from components - always go through observable store
- Offline-first: Legend App + MMKV makes the app work without connectivity

### Expo Router Integration
- Bottom tabs: add to `src/app/(authenticated)/_layout.tsx`
- Stack screens: create appropriate route files like `src/app/(authenticated)/lists/[id].tsx`
- Screen config: use `Stack.Screen` options for titles and header configuration
- Always use `@/` alias pointing to `src/` - never deep relative paths