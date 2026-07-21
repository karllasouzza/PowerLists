# Roadmap: Lists como Tela Primária

**Data:** 20/07/2026
**Objetivo:** Tornar a tela de Listas a入口 principal do app, movendo o Dashboard para secundário

---

## Diagnóstico Atual

### Estrutura de abas (hoje)

```
[Início (Dashboard)] → [Listas] → [Perfil]
```

### Problema central

O usuário abre o app → vê o Dashboard (gráficos, variações de preço) → precisa navegar para Listas para fazer a ação principal (criar/editar/comprar).

**Isso é invertido.** A ação primária de um app de lista de compras é:
1. Ver suas listas
2. Abrir uma lista
3. Adicionar/marcar itens
4. Comprar

Analytics e gráficos são secundários — o usuário consulta quando quer, não é o entry point.

### Fluxo do usuário vs fluxo atual

| O que o usuário quer fazer | Fluxo atual | Fluxo ideal |
|---------------------------|-------------|-------------|
| Criar uma lista | Abre app → clica em "Listas" → clica "+" | Abre app → clica "+" |
| Ver minhas listas | Abre app → clica em "Listas" | Abre app (já vê) |
| Adicionar item | Abre app → clica em "Listas" → clica na lista → clica "+" | Abre app → clica na lista → clica "+" |
| Quanto gastei este mês? | Abre app (já vê no Dashboard) | Abre app → clica em "Resumo" |

---

## Decisões de Design

### 1. Qual tela vira a primária?

**Decisão:** A tela de Listas (`src/features/lists/page.tsx`) vira a tela raiz (index) do usuário autenticado.

**Por quê?**
- É onde o usuário passa 90% do tempo
- É a ação de maior valor (criar, editar, comprar)
- Reduz cliques para a ação principal
- Padrão de mercado: AnyList, OurGroceries, Listonic — todos abrem na lista

### 2. O que acontece com o Dashboard?

**Decisão:** Dashboard vira uma aba secundária chamada "Resumo" com ícone de gráfico.

**Por quê?**
- Mantém a funcionalidade (não deletar código testado)
- Analytics é valioso, mas não é o entry point
- Renomear de "Início" para "Resumo" comunica claramente que é uma tela de consulta

### 3. Quantas abas?

**Decisão:** Manter 3 abas: `[Listas] → [Resumo] → [Perfil]`

**Por quê?**
- 3 abas é o padrão mobile para apps com poucas seções
- Não adicionar complexidade desnecessária
- "Resumo" fica no centro (posição de destaque para quem quer ver analytics)

---

## Fluxo de Implementação

### Fase 1: Inverter ordem das abas (1 dia)

**Ação:** Trocar a ordem no `_layout.tsx` para que Listas seja a primeira aba.

| Atual | Proposto |
|-------|----------|
| `<TabTrigger name="index" href={'/'}>` (Dashboard) | `<TabTrigger name="index" href={'/lists'}>` (Listas) |
| `<TabTrigger name="lists" href={'/lists'}>` (Listas) | `<TabTrigger name="dashboard" href={'/dashboard'}>` (Resumo) |

**Arquivos a modificar:**
- `src/app/(authenticated)/_layout.tsx` — reordenar triggers
- `src/app/(authenticated)/index.tsx` — redirecionar para `/lists`
- `src/app/(authenticated)/lists.tsx` → `src/app/(authenticated)/index.tsx` ( Lists vira index)

**Rota proposta:**

```
(authenticated)/
├── index.tsx              → Lists page (ANTES era lists.tsx)
├── dashboard.tsx          → Dashboard page (ANTES era index.tsx)
├── account.tsx            → Account page (sem mudança)
├── assistant.tsx          → Voice assistant (sem mudança)
├── item-variations.tsx    → Item variations (sem mudança)
├── item-comparison.tsx    → Item comparison (sem mudança)
└── lists/
    ├── [id]/
    │   ├── index.ts       → List detail (sem mudança)
    │   └── assistant.ts   → Voice assistant per list (sem mudança)
    └── _layout.tsx        → Stack layout (sem mudança)
```

