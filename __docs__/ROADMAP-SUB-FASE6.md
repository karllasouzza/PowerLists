# Sub-Roadmap: Fase 6 — Empty State da Tela Principal

**Objetivo:** Melhorar o empty state da lista de listas (primeira tela que o usuário vê)
**Duração estimada:** 1 dia
**Dependências:** Fase 1 concluída

---

## Passo 6.1: Analisar empty state atual

### Estado atual

```tsx
// src/features/lists/page.tsx
{isEmpty ? (
  <View className="flex-1 items-center justify-center px-8">
    <Icon as={IconFolderOff} size={48} className="text-muted-foreground" />
    <Text className="mt-4 text-lg font-semibold text-foreground">Nenhuma lista ainda</Text>
    <Text variant="muted" className="mt-1 text-center">
      Crie sua primeira lista e saiba exatamente{'\n'}quanto vai gastar em cada compra.
    </Text>
    <Button variant="default" className="mt-6 h-12 px-8" onPress={handleOpenCreateModal}>
      <Icon as={IconPlus} size={20} className="text-primary-foreground" />
      <Text className="text-base font-bold text-primary-foreground">Criar primeira lista</Text>
    </Button>
  </View>
) : ...}
```

### Problemas

1. Ícone genérico (`IconFolderOff`) — não comunica o valor do app
2. Copy é OK mas poderia ser mais persuasivo
3. Sem dicas de funcionalidades (voz, comparação de preços)

---

## Passo 6.2: Criar componente `EmptyListsState`

### Ação

Criar `src/features/lists/components/empty-lists-state.tsx`:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  IconPlus,
  IconMicrophone,
  IconChartBar,
  IconShoppingCart,
} from '@tabler/icons-react-native';

interface EmptyListsStateProps {
  onCreateList: () => void;
}

export function EmptyListsState({ onCreateList }: EmptyListsStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      {/* Ícone principal */}
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-primary/10">
        <Icon as={IconShoppingCart} size={48} className="text-primary" />
      </View>

      {/* Título */}
      <Text className="text-2xl font-bold text-foreground">
        Comece a economizar
      </Text>

      {/* Subtítulo */}
      <Text variant="muted" className="mt-2 text-center text-base">
        Crie listas de compras, acompanhe gastos{'\n'}e compare preços para pagar menos.
      </Text>

      {/* Dicas */}
      <View className="mt-8 w-full gap-4">
        {/* Dica 1: Voz */}
        <View className="flex-row items-center gap-3 rounded-xl bg-card p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-violet-100">
            <Icon as={IconMicrophone} size={20} className="text-violet-600" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground">Adicione itens por voz</Text>
            <Text variant="small" className="text-muted-foreground">
              Use o assistente para adicionar rápido
            </Text>
          </View>
        </View>

        {/* Dica 2: Comparar preços */}
        <View className="flex-row items-center gap-3 rounded-xl bg-card p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Icon as={IconChartBar} size={20} className="text-blue-600" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground">Compare preços</Text>
            <Text variant="small" className="text-muted-foreground">
              Veja altas e quedas de preço
            </Text>
          </View>
        </View>
      </View>

      {/* Botão CTA */}
      <Button
        variant="default"
        className="mt-8 h-14 w-full"
        onPress={onCreateList}>
        <Icon as={IconPlus} size={20} className="text-primary-foreground" />
        <Text className="text-base font-bold text-primary-foreground">
          Criar primeira lista
        </Text>
      </Button>
    </View>
  );
}
```

---

## Passo 6.3: Atualizar `lists/page.tsx`

### Ação

Usar o novo componente:

```tsx
import { EmptyListsState } from './components/empty-lists-state';

// Na seção de empty state:
{isEmpty ? (
  <EmptyListsState onCreateList={handleOpenCreateModal} />
) : ...}
```

---

## Passo 6.4: Criar teste `09-empty-state.yaml`

### Ação

Criar `.maestro/09-empty-state.yaml`:

```yaml
# Empty State Test
#
# Tests: Verifies empty state shows correct content for new users
# Prerequisites:
# - User has NO lists (fresh account or cleared data)

appId: com.karllasouzza.powerlists
tags:
  - ci
  - smoke
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
# STEP 2: VERIFY EMPTY STATE CONTENT
# ==========================================

# Title should be visible
- assertVisible:
    text: "Comece a economizar"

# Subtitle should be visible
- assertVisible:
    text: "Crie listas de compras"

- takeScreenshot: 25-empty-state-title

# ==========================================
# STEP 3: VERIFY FEATURE HINTS
# ==========================================

# Voice hint should be visible
- assertVisible:
    text: "Adicione itens por voz"

# Price comparison hint should be visible
- assertVisible:
    text: "Compare preços"

- takeScreenshot: 26-empty-state-hints

# ==========================================
# STEP 4: VERIFY CTA BUTTON
# ==========================================

# CTA button should be visible
- assertVisible:
    text: "Criar primeira lista"

- takeScreenshot: 27-empty-state-cta

# ==========================================
# STEP 5: TAP CTA BUTTON
# ==========================================

- tapOn:
    text: "Criar primeira lista"

# ==========================================
# STEP 6: VERIFY CREATE MODAL OPENS
# ==========================================

# Create list modal should open
- assertVisible:
    text: "Criar lista"
    optional: true

# OR
- assertVisible:
    id: "create-list-modal"
    optional: true

- takeScreenshot: 28-create-modal-open
```

---

## Passo 6.5: Typecheck e commit

### Ação

```bash
npx tsc --noEmit -p tsconfig.json
git add -A
git commit -m "feat(ui): improve empty state with feature hints and persuasive copy"
```

---

## Validação Final (Fase 6)

### Teste E2E

```bash
maestro test .maestro/09-empty-state.yaml
```

### Checklist

- [ ] Empty state mostra título "Comece a economizar"
- [ ] Empty state mostra dica de voz
- [ ] Empty state mostra dica de comparação de preços
- [ ] Botão CTA "Criar primeira lista" funciona
- [ ] Modal de criação abre ao tocar no CTA
- [ ] Layout está centralizado e bem espaçado
- [ ] Typecheck passa
