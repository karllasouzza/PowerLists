# Copilot Instructions – PowerLists

## Commands

```bash
yarn start          # Expo dev server
yarn android        # Run on Android
yarn ios            # Run on iOS
yarn web            # Run on web
yarn lint           # ESLint + Prettier check
yarn format         # Auto-fix lint and formatting
yarn prebuild       # Generate native android/ and ios/ folders
```

No test suite is configured.

## Architecture

**Expo Router** (file-based routing) lives in `src/app/`. Auth state drives a `Stack.Protected` guard: unauthenticated users see `login`, `create-account`, `request-password-recovery`, `password-recovery`; authenticated users land inside `(authenticated)/` with bottom-tab navigation (Lists, Explore, Saved, Account) and a nested stack for `/lists/[id]`.

**Feature modules** live in `src/features/`. Each feature follows this structure:
```
feature/
├── page.tsx          # Screen component (wired to Expo Router)
├── index.ts          # Public exports
├── types.ts
├── hooks/            # Feature-specific hooks (e.g. useListPageLogics.ts)
├── components/
├── modals/
└── utils/            # Validation, filtering, formatting helpers
```

**Shared UI** lives in `src/components/ui/` (primitives built on `@rn-primitives`) and `src/components/molecules/`.

**Data layer** lives in `src/data/`:
- `states/` — Legend App observable stores (`lists.ts`, `list-items.ts`, `profile.ts`, `auth.ts`)
- `actions/` — Supabase mutations
- `storage.ts` — MMKV encrypted local storage
- `database.ts` — Custom sync config (Legend App ↔ Supabase)
- `session-store.ts` — Session management

**Services** live in `src/services/` (sync, auth, notifications).

## State Management — Legend App (`@legendapp/state`)

All global state is observable. Follow this pattern consistently:

```tsx
// Define state (src/data/states/)
export const lists$ = observable(customSynced({ /* Supabase config */ }));

// Read in components — wrap with observer() or use useValue()
const Component = observer(() => {
  const lists = useValue(lists$.get());
  return <View />;
});

// Write
lists$[id].set(newValue);
lists$[id].update(prev => ({ ...prev, name: 'new' }));
```

Use `useState` only for local UI state (modal open/close, search query, etc.).

## Styling — NativeWind (Tailwind CSS)

Use `className` props everywhere. Never use `StyleSheet.create` for new code unless the style cannot be expressed with Tailwind.

```tsx
<View className="flex-1 bg-background px-4" />
```

Component variants use **CVA** (`class-variance-authority`):
```tsx
const buttonVariants = cva('base-classes', {
  variants: { variant: { default: '...', destructive: '...' } },
});
```

Merge classes with `cn()` (from `src/lib/utils.ts`, wraps `clsx` + `tailwind-merge`):
```tsx
<View className={cn('base', condition && 'extra', className)} />
```

Theme colors are CSS HSL variables defined in `src/css/`. Custom palette: `moss-green`, `beige`, `bright-snow`, `mint-cream`, `hunter-green`. Dark mode is supported via CSS variable switching.

## Forms

Use React Hook Form + Zod. Derive TypeScript types from the schema:

```tsx
const schema = z.object({ name: z.string().min(3) });
type FormData = z.infer<typeof schema>;

const { control, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

## Supabase & Data Sync

The Supabase client is in `src/lib/supabase/`. Database column names are `snake_case`; TypeScript uses `camelCase`. Use the helpers in `src/data/` or `src/features/*/utils/`:
- `convertFromSupabaseFormat()` — snake_case → camelCase
- `convertToSupabaseFormat()` — camelCase → snake_case

Legend App handles automatic bidirectional sync (Supabase ↔ MMKV local storage) for offline-first support. Prefer updating the observable store over calling Supabase directly from components.

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `list-create-modal.tsx`, `use-list-page-logics.ts` |
| Components | `PascalCase` | `CardList`, `ListCreateModal` |
| Hooks | `use` prefix | `useListPageLogics`, `useAuth` |
| Observables | `$` suffix | `lists$`, `profile$` |
| Prop types | `Props` suffix | `type CardListProps = { ... }` |

## TypeScript

- Strict mode is enabled.
- Path alias: `@/*` → `src/*`, `/assets/*` → `assets/*`.
- Use `z.infer<typeof schema>` for form and API data types.
- Supabase-generated types live in `src/lib/supabase/types`.

## UI Primitives

Prefer `@rn-primitives` components (Dialog, Dropdown, Tabs, Checkbox, etc.) from `src/components/ui/` over building from scratch. Toast notifications use `sonner-native`'s `showToast()` (imported from `src/services/`). Icons come from `@tabler/icons-react-native`.

## App Language

All user-facing strings are in **Portuguese (Brazil)**. `languagepacks.json` exists at the root but is currently empty — i18n is not yet implemented.
