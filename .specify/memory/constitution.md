<!--
SYNC IMPACT REPORT
==================
Version change:   (template) → 1.0.0
Type of bump:     MAJOR — initial constitution establishment, all content is new.

Modified principles:
  (none — initial population from template)

Added sections:
  - Core Principles (I–V)
  - Technology Constraints
  - Development Workflow & Code Quality
  - Governance

Removed sections:
  (none)

Templates reviewed and status:
  ✅  .specify/templates/plan-template.md
        Constitution Check gate references this file; "constitution file" language is
        already generic. No changes required.
  ✅  .specify/templates/spec-template.md
        Mandatory sections (User Scenarios, Requirements, Success Criteria) align with
        principles. No changes required.
  ✅  .specify/templates/tasks-template.md
        Task phases and parallel markers align with principles. Path conventions section
        already covers the mobile option. No changes required.

Follow-up TODOs:
  (none — all placeholders resolved)
-->

# PowerLists Constitution

## Core Principles

### I. Feature-Module Architecture

Every screen or user-facing capability MUST be implemented as a self-contained
module under `src/features/[feature-name]/`. Each feature module MUST expose its
public API exclusively through an `index.ts` barrel file. Cross-feature communication
MUST route exclusively through the shared data layer (`src/data/`), never through
direct inter-feature imports.

Required layout for every feature:

```text
feature/
├── page.tsx          # Screen component wired to Expo Router
├── index.ts          # Public exports only
├── types.ts
├── hooks/            # Feature-specific hooks
├── components/
├── modals/
└── utils/            # Validation, filtering, formatting
```

Shared, reusable UI primitives belong in `src/components/ui/` (atoms built on
`@rn-primitives`) or `src/components/molecules/` (composed primitives). Placing
reusable UI inside a feature directory is FORBIDDEN.

### II. Observable-First State

All global and shared application state MUST be managed through Legend App
observables (`@legendapp/state`). Calling Supabase directly from a component is
FORBIDDEN. React's `useState` is reserved strictly for ephemeral local UI state
(modal visibility, search query text, loading spinners, etc.).

Rules that MUST be followed:

- Observable stores are defined in `src/data/states/` using `observable()` +
  `customSynced()` and MUST carry the `$` suffix (e.g., `lists$`).
- Components reading observable values MUST wrap with `observer()` or consume
  via `useValue()`.
- Writes MUST go through `.set()` or `.update()` on the observable node.
- New global state MUST NOT be added as plain React context or Zustand/Redux;
  extend `src/data/states/` instead.

### III. NativeWind Styling (NON-NEGOTIABLE)

Styling MUST use NativeWind `className` props throughout the codebase.
`StyleSheet.create` is FORBIDDEN for any new code. If a style genuinely cannot
be expressed with Tailwind utilities, the exception MUST be documented with a
comment explaining why.

Rules:

- Component variants MUST use CVA (`class-variance-authority`).
- Class merging MUST use the `cn()` helper from `src/lib/utils.ts`
  (wraps `clsx` + `tailwind-merge`).
- Theme colors MUST reference CSS HSL design tokens defined in `src/css/`
  (palette: `moss-green`, `beige`, `bright-snow`, `mint-cream`, `hunter-green`).
  Hard-coded hex or rgb values are FORBIDDEN.
- Dark mode MUST be handled via CSS variable switching, never via conditional
  inline styles.

### IV. Type-Safety & Data Contracts

TypeScript strict mode is ALWAYS enabled. No `any` types are permitted without
an explanatory comment and a TODO to remove it.

Contracts:

- Form and API payload types MUST be derived from Zod schemas via
  `z.infer<typeof schema>`. Defining parallel manual types is FORBIDDEN.
- Supabase database columns are `snake_case`; TypeScript variables use `camelCase`.
  The helpers `convertFromSupabaseFormat()` and `convertToSupabaseFormat()` in
  `src/data/` MUST be used at every boundary; ad-hoc manual mapping is FORBIDDEN.
- Supabase-generated types live in `src/lib/supabase/types` and MUST be the
  single source of truth for database shapes.
