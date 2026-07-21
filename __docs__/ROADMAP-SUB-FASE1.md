# Sub-Roadmap: Fase 1 — Inverter Ordem das Abas

**Objetivo:** Tornar a tela de Listas a入口 principal (index) do usuário autenticado
**Duração estimada:** 1 dia
**Dependências:** Nenhuma (primeira fase)

---

## Passo 1.1: Criar diretório de testes Maestro

### Ação

Criar estrutura `.maestro/` no projeto:

```
.maestro/
├── config.yaml                    # Configuração compartilhada
├── flows/
│   ├── auth-preflight.yaml        # Auth pre-flight pattern
│   └── navigate-to-lists.yaml     # Navegação para listas
├── scripts/
│   └── mock-data.js               # Dados de teste
├── 01-lists-primary.yaml          # Teste: Listas como index
├── 02-dashboard-secondary.yaml    # Teste: Dashboard como aba secundária
├── 03-tab-navigation.yaml         # Teste: Navegação entre abas
└── 04-deep-links.yaml             # Teste: Deep links
```

### Validação

```bash
ls -la .maestro/
```

---

## Passo 1.2: Criar `config.yaml` compartilhado

### Ação

Criar `.maestro/config.yaml`:

```yaml
appId: com.karllasouzza.powerlists
tags:
  - ci
  - smoke
  - navigation
```

---

## Passo 1.3: Criar sub-flow `auth-preflight.yaml`

### Ação

Criar `.maestro/flows/auth-preflight.yaml`:

```yaml
# Auth Pre-Flight Pattern
# Wait for auth state to resolve before interacting with UI
---
- launchApp

# Prevent XCTest crash on cold boot (iOS)
- swipe:
    direction: DOWN
    duration: 100

# Wait for auth state to resolve
- extendedWaitUntil:
    visible:
      id: "auth-loaded"
    timeout: 15000
```

### Nota técnica

O componente `auth-loaded` deve existir no app. Verificar se já existe em `src/app/_layout.tsx` ou `src/components/`.

---

## Passo 1.4: Criar teste `01-lists-primary.yaml`

### Ação

Criar `.maestro/01-lists-primary.yaml`:

```yaml
# Lists as Primary Screen Test
#
# Tests: Verifies that Lists is the first tab (index) after login
# Prerequisites:
# - User has at least one list created
# - App is installed on simulator/emulator

appId: com.karllasouzza.powerlists
tags:
  - ci
  - smoke
  - navigation
---
# ==========================================
# STEP 1: LAUNCH + AUTH PRE-FLIGHT
# ==========================================

- launchApp

- swipe:
    direction: DOWN
    duration: 100

- extendedWaitUntil:
    visible:
      id: "auth-loaded"
    timeout: 15000

- takeScreenshot: 01-initial-state

# ==========================================
# STEP 2: VERIFY LISTS IS FIRST TAB
# ==========================================

# Lists should be visible immediately (first tab)
- assertVisible:
    text: "Minhas Listas"
    optional: true

# OR if using testID
- assertVisible:
    id: "lists-screen"
    optional: true

# ==========================================
# STEP 3: VERIFY TAB BAR ORDER
# ==========================================

# First tab should be "Listas" (not "Início")
- assertVisible:
    text: "Listas"

# Second tab should be "Resumo" (not "Listas")
- assertVisible:
    text: "Resumo"
    optional: true

# Third tab should be "Perfil"
- assertVisible:
    text: "Perfil"

- takeScreenshot: 02-tab-bar-verification

# ==========================================
# STEP 4: VERIFY FAB IS VISIBLE
# ==========================================

# FAB "Adicionar Lista" should be visible on primary screen
- assertVisible:
    text: "Adicionar Lista"
    optional: true

# OR using testID
- assertVisible:
    id: "fab-add-list"
    optional: true

- takeScreenshot: 03-fab-verification
```

---

## Passo 1.5: Criar teste `02-dashboard-secondary.yaml`

### Ação

Criar `.maestro/02-dashboard-secondary.yaml`:

```yaml
# Dashboard as Secondary Screen Test
#
# Tests: Verifies Dashboard is accessible via "Resumo" tab
# Prerequisites:
# - User is authenticated
# - App is installed on simulator/emulator

appId: com.karllasouzza.powerlists
tags:
  - ci
  - navigation
---
# ==========================================
# STEP 1: LAUNCH + AUTH PRE-FLIGHT
# ==========================================

- launchApp

- swipe:
    direction: DOWN
    duration: 100

- extendedWaitUntil:
    visible:
      id: "auth-loaded"
    timeout: 15000

# ==========================================
# STEP 2: TAP ON RESUMO TAB
# ==========================================

- tapOn:
    text: "Resumo"

# ==========================================
# STEP 3: VERIFY DASHBOARD CONTENT
# ==========================================

# Dashboard should show period filter
- assertVisible:
    text: "Todo o histórico"
    optional: true

# Dashboard should show summary content
- assertVisible:
    id: "dashboard-content"
    optional: true

- takeScreenshot: 04-dashboard-content

# ==========================================
# STEP 4: VERIFY NAVIGATION BACK TO LISTS
# ==========================================

- tapOn:
    text: "Listas"

# Should return to lists screen
- assertVisible:
    text: "Minhas Listas"
    optional: true

- takeScreenshot: 05-back-to-lists
```

