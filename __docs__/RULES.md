# PowerLists Project Rules

This document outlines the core development rules and conventions for the PowerLists project.

## Development Commands

| Command | Purpose |
|---------|---------|
| `yarn start` | Start Expo dev server |
| `yarn android` | Run on Android device/emulator |
| `yarn ios` | Run on iOS device/simulator |
| `yarn web` | Run on web browser |
| `yarn lint` | Run ESLint + Prettier checks |
| `yarn format` | Auto-fix lint and formatting issues |
| `yarn prebuild` | Generate native android/ and ios/ folders |

## Architecture Rules

### Routing
- Use **Expo Router** (file-based routing) in `src/app/`
- Auth state drives a `Stack.Protected` guard:
  - Unauthenticated users: `login`, `create-account`, `request-password-recovery`, `password-recovery`
  - Authenticated users: `(authenticated)/` with bottom-tab navigation (Lists, Explore, Saved, Account) and nested stack for `/lists/[id]`

### Feature Organization
- Feature modules live in `src/features/`
- Each feature must follow this structure:
  - `page.tsx`: Screen component (wired to Expo Router)
  - `index.ts`: Public exports
  - `types.ts`: TypeScript types
  - `hooks/`: Feature-specific hooks (e.g., `useListPageLogics.ts`)
  - `components/`: Feature-specific components
  - `modals/`: Feature-specific modals
  - `utils/`: Validation, filtering, formatting helpers

### UI Components
- Shared UI lives in `src/components/ui/` (primitives built on `@rn-primitives`) and `src/components/molecules/`
- Prefer `@rn-primitives` components (Dialog, Dropdown, Tabs, Checkbox, etc.) over building from scratch
- Toast notifications use `sonner-native`'s `showToast()` (imported from `src/services/`)
- Icons come from `@tabler/icons-react-native`

## State Management Rules

### Legend App (`@legendapp/state`)
- All global state is observable
- Define state in `src/data/states/` using `observable()`
- Read in components by wrapping with `observer()` or using `useValue()`
- Write to observables using `.set()` or `.update()` methods
- Use `useState` only for local UI state (modal open/close, search query, etc.)

## Styling Rules

### NativeWind (Tailwind CSS)
- Use `className` props everywhere
- Never use `StyleSheet.create` for new code unless the style cannot be expressed with Tailwind
- Component variants use **CVA** (`class-variance-authority`)
- Merge classes with `cn()` (from `src/lib/utils.ts`, wraps `clsx` + `tailwind-merge`)
- Theme colors are CSS HSL variables defined in `src/css/`
- Custom palette: `moss-green`, `beige`, `bright-snow`, `mint-cream`, `hunter-green`
- Dark mode is supported via CSS variable switching

## Forms Rules

- Use React Hook Form + Zod
- Derive TypeScript types from the schema using `z.infer<typeof schema>`
- Always use form validation schemas

## Data Layer Rules

### Supabase & Data Sync
- Supabase client is in `src/lib/supabase/`
- Database column names are `snake_case`; TypeScript uses `camelCase`
- Use helpers in `src/data/` or `src/features/*/utils/`:
  - `convertFromSupabaseFormat()` — snake_case → camelCase
  - `convertToSupabaseFormat()` — camelCase → snake_case
- Legend App handles automatic bidirectional sync (Supabase ↔ MMKV local storage) for offline-first support
- Prefer updating the observable store over calling Supabase directly from components

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `list-create-modal.tsx`, `use-list-page-logics.ts` |
| Components | `PascalCase` | `CardList`, `ListCreateModal` |
| Hooks | `use` prefix | `useListPageLogics`, `useAuth` |
| Observables | `$` suffix | `lists$`, `profile$` |
| Prop types | `Props` suffix | `type CardListProps = { ... }` |

## TypeScript Rules

- Strict mode is enabled
- Path alias: `@/*` → `src/*`, `/assets/*` → `assets/*`
- Use `z.infer<typeof schema>` for form and API data types
- Supabase-generated types live in `src/lib/supabase/types`

## Localization Rules

- All user-facing strings are in **Portuguese (Brazil)**
- `languagepacks.json` exists at the root but is currently empty — i18n is not yet implemented

## Testing Rules

- Jest configuration exists in `jest.config.cjs` and `jest.behavior.config.cjs`
- There is no dedicated `yarn test` script
- Use targeted execution when needed: `npx jest --config jest.config.cjs <path-or-pattern>`

## Code Quality Rules

- Follow Prettier formatting rules (printWidth 100, singleQuote, bracketSameLine)
- Use ESLint for code quality checks
- All files must pass both linting and formatting checks before merging

## Git Workflow Rules

- Use conventional commit messages
- Branch names should follow the pattern `feature/<feature-name>`, `fix/<issue-name>`, or `chore/<task-name>`
- Always create pull requests for code changes
- PR descriptions must reference related issues and include a summary of changes

## Security Rules

- Never hardcode secrets or credentials in source code
- Use environment variables for configuration
- Validate all user inputs
- Sanitize outputs to prevent XSS attacks
- Follow secure coding practices for mobile applications

## Performance Rules

- Optimize list rendering using appropriate techniques (FlatList, FlashList, etc.)
- Implement proper image loading and caching
- Minimize re-renders through memoization and proper state management
- Profile performance regularly using Expo DevTools

## Accessibility Rules

- Ensure all interactive elements have proper accessibility labels
- Support screen readers and other assistive technologies
- Follow WCAG 2.1 AA guidelines
- Test with accessibility tools and real users

## Documentation Rules

- Document all public APIs and complex logic
- Keep README.md and other documentation up to date
- Add JSDoc comments for exported functions and classes
- Maintain accurate type definitions

## Review Process Rules

- All code changes require peer review before merging
- PRs must pass all CI checks (linting, formatting, tests)
- Address all review comments before merging
- Maintain high code quality standards in all reviews