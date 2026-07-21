# Sub-Roadmap: Fase 3 — TopBar da Tela de Listas

**Objetivo:** Atualizar a TopBar para refletir que é a tela principal
**Duração estimada:** 1 dia
**Dependências:** Fase 1 concluída

---

## Passo 3.1: Analisar TopBar atual

### Estado atual

```tsx
// src/features/lists/page.tsx
<TopBar
  title="Minhas Listas"
  showSearch={!isEmpty}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Procurando por algo?"
/>
```

### Proposta

```tsx
<TopBar
  title="Minhas Listas"
  showSearch={!isEmpty}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Procurando por algo?"
  rightAction={
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ver resumo de gastos"
      onPress={() => router.push('/dashboard')}
      className="flex-row items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
      <Icon as={IconChartBar} size={18} className="text-foreground" />
      <Text variant="small" className="font-semibold text-foreground">
        Resumo
      </Text>
    </Pressable>
  }
/>
```

---

## Passo 3.2: Modificar `lists/page.tsx`

### Ação

Adicionar botão "Resumo" na TopBar:

```typescript
// Adicionar imports
import { IconChartBar } from '@tabler/icons-react-native';
import { Pressable } from 'react-native';

// Na TopBar, adicionar rightAction
<TopBar
  title="Minhas Listas"
  showSearch={!isEmpty}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  searchPlaceholder="Procurando por algo?"
  rightAction={
    !isEmpty ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver resumo de gastos"
        onPress={() => router.push('/dashboard')}
        className="flex-row items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
        <Icon as={IconChartBar} size={18} className="text-foreground" />
        <Text variant="small" className="font-semibold text-foreground">
          Resumo
        </Text>
      </Pressable>
    ) : undefined
  }
/>
```

---

## Passo 3.3: Criar teste `05-topbar-resumo-button.yaml`

### Ação

Criar `.maestro/05-topbar-resumo-button.yaml`:

```yaml
# TopBar Resumo Button Test
#
# Tests: Verifies "Resumo" button in TopBar navigates to dashboard
# Prerequisites:
# - User has at least one list created

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
# STEP 2: VERIFY RESUMO BUTTON IN TOPBAR
# ==========================================

# "Resumo" button should be visible in TopBar
- assertVisible:
    text: "Resumo"

- takeScreenshot: 12-topbar-resumo-button

# ==========================================
# STEP 3: TAP RESUMO BUTTON
# ==========================================

- tapOn:
    text: "Resumo"

# ==========================================
# STEP 4: VERIFY NAVIGATION TO DASHBOARD
# ==========================================

# Should navigate to dashboard/summary screen
- assertVisible:
    text: "Todo o histórico"
    optional: true

- takeScreenshot: 13-navigated-to-dashboard

# ==========================================
# STEP 5: VERIFY BACK NAVIGATION
# ==========================================

- tapOn:
    text: "Listas"

- assertVisible:
    text: "Minhas Listas"
    optional: true

- takeScreenshot: 14-back-to-lists
```

---

## Passo 3.4: Typecheck e commit

### Ação

```bash
npx tsc --noEmit -p tsconfig.json
git add -A
git commit -m "feat(ui): add Resumo button to TopBar for quick dashboard access"
```

---

## Validação Final (Fase 3)

### Teste E2E

```bash
maestro test .maestro/05-topbar-resumo-button.yaml
```

### Checklist

- [ ] Botão "Resumo" aparece na TopBar quando há listas
- [ ] Botão não aparece quando não há listas (empty state)
- [ ] Tocar no botão navega para o dashboard
- [ ] Dashboard mostra conteúdo correto
- [ ] Volta para listas funciona
- [ ] Typecheck passa