### Fase 2: Atualizar rótulos e ícones (1 dia)

**Ação:** Renomear "Início" → "Resumo" e trocar ícone do Dashboard.

| Aba | Ícone atual | Ícone proposto | Label |
|-----|------------|----------------|-------|
| Listas (index) | `IconHome` / `IconHomeFilled` | `IconList` / `IconListFilled` | "Listas" |
| Resumo (dashboard) | `IconFolder` / `IconFolderFilled` | `IconChartBar` / `IconChartBarFilled` | "Resumo" |
| Perfil | `IconUser` / `IconUserFilled` | Manter | "Perfil" |

**Arquivo:** `src/app/(authenticated)/_layout.tsx`

### Fase 3: TopBar da tela de listas (1 dia)

**Ação:** Atualizar a TopBar da lista para refletir que é a tela principal.

| Elemento | Atual | Proposto |
|----------|-------|----------|
| Título | "Minhas Listas" | "PowerLists" (marca) ou "Minhas Listas" |
| Busca | "Procurando por algo?" | Manter |
| Ação direita | Nenhuma | Botão "Resumo" (navega para dashboard) |

**Arquivo:** `src/features/lists/page.tsx`

### Fase 4: Dashboard como "Resumo" (1-2 dias)

**Ação:** Renomear e refatorar o Dashboard para ser uma tela de resumo/consultas.

#### 4.1 Renomear feature

| Atual | Proposto |
|-------|----------|
| `src/features/dashboard/` | `src/features/summary/` |

#### 4.2 Renomear componentes internos

| Atual | Proposto |
|-------|----------|
| `DashboardPage` | `SummaryPage` |
| `useDashboardPageLogics` | `useSummaryPage` |
| `DashboardSummary` | `SummaryData` |
| `DashboardPieSlice` | `SummaryPieSlice` |
| `DashboardRecentListCard` | `SummaryRecentListCard` |
| `DashboardItemVariation` | `SummaryItemVariation` |

#### 4.3 Refatorar layout do Dashboard

O Dashboard atual tem:
1. PeriodFilter (seletor de período)
2. PieChart (gastos por lista)
3. RecentListsSection (listas recentes)
4. ItemVariationSection (altas/quedas de preço)

**Refatoração proposta:**

```
Resumo
├── Header com período (mantido)
├── Cards de resumo rápido (NOVO)
│   ├── "Total gasto no mês" (card grande)
│   ├── "Listas ativas" (card)
│   └── "Economia estimada" (card)
├── Gráfico de gastos por período (mantido, mas simplificado)
├── Variações de preço (mantido, mas como seção colapsável)
└── Listas recentes (removido — já está na tela principal)
```

**Por quê?**
- "Listas recentes" é redundante com a tela de listas
- Cards de resumo rápido dão informação imediata sem scroll
- Variações de preço ficam em seção colapsável (não é o foco)

### Fase 5: Atualizar navegação interna (1 dia)

**Ação:** Atualizar todas as referências de rota que apontam para `/lists` ou `/list`.

| Arquivo | Referência | Nova referência |
|---------|-----------|-----------------|
| `src/features/summary/page.tsx` | `router.push('/lists')` | `router.push('/')` |
| `src/features/lists/components/card-list.tsx` | `pathname: '/lists/[id]'` | Manter (rota de detalhe não muda) |
| `src/app/(authenticated)/_layout.tsx` | `SCREENS_WITH_HIDDEN_TABS` | Atualizar |

### Fase 6: Empty state da tela principal (1 dia)

**Ação:** Melhorar o empty state da lista de listas (agora é a primeira tela que o usuário vê).