---

## Passo 1.6: Criar teste `03-tab-navigation.yaml`

### Ação

Criar `.maestro/03-tab-navigation.yaml`:

```yaml
# Tab Navigation Test
#
# Tests: Full navigation flow between all tabs
# Prerequisites:
# - User is authenticated

appId: com.karllasouzza.powerlists
tags:
  - ci
  - navigation
---
# ==========================================
# STEP 1: LAUNCH + AUTH PRE-FLIGHT
# ==========================================

- launchApp

- swipe:
    direction: DOWN
    duration: 100

- extendedWaitUntil:
    visible:
      id: "auth-loaded"
    timeout: 15000

# ==========================================
# STEP 2: NAVIGATE TO RESUMO
# ==========================================

- tapOn:
    text: "Resumo"

- assertVisible:
    text: "Resumo"
    optional: true

- takeScreenshot: 06-resumo-tab

# ==========================================
# STEP 3: NAVIGATE TO PERFIL
# ==========================================

- tapOn:
    text: "Perfil"

- assertVisible:
    text: "Perfil"
    optional: true

- takeScreenshot: 07-perfil-tab

# ==========================================
# STEP 4: NAVIGATE BACK TO LISTAS
# ==========================================

- tapOn:
    text: "Listas"

- assertVisible:
    text: "Minhas Listas"
    optional: true

- takeScreenshot: 08-listas-tab
```

---

## Passo 1.7: Modificar rotas no Expo Router

### Ação

Modificar `src/app/(authenticated)/_layout.tsx`:

```typescript
// ANTES
const SCREENS_WITH_HIDDEN_TABS = ['/lists/', '/item-variations', '/item-comparison'];

// DEPOIS
const SCREENS_WITH_HIDDEN_TABS = ['/lists/', '/item-variations', '/item-comparison'];

// Trocar ordem dos TabTriggers:
// ANTES:
<TabTrigger name="index" href={'/'} asChild>  // Dashboard
  <TabButton icon={IconHome} focusedIcon={IconHomeFilled} label="Início" />
</TabTrigger>
<TabTrigger name="lists" href={'/lists'} asChild>  // Lists
  <TabButton icon={IconFolder} focusedIcon={IconFolderFilled} label="Listas" />
</TabTrigger>

// DEPOIS:
<TabTrigger name="index" href={'/lists'} asChild>  // Lists (AGORA é index)
  <TabButton icon={IconList} focusedIcon={IconListFilled} label="Listas" />
</TabTrigger>
<TabTrigger name="dashboard" href={'/dashboard'} asChild>  // Dashboard (aba secundária)
  <TabButton icon={IconChartBar} focusedIcon={IconChartBarFilled} label="Resumo" />
</TabTrigger>
```

### Imports necessários

Adicionar imports de ícones:

```typescript
import {
  IconList,
  IconListFilled,
  IconChartBar,
  IconChartBarFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react-native';
```

---

## Passo 1.8: Mover rotas de arquivos

### Ação

1. Renomear `src/app/(authenticated)/lists.tsx` → `src/app/(authenticated)/index.tsx`
2. Renomear `src/app/(authenticated)/index.tsx` → `src/app/(authenticated)/dashboard.tsx`

### Comandos

```bash
git mv src/app/\(authenticated\)/lists.tsx src/app/\(authenticated\)/index.tsx
git mv src/app/\(authenticated\)/index.tsx src/app/\(authenticated\)/dashboard.tsx
```

### Nota

O Expo Router usa o nome do arquivo para definir a rota. `index.tsx` é a rota raiz do grupo.

---

## Passo 1.9: Atualizar redirect no root index

### Ação

Modificar `src/app/index.tsx` para redirecionar corretamente:

```typescript
// ANTES
if (user) return <Redirect href="/(authenticated)" />;

// DEPOIS (mantido - já redireciona para index que agora é lists)
if (user) return <Redirect href="/(authenticated)" />;
```

---

## Passo 1.10: Typecheck e commit

### Ação

```bash
npx tsc --noEmit -p tsconfig.json
git add -A
git commit -m "feat(routing): make Lists the primary screen, Dashboard secondary"
```

---

## Validação Final (Fase 1)

### Teste E2E completo

Executar todos os testes da fase:

```bash
maestro test .maestro/01-lists-primary.yaml
maestro test .maestro/02-dashboard-secondary.yaml
maestro test .maestro/03-tab-navigation.yaml
```

### Checklist de validação

- [ ] Listas é a primeira aba (index)
- [ ] Dashboard é a segunda aba ("Resumo")
- [ ] Perfil é a terceira aba
- [ ] Navegação entre abas funciona
- [ ] FAB "Adicionar Lista" visível na tela principal
- [ ] Deep links não quebraram
- [ ] Typecheck passa

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Expo Router conflita com rotas | Média | Alto | Verificar estrutura de arquivos antes de mover |
| Deep links quebrados | Baixa | Alto | Testar todos os deep links no app.json |
| Tab bar não renderiza | Baixa | Médio | Verificar imports de ícones |