- Path alias `@/*` → `src/*` MUST be preferred over relative paths crossing
  feature or layer boundaries.

### V. Offline-First Data Access

The app MUST function without a live network connection for all CRUD operations
on lists and list items. Features MUST write to and read from the observable
store; the Legend App ↔ Supabase ↔ MMKV sync layer handles persistence
transparently.

Rules:

- MMKV encrypted local storage (`src/data/storage.ts`) is the runtime cache;
  never bypass it to call Supabase directly from a feature.
- Sync configuration lives in `src/data/database.ts`; per-feature sync
  customisation MUST be done there, not scattered in feature code.
- Tests MUST mock the data layer (`src/data/`) and MUST NOT make live network
  calls. See `__mocks__/` for established mock patterns.

## Technology Constraints

| Concern | Choice | Version |
| --- | --- | --- |
| Framework | Expo / React Native | SDK 54 |
| Language | TypeScript (strict) | ~5.x |
| Routing | Expo Router | ~6.x |
| State | @legendapp/state | ^3.0.0-beta |
| Local storage | react-native-mmkv | — |
| Backend | Supabase JS | ^2.x |
| Styling | NativeWind (Tailwind CSS) | v4 |
| UI primitives | @rn-primitives | ^1.x |
| Forms | React Hook Form + Zod | — |
| Icons | @tabler/icons-react-native | ^3.x |
| Toasts | sonner-native via `src/services/toast.ts` | — |

Platform targets: Android, iOS, Web (secondary). Native-only APIs are acceptable;
web compatibility is best-effort.

UI language: **Portuguese (Brazil)** for all user-facing strings. `i18n` is not
yet implemented; strings are inline until a localization layer is added.

## Development Workflow & Code Quality

**Naming conventions** (enforced by linter where possible):

| Artifact | Convention | Example |
| --- | --- | --- |
| Files | `kebab-case` | `list-create-modal.tsx` |
| Components | `PascalCase` | `CardList` |
| Hooks | `use` prefix | `useListPageLogics` |
| Observables | `$` suffix | `lists$` |
| Prop types | `Props` suffix | `type CardListProps` |

**Commands**:

```bash
yarn start    # Expo dev server
yarn android  # Run on Android
yarn ios      # Run on iOS
yarn lint     # ESLint + Prettier check (run before every commit)
yarn format   # Auto-fix lint and formatting
yarn prebuild # Regenerate native android/ and ios/ folders
```

**Quality gates**:

- `yarn lint` MUST pass with zero errors before a PR is opened.
- New screens and hooks MUST have corresponding behavior tests in
  `src/hooks/__tests__/` or feature `__tests__/` directories.
- Tests MUST use the mocks in `__mocks__/`; no live Supabase calls in tests.
- The `React Compiler` plugin (`babel-plugin-react-compiler`) is enabled;
  code MUST NOT defeat memoization through unnecessary re-renders or
  inline object/array literals in JSX props.

## Governance

This constitution supersedes all other development documentation in the event of
a conflict. Amendments are made by running `/speckit.constitution` and MUST:

1. Increment `CONSTITUTION_VERSION` following semantic versioning:
   - MAJOR — principle removed or redefined incompatibly.
   - MINOR — new principle or section added; material guidance expanded.
   - PATCH — clarification, wording fix, typo correction.
2. Update `LAST_AMENDED_DATE` to the date of the change (ISO 8601 YYYY-MM-DD).
3. Propagate changes to affected templates in `.specify/templates/` and flag any
   additional follow-up in the Sync Impact Report at the top of this file.
4. Complexity violations caught by the **Constitution Check** gate in
   implementation plans (`plan.md`) MUST be documented in the Complexity Tracking
   table with explicit justification before work begins.

All PRs and implementation plans MUST pass the Constitution Check gate before
implementation tasks are generated. Runtime development guidance lives in
`.github/copilot-instructions.md`.

**Version**: 1.0.0 | **Ratified**: 2026-04-06 | **Last Amended**: 2026-04-06