**Melhorias:**
- Adicionar ilustração (reutilizar do onboarding)
- Copy mais persuasiva
- Dicas de uso ("Adicione itens por voz", "Compare preços")

**Arquivo:** `src/features/lists/page.tsx`

### Fase 7: Deep links e universal links (1 dia)

**Ação:** Verificar se deep links apontam para a rota correta.

| Link | Rota atual | Nova rota |
|------|-----------|-----------|
| `powerlists.com/lists` | `/lists` | `/` (index) |
| `powerlists.com/list/[id]` | `/list` (removida) | `/lists/[id]` |

**Arquivo:** `src/app/_layout.tsx`, `app.json` (intent filters)

---

## Resumo de Impacto

| Fase | Arquivos modificados | Arquivos movidos/renomeados | Risco |
|------|---------------------|---------------------------|-------|
| 1 — Inverter abas | 3 | 2 (rotas) | Baixo |
| 2 — Rótulos/ícones | 1 | 0 | Baixo |
| 3 — TopBar listas | 1 | 0 | Baixo |
| 4 — Dashboard→Summary | ~15 | ~15 (feature rename) | Médio |
| 5 — Navegação interna | 3-5 | 0 | Baixo |
| 6 — Empty state | 1 | 0 | Baixo |
| 7 — Deep links | 2 | 0 | Baixo |

**Total estimado:** 5-7 dias

---

## Ordem de Execução

```
Fase 1 (Inverter abas)     → 1 dia
    ↓
Fase 2 (Rótulos/ícones)    → 1 dia
    ↓
Fase 3 (TopBar)            → 1 dia
    ↓
Fase 4 (Dashboard→Summary) → 1-2 dias
    ↓
Fase 5 (Navegação)         → 1 dia
    ↓
Fase 6 (Empty state)       → 1 dia
    ↓
Fase 7 (Deep links)        → 1 dia
```

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Deep links quebrados | Alto | Verificar intent filters no app.json |
| Navegação interna inconsistente | Médio | Busca completa por referências de rota antes de cada fase |
| Dashboard perde dados | Alto | Não deletar código, apenas renomear/mover |
| Usuários existentes confundem | Baixo | A mudanã é intuitiva (listas é o entry point óbvio) |

---

## Métricas de Sucesso

| Métrica | Antes | Depois |
|---------|-------|--------|
| Cliques para criar lista | 3 (abrir → Listas → +) | 1 (abrir → +) |
| Cliques para ver analytics | 0 (já no Dashboard) | 2 (abrir → Resumo) |
| Tela de entry point | Dashboard (analytics) | Listas (ação principal) |
| Nome da aba de analytics | "Início" (confuso) | "Resumo" (claro) |

---

## Sub-Roadmaps Detalhados

Para execução detalhada de cada fase, incluindo passo a passo, código de exemplo e testes E2E:

| Fase | Sub-roadmap | Testes E2E |
|------|-------------|------------|
| 1 — Inverter abas | `ROADMAP-SUB-FASE1.md` | `01-lists-primary.yaml`, `02-dashboard-secondary.yaml`, `03-tab-navigation.yaml` |
| 2 — Rótulos/ícones | `ROADMAP-SUB-FASE2.md` | `04-tab-icons.yaml` |
| 3 — TopBar | `ROADMAP-SUB-FASE3.md` | `05-topbar-resumo-button.yaml` |
| 4 — Dashboard→Summary | `ROADMAP-SUB-FASE4.md` | `06-summary-cards.yaml`, `07-summary-period-filter.yaml` |
| 5 — Navegação | `ROADMAP-SUB-FASE5.md` | `08-internal-navigation.yaml` |
| 6 — Empty state | `ROADMAP-SUB-FASE6.md` | `09-empty-state.yaml` |
| 7 — Deep links | `ROADMAP-SUB-FASE7.md` | `10-deep-links.yaml` |

**Índice completo:** `ROADMAP-LISTS-INDEX.md`
