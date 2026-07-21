# Sub-Roadmap: Fase 4 — Dashboard → Summary (Refatoração Completa)

**Objetivo:** Renomear e refatorar o Dashboard para ser uma tela de Resumo focada no usuário
**Duração estimada:** 1-2 dias
**Dependências:** Fases 1-3 concluídas

---

## Visão Geral da Refatoração

### O que muda

| Elemento | Atual | Proposto |
|----------|-------|----------|
| Nome da feature | `dashboard` | `summary` |
| Nome do componente | `DashboardPage` | `SummaryPage` |
| Hook principal | `useDashboardPageLogics` | `useSummaryPage` |
| Tipos | `Dashboard*` | `Summary*` |
| Layout | 4 seções empilhadas | Cards de resumo + seções colapsáveis |

### Por quê?

- "Dashboard" é termo técnico, não amigável ao usuário
- "Resumo" comunica claramente "visão geral das suas compras"
- Cards de resumo rápido dão informação imediata
- Seções colapsáveis reduzem scroll

---

## Passo 4.1: Criar estrutura da feature `summary`

### Ação

Criar diretório `src/features/summary/` copiando de `dashboard/`:

```bash
cp -r src/features/dashboard src/features/summary
```

### Estrutura proposta

```
src/features/summary/
├── index.ts                      # Barrel export
├── page.tsx                      # SummaryPage (refatorada)
├── types.ts                      # Summary* types
├── hooks/
│   ├── use-summary-page.ts       # Hook principal
│   └── __tests__/
│       └── use-summary-page.property.test.ts
├── components/
│   ├── summary-header.tsx        # Header com período
│   ├── summary-quick-cards.tsx   # Cards de resumo rápido (NOVO)
│   ├── summary-pie-chart.tsx     # Gráfico de pizza
│   ├── summary-item-variations.tsx # Variações de preço
│   └── index.ts
└── utils/
    ├── summary-metrics.ts        # Cálculos de resumo
    └── index.ts
```

---

## Passo 4.2: Renomear tipos

### Ação

Modificar `src/features/summary/types.ts`:

```typescript
// ANTES
export type DashboardPeriod = 'all' | 'week' | 'month' | 'year';
export type DashboardPieSlice = { ... };
export type DashboardRecentListCard = { ... };
export type DashboardItemVariation = { ... };
export type DashboardSummary = { ... };

// DEPOIS
export type SummaryPeriod = 'all' | 'week' | 'month' | 'year';
export type SummaryPieSlice = { ... };
export type SummaryItemVariation = { ... };
export type SummaryData = {
  totalCheckedPrice: number;
  totalLists: number;
  totalItems: number;
  averagePricePerItem: number;
  pieSlices: SummaryPieSlice[];
  increases: SummaryItemVariation[];
  decreases: SummaryItemVariation[];
};
```

### Tipos removidos

- `DashboardRecentListCard` — removido (listas recentes já estão na tela principal)
- `DashboardDatePoint` — renomeado para `SummaryDatePoint`

---

## Passo 4.3: Criar componente `SummaryQuickCards` (NOVO)

### Ação

Criar `src/features/summary/components/summary-quick-cards.tsx`:

```tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { IconShoppingCart, IconList, IconCoin } from '@tabler/icons-react-native';
import { formatCurrency } from '@/utils/formatters';

interface SummaryQuickCardsProps {
  totalCheckedPrice: number;
  totalLists: number;
  totalItems: number;
}

export function SummaryQuickCards({
  totalCheckedPrice,
  totalLists,
  totalItems,
}: SummaryQuickCardsProps) {
  return (
    <View className="flex-row gap-3 px-4">
      {/* Card: Total Gasto */}
      <View className="flex-1 items-center gap-2 rounded-2xl bg-card p-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Icon as={IconCoin} size={20} className="text-primary" />
        </View>
        <Text variant="small" className="text-muted-foreground">
          Total
        </Text>
        <Text className="text-lg font-bold text-foreground">
          {formatCurrency(totalCheckedPrice)}
        </Text>
      </View>

      {/* Card: Listas */}
      <View className="flex-1 items-center gap-2 rounded-2xl bg-card p-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Icon as={IconList} size={20} className="text-primary" />
        </View>
        <Text variant="small" className="text-muted-foreground">
          Listas
        </Text>
        <Text className="text-lg font-bold text-foreground">
          {totalLists}
        </Text>
      </View>

      {/* Card: Itens */}
      <View className="flex-1 items-center gap-2 rounded-2xl bg-card p-4">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Icon as={IconShoppingCart} size={20} className="text-primary" />
        </View>
        <Text variant="small" className="text-muted-foreground">
          Itens
        </Text>
        <Text className="text-lg font-bold text-foreground">
          {totalItems}
        </Text>
      </View>
    </View>
  );
}
```

