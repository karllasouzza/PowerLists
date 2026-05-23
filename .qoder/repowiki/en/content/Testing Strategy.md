# Testing Strategy

<cite>
**Referenced Files in This Document**
- [jest.config.cjs](file://jest.config.cjs)
- [jest.behavior.config.cjs](file://jest.behavior.config.cjs)
- [jest.behavior.setup.cjs](file://jest.behavior.setup.cjs)
- [package.json](file://package.json)
- [src/hooks/__tests__/use-auth.test.tsx](file://src/hooks/__tests__/use-auth.test.tsx)
- [src/hooks/__tests__/use-user.test.tsx](file://src/hooks/__tests__/use-user.test.tsx)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts)
- [src/utils/__tests__/currency.property.test.ts](file://src/utils/__tests__/currency.property.test.ts)
- [src/utils/__tests__/formatters.property.test.ts](file://src/utils/__tests__/formatters.property.test.ts)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts)
- [__mocks__/auth-actions.cjs](file://__mocks__/auth-actions.cjs)
- [__mocks__/auth-state.cjs](file://__mocks__/auth-state.cjs)
- [__mocks__/react-native-mmkv.cjs](file://__mocks__/react-native-mmkv.cjs)
- [__mocks__/react-native-reanimated.cjs](file://__mocks__/react-native-reanimated.cjs)
- [__mocks__/supabase.cjs](file://__mocks__/supabase.cjs)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the testing strategy for PowerLists, focusing on Jest configuration, unit and behavior testing, property-based testing, and CI-ready workflows. It explains how authentication hooks, state management functions, and UI components are tested, along with mocking patterns for external dependencies, test coverage expectations, and debugging techniques.

## Project Structure
The repository organizes tests by feature and domain:
- Unit and behavior tests live alongside the code under feature folders and hooks.
- Property-based tests reside in dedicated __tests__ folders within utils and features.
- Mocks are centralized under __mocks__ to isolate external dependencies and platform-specific libraries.

```mermaid
graph TB
subgraph "Jest Configurations"
J1["jest.config.cjs<br/>Property-based tests"]
J2["jest.behavior.config.cjs<br/>Behavior tests"]
J3["jest.behavior.setup.cjs<br/>Setup for behavior tests"]
end
subgraph "Tests"
T1["src/hooks/__tests__/use-auth.test.tsx"]
T2["src/hooks/__tests__/use-user.test.tsx"]
P1["src/utils/__tests__/currency.property.test.ts"]
P2["src/utils/__tests__/formatters.property.test.ts"]
P3["src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts"]
P4["src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts"]
P5["src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts"]
end
subgraph "Mocks"
M1["__mocks__/auth-actions.cjs"]
M2["__mocks__/auth-state.cjs"]
M3["__mocks__/react-native-mmkv.cjs"]
M4["__mocks__/react-native-reanimated.cjs"]
M5["__mocks__/supabase.cjs"]
end
J1 --> P1
J1 --> P2
J1 --> P3
J1 --> P4
J1 --> P5
J2 --> T1
J2 --> T2
J3 --> J2
T1 --> M1
T1 --> M2
T1 --> M3
T1 --> M4
T1 --> M5
T2 --> M1
T2 --> M2
T2 --> M3
T2 --> M4
T2 --> M5
```

**Diagram sources**
- [jest.config.cjs:1-23](file://jest.config.cjs#L1-L23)
- [jest.behavior.config.cjs:1-27](file://jest.behavior.config.cjs#L1-L27)
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)
- [src/hooks/__tests__/use-auth.test.tsx:1-189](file://src/hooks/__tests__/use-auth.test.tsx#L1-L189)
- [src/hooks/__tests__/use-user.test.tsx:1-159](file://src/hooks/__tests__/use-user.test.tsx#L1-L159)
- [src/utils/__tests__/currency.property.test.ts:1-43](file://src/utils/__tests__/currency.property.test.ts#L1-L43)
- [src/utils/__tests__/formatters.property.test.ts:1-88](file://src/utils/__tests__/formatters.property.test.ts#L1-L88)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts:1-71](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts#L1-L71)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts:1-204](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L1-L204)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts:1-22](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts#L1-L22)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)
- [__mocks__/react-native-reanimated.cjs:1-72](file://__mocks__/react-native-reanimated.cjs#L1-L72)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)

**Section sources**
- [jest.config.cjs:1-23](file://jest.config.cjs#L1-L23)
- [jest.behavior.config.cjs:1-27](file://jest.behavior.config.cjs#L1-L27)
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)
- [package.json:1-118](file://package.json#L1-L118)

## Core Components
- Jest configurations:
  - Property-based tests: configured to run files matching the pattern for property tests and to transform TypeScript with ts-jest.
  - Behavior tests: configured to run React component tests with JSX enabled and to mock reanimated and MMKV via moduleNameMapper.
- Test suites:
  - Authentication hook tests validate initialization, sign-in flows, sign-out, and password reset.
  - User hook tests validate user retrieval, updates, guest creation, and deletion flows.
  - Property-based tests validate numeric precision, aggregation correctness, and robustness against random inputs.
- Mock ecosystem:
  - Inline mocks replace platform-specific libraries and third-party services to keep tests deterministic and fast.
  - Reset helpers ensure clean state between tests.

**Section sources**
- [jest.config.cjs:1-23](file://jest.config.cjs#L1-L23)
- [jest.behavior.config.cjs:1-27](file://jest.behavior.config.cjs#L1-L27)
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)
- [src/hooks/__tests__/use-auth.test.tsx:1-189](file://src/hooks/__tests__/use-auth.test.tsx#L1-L189)
- [src/hooks/__tests__/use-user.test.tsx:1-159](file://src/hooks/__tests__/use-user.test.tsx#L1-L159)
- [src/utils/__tests__/currency.property.test.ts:1-43](file://src/utils/__tests__/currency.property.test.ts#L1-L43)
- [src/utils/__tests__/formatters.property.test.ts:1-88](file://src/utils/__tests__/formatters.property.test.ts#L1-L88)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts:1-71](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts#L1-L71)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts:1-204](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L1-L204)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts:1-22](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts#L1-L22)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)
- [__mocks__/react-native-reanimated.cjs:1-72](file://__mocks__/react-native-reanimated.cjs#L1-L72)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)

## Architecture Overview
The testing architecture separates concerns into:
- Property-based tests for pure functions and aggregations.
- Behavior tests for hooks and UI logic with mocked dependencies.
- Mocks for platform libraries and external services.

```mermaid
graph TB
subgraph "Test Runner"
RC["jest.config.cjs"]
RB["jest.behavior.config.cjs"]
RS["jest.behavior.setup.cjs"]
end
subgraph "Pure Function Tests"
PC["currency.property.test.ts"]
PF["formatters.property.test.ts"]
PL["use-list-page-logics.property.test.ts"]
PD["dashboard-metrics.property.test.ts"]
PV["parse-transcript.property.test.ts"]
end
subgraph "Behavior Tests"
BA["use-auth.test.tsx"]
BU["use-user.test.tsx"]
end
subgraph "Mocks"
MA["auth-actions.cjs"]
MS["auth-state.cjs"]
MR["react-native-mmkv.cjs"]
ME["react-native-reanimated.cjs"]
SU["supabase.cjs"]
end
RC --> PC
RC --> PF
RC --> PL
RC --> PD
RC --> PV
RB --> BA
RB --> BU
RS --> RB
BA --> MA
BA --> MS
BA --> MR
BA --> ME
BA --> SU
BU --> MA
BU --> MS
BU --> MR
BU --> ME
BU --> SU
```

**Diagram sources**
- [jest.config.cjs:1-23](file://jest.config.cjs#L1-L23)
- [jest.behavior.config.cjs:1-27](file://jest.behavior.config.cjs#L1-L27)
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)
- [src/utils/__tests__/currency.property.test.ts:1-43](file://src/utils/__tests__/currency.property.test.ts#L1-L43)
- [src/utils/__tests__/formatters.property.test.ts:1-88](file://src/utils/__tests__/formatters.property.test.ts#L1-L88)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts:1-71](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts#L1-L71)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts:1-204](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L1-L204)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts:1-22](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts#L1-L22)
- [src/hooks/__tests__/use-auth.test.tsx:1-189](file://src/hooks/__tests__/use-auth.test.tsx#L1-L189)
- [src/hooks/__tests__/use-user.test.tsx:1-159](file://src/hooks/__tests__/use-user.test.tsx#L1-L159)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)
- [__mocks__/react-native-reanimated.cjs:1-72](file://__mocks__/react-native-reanimated.cjs#L1-L72)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)

## Detailed Component Analysis

### Jest Configuration and Test Environments
- Property-based tests:
  - Run with Node environment and ts-jest.
  - Match files ending with .property.test.ts.
  - Module name mapping includes a mock for react-native-mmkv.
- Behavior tests:
  - Run with Node environment and ts-jest with JSX enabled.
  - Match files ending with .test.tsx.
  - Module name mapping includes mocks for react-native-reanimated and react-native-mmkv.
  - Setup script mocks reanimated globally for behavior tests.

```mermaid
flowchart TD
Start(["Run Jest"]) --> Env{"Which tests?"}
Env --> |Property-based| Cfg1["Load jest.config.cjs"]
Env --> |Behavior| Cfg2["Load jest.behavior.config.cjs"]
Cfg2 --> Setup["Apply jest.behavior.setup.cjs"]
Cfg1 --> Transform["ts-jest with tsconfig options"]
Cfg2 --> Transform
Transform --> Match["Match test files"]
Match --> Run["Execute tests"]
Run --> End(["Done"])
```

**Diagram sources**
- [jest.config.cjs:1-23](file://jest.config.cjs#L1-L23)
- [jest.behavior.config.cjs:1-27](file://jest.behavior.config.cjs#L1-L27)
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)

**Section sources**
- [jest.config.cjs:1-23](file://jest.config.cjs#L1-L23)
- [jest.behavior.config.cjs:1-27](file://jest.behavior.config.cjs#L1-L27)
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)

### Authentication Hook Tests
- Purpose: Validate initialization, sign-in, sign-out, and password reset flows.
- Mocks used:
  - @legendapp/state/react, @/lib/supabase, @/data/actions/auth, @/services, @/data/storage, @/data/states/auth.
- Patterns:
  - beforeEach clears and resets all mocks.
  - Assertions check state cells, service calls, and toast notifications.
  - Edge cases covered: invalid credentials, guest migration, and session cleanup.

```mermaid
sequenceDiagram
participant T as "Test"
participant H as "useAuth hook"
participant A as "auth-actions.cjs"
participant S as "supabase.cjs"
participant ST as "storage.cjs"
participant SS as "services.cjs"
T->>H : "fetchUserDataAsync()"
H->>A : "fetchOrRestoreUser()"
A-->>H : "{ user : null }"
H-->>T : "false"
T->>H : "signInWithPassword({email,password})"
H->>A : "signInWithPassword()"
A-->>H : "{ user, error }"
H->>SS : "SyncService"
H->>SS : "promptDataMigration(guestId,userId)"
H->>S : "auth.updateUser(...)"
H-->>T : "true"
T->>H : "signOut()"
H->>A : "performSignOut()"
H->>ST : "clearAllStorage()"
H-->>T : "true"
```

**Diagram sources**
- [src/hooks/__tests__/use-auth.test.tsx:1-189](file://src/hooks/__tests__/use-auth.test.tsx#L1-L189)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)

**Section sources**
- [src/hooks/__tests__/use-auth.test.tsx:1-189](file://src/hooks/__tests__/use-auth.test.tsx#L1-L189)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)

### User Hook Tests
- Purpose: Validate user retrieval, updates, guest creation, and deletion flows.
- Mocks used:
  - @legendapp/state/react, @/data/states/auth, @/data/actions/auth, @/lib/supabase.
- Patterns:
  - Uses cell-based state to simulate current user/session.
  - Verifies local vs remote behavior differences (e.g., guest soft delete does not call remote auth).

```mermaid
sequenceDiagram
participant T as "Test"
participant U as "useUser hook"
participant A as "auth-actions.cjs"
participant S as "supabase.cjs"
T->>U : "updateUser({ name })"
U->>A : "patchUser({ id, name })"
A-->>U : "{ user }"
U-->>T : "state updated"
T->>U : "createGuest({ name })"
U->>A : "createGuest()"
A-->>U : "{ user }"
U-->>T : "guest created and session cleared"
T->>U : "softDeleteUser(id)"
U-->>T : "local deletion, no remote call"
T->>U : "hardDeleteUser(id)"
U->>S : "functions.invoke('user-self-deletion')"
U-->>T : "success and local state cleared"
```

**Diagram sources**
- [src/hooks/__tests__/use-user.test.tsx:1-159](file://src/hooks/__tests__/use-user.test.tsx#L1-L159)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)

**Section sources**
- [src/hooks/__tests__/use-user.test.tsx:1-159](file://src/hooks/__tests__/use-user.test.tsx#L1-L159)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)

### Property-Based Testing Patterns
- Currency utilities:
  - Tests round-trip conversions to preserve cents.
  - Validates formatting and parsing with fast-check generators.
- Formatters:
  - Validates parsePrice and parseAmount semantics.
  - Ensures calculateTotal matches a Decimal oracle across random inputs.
- Lists totals:
  - Aggregation correctness for list totals with optional fields and infinite values.
- Dashboard metrics:
  - Robustness checks for filtering, totals, and daily series generation.
- Voice assistant transcript parser:
  - Exhaustive test cases for natural-language item parsing.

```mermaid
flowchart TD
Start(["Property Test Entry"]) --> Gen["Generate random inputs"]
Gen --> Exec["Execute function under test"]
Exec --> Oracle["Compute oracle (Decimal, Map, etc.)"]
Oracle --> Compare{"Matches oracle?"}
Compare --> |Yes| Pass["Pass"]
Compare --> |No| Fail["Fail with counter-example"]
Pass --> End(["Done"])
Fail --> End
```

**Diagram sources**
- [src/utils/__tests__/currency.property.test.ts:1-43](file://src/utils/__tests__/currency.property.test.ts#L1-L43)
- [src/utils/__tests__/formatters.property.test.ts:1-88](file://src/utils/__tests__/formatters.property.test.ts#L1-L88)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts:1-71](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts#L1-L71)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts:1-204](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L1-L204)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts:1-22](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts#L1-L22)

**Section sources**
- [src/utils/__tests__/currency.property.test.ts:1-43](file://src/utils/__tests__/currency.property.test.ts#L1-L43)
- [src/utils/__tests__/formatters.property.test.ts:1-88](file://src/utils/__tests__/formatters.property.test.ts#L1-L88)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts:1-71](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts#L1-L71)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts:1-204](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L1-L204)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts:1-22](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts#L1-L22)

### Mock Implementations and External Dependencies
- react-native-mmkv:
  - In-memory Map-backed implementation for storage APIs.
- react-native-reanimated:
  - Minimal mock replicating shared values and animation functions without importing RN.
- auth-actions and auth-state:
  - Cell-based reactive store and action mocks with reset helpers.
- supabase:
  - Auth and functions mocks with default implementations and reset helpers.

```mermaid
classDiagram
class AuthState {
+user
+session
+isInitialized
+isLoading
+resetAuthState()
}
class AuthActions {
+fetchOrRestoreUser()
+syncWithSupabase()
+patchUser()
+signInWithPassword()
+performSignOut()
+createGuest()
+resetAuthActionMocks()
}
class Supabase {
+auth.updateUser()
+functions.invoke()
+resetSupabaseMocks()
}
class MMKV {
+getString()
+set()
+delete()
+contains()
+getAllKeys()
+clearAll()
+addOnValueChangedListener()
}
class Reanimated {
+useSharedValue()
+withTiming()
+withDelay()
+withSpring()
+useAnimatedStyle()
+useAnimatedProps()
+runOnJS()
+cancelAnimation()
}
AuthState <.. AuthActions : "used by tests"
AuthActions <.. Supabase : "called by hooks"
MMKV <.. Tests : "moduleNameMapper"
Reanimated <.. Tests : "moduleNameMapper/setup"
```

**Diagram sources**
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)
- [__mocks__/react-native-reanimated.cjs:1-72](file://__mocks__/react-native-reanimated.cjs#L1-L72)

**Section sources**
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)
- [__mocks__/react-native-reanimated.cjs:1-72](file://__mocks__/react-native-reanimated.cjs#L1-L72)

## Dependency Analysis
- Test-to-mock coupling:
  - Authentication and user tests depend on a small set of inline mocks to isolate Supabase, storage, services, and state.
- External dependency isolation:
  - react-native-mmkv and react-native-reanimated are mocked to avoid platform-specific runtime dependencies in Node.
- Test environment separation:
  - Property-based and behavior tests use separate configs to tailor transform and module mapping.

```mermaid
graph LR
UA["use-auth.test.tsx"] --> MA["auth-actions.cjs"]
UA --> MS["auth-state.cjs"]
UA --> SU["supabase.cjs"]
UA --> MR["react-native-mmkv.cjs"]
UA --> ME["react-native-reanimated.cjs"]
UU["use-user.test.tsx"] --> MA
UU --> MS
UU --> SU
UU --> MR
UU --> ME
CUR["currency.property.test.ts"] --> DEC["decimal.js"]
FOR["formatters.property.test.ts"] --> DEC
LTL["use-list-page-logics.property.test.ts"] --> DEC
DAS["dashboard-metrics.property.test.ts"] --> DEC
PAR["parse-transcript.property.test.ts"]
```

**Diagram sources**
- [src/hooks/__tests__/use-auth.test.tsx:1-189](file://src/hooks/__tests__/use-auth.test.tsx#L1-L189)
- [src/hooks/__tests__/use-user.test.tsx:1-159](file://src/hooks/__tests__/use-user.test.tsx#L1-L159)
- [src/utils/__tests__/currency.property.test.ts:1-43](file://src/utils/__tests__/currency.property.test.ts#L1-L43)
- [src/utils/__tests__/formatters.property.test.ts:1-88](file://src/utils/__tests__/formatters.property.test.ts#L1-L88)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts:1-71](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts#L1-L71)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts:1-204](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L1-L204)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts:1-22](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts#L1-L22)
- [__mocks__/auth-actions.cjs:1-50](file://__mocks__/auth-actions.cjs#L1-L50)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)
- [__mocks__/react-native-reanimated.cjs:1-72](file://__mocks__/react-native-reanimated.cjs#L1-L72)

**Section sources**
- [src/hooks/__tests__/use-auth.test.tsx:1-189](file://src/hooks/__tests__/use-auth.test.tsx#L1-L189)
- [src/hooks/__tests__/use-user.test.tsx:1-159](file://src/hooks/__tests__/use-user.test.tsx#L1-L159)
- [src/utils/__tests__/currency.property.test.ts:1-43](file://src/utils/__tests__/currency.property.test.ts#L1-L43)
- [src/utils/__tests__/formatters.property.test.ts:1-88](file://src/utils/__tests__/formatters.property.test.ts#L1-L88)
- [src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts:1-71](file://src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts#L1-L71)
- [src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts:1-204](file://src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts#L1-L204)
- [src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts:1-22](file://src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts#L1-L22)

## Performance Considerations
- Keep tests synchronous where possible; only use async when interacting with mocked services.
- Prefer property-based tests for numeric precision and edge cases to reduce brittle unit tests.
- Avoid heavy setup in beforeEach; rely on reset helpers to minimize overhead.
- Use moduleNameMapper to avoid loading heavy platform libraries during tests.

## Troubleshooting Guide
Common issues and resolutions:
- Reanimated errors in behavior tests:
  - Ensure jest.behavior.setup.cjs is applied and react-native-reanimated is mocked via moduleNameMapper.
- MMKV-related failures:
  - Verify react-native-mmkv is mocked; confirm createMMKV is returning a valid instance.
- Supabase method not called:
  - Confirm mocks are reset before each test and that the hook under test calls the expected method.
- State not updating:
  - Ensure auth-state cell mocks are reset and that the hook reads from the mocked store.
- flaky property-based tests:
  - Add explicit preconditions (e.g., skip non-finite values) and increase seed stability for reproducibility.

**Section sources**
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)
- [__mocks__/react-native-mmkv.cjs:1-24](file://__mocks__/react-native-mmkv.cjs#L1-L24)
- [__mocks__/react-native-reanimated.cjs:1-72](file://__mocks__/react-native-reanimated.cjs#L1-L72)
- [__mocks__/supabase.cjs:1-36](file://__mocks__/supabase.cjs#L1-L36)
- [__mocks__/auth-state.cjs:1-34](file://__mocks__/auth-state.cjs#L1-L34)

## Conclusion
PowerLists employs a layered testing strategy: property-based tests for numeric correctness, behavior tests for hooks and UI logic, and a comprehensive mock suite for platform and external dependencies. The Jest configurations and setup scripts ensure reliable, fast, and deterministic test runs suitable for CI.

## Appendices

### Test Coverage Guidelines
- Aim for high coverage in pure functions and hooks; prioritize branches and error paths.
- For property-based tests, cover edge cases (nulls, infinities, empty arrays) and round-trip invariants.
- Behavior tests should validate observable side effects (state updates, service calls, toasts).

### Writing Effective Tests
- Use beforeEach to reset mocks and state; use afterEach to restore spies.
- Prefer assertions on observable outcomes (state cells, service calls) rather than internal implementation details.
- For hooks, test both happy and error paths; simulate network/service failures via mocks.

### Debugging Test Failures
- Temporarily log mock calls to identify mismatches.
- Reduce test scope to a minimal reproduction.
- Use console.error spies to capture unexpected logs.

### Continuous Integration Testing Workflows
- Configure CI to run:
  - Property-based tests with jest.config.cjs.
  - Behavior tests with jest.behavior.config.cjs and jest.behavior.setup.cjs.
- Ensure environment variables and secrets are mocked or stubbed in CI.

**Section sources**
- [jest.config.cjs:1-23](file://jest.config.cjs#L1-L23)
- [jest.behavior.config.cjs:1-27](file://jest.behavior.config.cjs#L1-L27)
- [jest.behavior.setup.cjs:1-4](file://jest.behavior.setup.cjs#L1-L4)
- [package.json:1-118](file://package.json#L1-L118)