---

## Passo 4.4: Refatorar `SummaryPage`

### Ação

Modificar `src/features/summary/page.tsx`:

```tsx
import React, { Suspense, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { TopBar } from '@/components/top-bar';
import { Skeleton } from '@/components/ui/skeleton';

import { useSummaryPage } from './hooks/use-summary-page';
import type { SummaryItemVariation } from './types';

const AsyncPeriodFilter = React.lazy(async () => {
  const module = await import('./components/period-filter');
  return { default: module.PeriodFilter };
});

const AsyncSummaryQuickCards = React.lazy(async () => {
  const module = await import('./components/summary-quick-cards');
  return { default: module.SummaryQuickCards };
});

const AsyncCheckedTotalPieChart = React.lazy(async () => {
  const module = await import('./components/checked-total-pie-chart');
  return { default: module.CheckedTotalPieChart };
});

const AsyncItemVariationSection = React.lazy(async () => {
  const module = await import('./components/item-variation-section');
  return { default: module.ItemVariationSection };
});

const SummaryLoading = () => (
  <View className="gap-4 px-4 py-4">
    <Skeleton className="h-11 w-full rounded-xl" />
    <View className="flex-row gap-3">
      <Skeleton className="h-36 flex-1 rounded-2xl" />
      <Skeleton className="h-36 flex-1 rounded-2xl" />
      <Skeleton className="h-36 flex-1 rounded-2xl" />
    </View>
    <Skeleton className="h-80 w-full rounded-3xl" />
  </View>
);

function SummaryPage() {
  const router = useRouter();
  const {
    period,
    setPeriod,
    periodLabel,
    isLoading,
    totalCheckedPrice,
    totalLists,
    totalItems,
    pieSlices,
    increases,
    decreases,
  } = useSummaryPage();

  const handleOpenItemComparison = useCallback(
    (item: SummaryItemVariation) => {
      router.push({
        pathname: '/item-comparison',
        params: {
          itemKey: item.key,
          itemTitle: item.title,
          period,
        },
      });
    },
    [period, router],
  );

  const handleViewAllItemVariations = useCallback(() => {
    router.push({
      pathname: '/item-variations',
      params: { period },
    });
  }, [period, router]);

  return (
    <View className="flex-1 bg-background">
      <TopBar title="Resumo" showSearch={false} />

      {isLoading ? (
        <SummaryLoading />
      ) : (
        <Suspense fallback={<SummaryLoading />}>
          <ScrollView className="flex-1" contentContainerClassName="gap-5 py-4 pb-8">
            <AsyncPeriodFilter period={period} onChange={setPeriod} />

            <AsyncSummaryQuickCards
              totalCheckedPrice={totalCheckedPrice}
              totalLists={totalLists}
              totalItems={totalItems}
            />

            <AsyncCheckedTotalPieChart
              slices={pieSlices}
              totalCheckedPrice={totalCheckedPrice}
              periodLabel={periodLabel}
            />

            <AsyncItemVariationSection
              increases={increases}
              decreases={decreases}
              onViewAll={handleViewAllItemVariations}
              onPressItem={handleOpenItemComparison}
            />
          </ScrollView>
        </Suspense>
      )}
    </View>
  );
}

export default SummaryPage;
```

---

## Passo 4.5: Renomear hook

### Ação

Renomear `src/features/summary/hooks/use-dashboard-page.ts` → `use-summary-page.ts`:

```typescript
// ANTES
export const useDashboardPageLogics = () => { ... };

// DEPOIS
export const useSummaryPage = () => { ... };
```

### Atualizar barrel export

```typescript
// src/features/summary/index.ts
export { default } from './page';
export { useSummaryPage } from './hooks/use-summary-page';
```

---

## Passo 4.6: Renomear utils

### Ação

Renomear funções em `src/features/summary/utils/summary-metrics.ts`:

```typescript
// ANTES
export const buildDashboardSummary = ( ... ): DashboardSummary => { ... };

// DEPOIS
export const buildSummaryData = ( ... ): SummaryData => { ... };
```

---

## Passo 4.7: Criar teste `06-summary-cards.yaml`

### Ação

Criar `.maestro/06-summary-cards.yaml`:

```yaml
# Summary Quick Cards Test
#
# Tests: Verifies quick summary cards show correct data
# Prerequisites:
# - User has lists with items and prices

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
# STEP 2: NAVIGATE TO RESUMO
# ==========================================

- tapOn:
    text: "Resumo"

# ==========================================
# STEP 3: VERIFY QUICK CARDS
# ==========================================

# Total card should be visible
- assertVisible:
    text: "Total"

# Listas card should be visible
- assertVisible:
    text: "Listas"

# Itens card should be visible
- assertVisible:
    text: "Itens"

- takeScreenshot: 15-summary-quick-cards

# ==========================================
# STEP 4: VERIFY CARDS HAVE VALUES
# ==========================================

# Cards should show numbers (not just labels)
- assertVisible:
    id: "summary-total-value"
    optional: true

- assertVisible:
    id: "summary-lists-count"
    optional: true

- assertVisible:
    id: "summary-items-count"
    optional: true

- takeScreenshot: 16-summary-values
```

---

## Passo 4.8: Criar teste `07-summary-period-filter.yaml`

### Ação

Criar `.maestro/07-summary-period-filter.yaml`:

```yaml
# Summary Period Filter Test
#
# Tests: Verifies period filter changes summary data
# Prerequisites:
# - User has lists with items across different periods

appId: com.karllasouzza.powerlists
tags:
  - ci
---
# ==========================================
# STEP 1: LAUNCH + NAVIGATE TO RESUMO
# ==========================================

- launchApp

- swipe:
    direction: DOWN
    duration: 100

- extendedWaitUntil:
    visible:
      id: "auth-loaded"
    timeout: 15000

- tapOn:
    text: "Resumo"

# ==========================================
# STEP 2: VERIFY DEFAULT PERIOD
# ==========================================

- assertVisible:
    text: "Todo o histórico"

- takeScreenshot: 17-default-period

# ==========================================
# STEP 3: CHANGE TO WEEK PERIOD
# ==========================================

- tapOn:
    text: "7 dias"
    optional: true

# OR using period filter component
- tapOn:
    id: "period-filter"
    optional: true

- tapOn:
    text: "Últimos 7 dias"
    optional: true

- takeScreenshot: 18-week-period

# ==========================================
# STEP 4: CHANGE TO MONTH PERIOD
# ==========================================

- tapOn:
    text: "30 dias"
    optional: true

- takeScreenshot: 19-month-period
```

---

## Passo 4.9: Atualizar rotas internas

### Ação

Atualizar todas as referências à rota `/dashboard`:

| Arquivo | Referência | Nova referência |
|---------|-----------|-----------------|
| `src/features/summary/page.tsx` | `router.push('/lists')` | `router.push('/')` |
| `src/app/(authenticated)/_layout.tsx` | `href={'/dashboard'}` | Manter (rota já criada) |

---

## Passo 4.10: Remover feature `dashboard` antiga

### Ação

Após verificar que tudo funciona:

```bash
git rm -r src/features/dashboard
```

### Checklist antes de remover

- [ ] Todos os testes E2E passam
- [ ] Nenhuma referência a `@/features/dashboard` no código
- [ ] Typecheck passa
- [ ] Barrel export em `index.ts` atualizado

---

## Passo 4.11: Typecheck e commit

### Ação

```bash
npx tsc --noEmit -p tsconfig.json
git add -A
git commit -m "refactor(summary): rename Dashboard to Summary, add quick cards, remove redundant sections"
```

---

## Validação Final (Fase 4)

### Testes E2E

```bash
maestro test .maestro/06-summary-cards.yaml
maestro test .maestro/07-summary-period-filter.yaml
```

### Checklist

- [ ] Feature `summary` criada com estrutura completa
- [ ] Tipos renomeados de `Dashboard*` para `Summary*`
- [ ] Quick cards mostram Total, Listas, Itens
- [ ] Period filter funciona (7 dias, 30 dias, 12 meses, Todos)
- [ ] Gráfico de pizza renderiza
- [ ] Variações de preço aparecem
- [ ] Seção "Listas recentes" removida (redundante)
- [ ] Feature `dashboard` antiga removida
- [ ] Todos os testes E2E passam
- [ ] Typecheck passa
