# Roadmap de Qualidade e Organização — PowerLists

**Data:** 20/07/2026
**Escopo:** Qualidade de código, nomenclatura, organização de arquivos, consistência, segurança de tipos

---

## Diagnóstico Geral

| Dimensão | Nota | Resumo |
|----------|------|--------|
| Nomenclatura | 🔴 Fraca | Typos em nomes de arquivo (`asistant`, `shema`); padrões de hook inconsistentes; singular/plural confuso |
| Estrutura de features | 🟠 Média | 5/11 features sem `index.ts`; estrutura interna varia entre features |
| Código morto | 🟠 Média | Tipos React Navigation órfãos; importações não utilizadas |
| Type safety | 🟡 Média | `navigation: any`; `console.error` sem tratamento adequado |
| Testes | 🔴 Fraca | Apenas 9 arquivos de teste; features core sem cobertura |
| Organização de imports | 🟡 Média | Mistura de imports diretos vs barrel exports |
| Estado global | 🟠 Média | `authState.ts` usa singleton com variáveis globais (não idiomático React) |

---

## FASE 1 — Typos e Correções Críticas (1 dia)

> Corrigir erros visíveis que causam confusão imediata.

### 1.1 Renomear arquivos com typos

| Arquivo atual | Novo nome | Criticidade |
|--------------|-----------|-------------|
| `src/app/(authenticated)/lists/[id]/asistant.ts` | `assistant.ts` | 🔴 Alta |
| `src/features/voice-assistant/components/asistant-message.tsx` | `assistant-message.tsx` | 🔴 Alta |
| `src/features/login/utils/shema.ts` | `schema.ts` | 🔴 Alta |

**Ação:** Renomear arquivos + atualizar todas as importações que os referenciam.

### 1.2 Renomear `profile.ts` → `auth-profile.ts`

`src/database/operations/profile.ts` lida com autenticação (reauthenticate, updatePassword), não com o modelo Profile. Renomear para `auth-profile.ts` evita confusão com `profiles.ts`.

---

## FASE 2 — Padronização de Nomenclatura de Hooks (1-2 dias)

> Unificar o padrão de nomes de hooks do projeto.

### 2.1 Padrão atual (inconsistente)

| Hook | Padrão usado |
|------|-------------|
| `use-auth-page-logic.ts` | `use-{feature}-page-logic` (singular) |
| `use-list-page-logics.ts` | `use-{feature}-page-logics` (plural) |
| `use-profile-data.tsx` | `use-{feature}-data` |
| `use-create-account-logic.ts` | `use-{feature}-logic` |
| `use-dashboard-page-logics.ts` | `use-{feature}-page-logics` |
| `use-voice-assistant-logics.ts` | `use-{feature}-logics` |
| `use-list-items-page-logics.ts` | `use-{feature}-page-logics` |

### 2.2 Padrão proposto

```
use-{feature}-{purpose}.ts
```

| Atual | Proposto |
|-------|----------|
| `use-auth-page-logic.ts` | `use-auth-page.ts` |
| `use-list-page-logics.ts` | `use-lists-page.ts` |
| `use-profile-data.tsx` | `use-account-page.ts` |
| `use-create-account-logic.ts` | `use-create-account-page.ts` |
| `use-dashboard-page-logics.ts` | `use-dashboard-page.ts` |
| `use-voice-assistant-logics.ts` | `use-voice-assistant.ts` |
| `use-list-items-page-logics.ts` | `use-list-items-page.ts` |
| `use-item-variations-page-logics.ts` | `use-item-variations-page.ts` |
| `use-item-price-comparison-logics.ts` | `use-item-comparison.ts` |
| `use-request-password-recovery-page-logic.ts` | `use-request-password-recovery-page.ts` |
| `use-password-recovery-page-logic.ts` | `use-password-recovery-page.ts` |

**Ação:** Renomear cada hook + atualizar imports em todos os arquivos que os referenciam.

---

## FASE 3 — Estrutura de Features (1-2 dias)

> Padronizar a estrutura interna de cada feature.

### 3.1 Adicionar `index.ts` barrel export em features que não têm

| Feature | Tem `index.ts`? | Ação |
|---------|----------------|------|
| `src/features/auth/` | ❌ | Criar `index.ts` exportando page e hooks |
| `src/features/list/` | ❌ | Criar `index.ts` exportando page |
| `src/features/onboarding/` | ❌ | Criar `index.ts` exportando page |
| `src/features/password-recovery/` | ❌ | Criar `index.ts` exportando page |
| `src/features/request-password-recovery/` | ❌ | Criar `index.ts` exportando page |

### 3.2 Renomear feature `list` → `list-detail`

A feature `src/features/list/` (singular) lida com os **itens de uma lista específica** (tela de detalhe). O nome `list` é confuso com `lists`. Renomear para `list-detail` torna a intenção clara.

| Atual | Proposto |
|-------|----------|
| `src/features/list/` | `src/features/list-detail/` |
| `src/app/(authenticated)/list.tsx` | `src/app/(authenticated)/list-detail.tsx` |

**Impacto:** Atualizar todas as importações de `@/features/list/` para `@/features/list-detail/`.

---

## FASE 4 — Limpeza de Código Morto (1 dia)

> Remover código que não é mais utilizado.

### 4.1 Remover `ListItemsScreenProps` de `features/list/types/index.ts`

O tipo `ListItemsScreenProps` usa API de React Navigation (`navigation: any`, `route: { params: { list: List } }`). Com Expo Router, esse tipo é inválido e não é referenciado em nenhum lugar.

**Verificação:**
```bash
grep -r "ListItemsScreenProps" src/ --include="*.ts" --include="*.tsx"
```

### 4.2 Verificar e limpar imports não utilizados

Executar ESLint com regra `@typescript-eslint/no-unused-vars` e corrigir.

### 4.3 Verificar código órfão no `src/types/user.ts`

Os tipos `CreateUserGuestProps` e `CreateUserGuestResult` estão marcados como "Legacy types (manter para compatibilidade temporária)". Verificar se ainda são usados:

```bash
grep -r "CreateUserGuestProps\|CreateUserGuestResult" src/ --include="*.ts" --include="*.tsx"
```

Se não usados, remover.

---

## FASE 5 — Type Safety (1-2 dias)

> Melhorar segurança de tipos e reduzir uso de `any`.

### 5.1 Tipar props de componentes que usam `any`

| Arquivo | Problema | Solução |
|---------|----------|---------|
| `features/list/types/index.ts` | `navigation: any` | Remover tipo morto (Fase 4) |
| `features/lists/page.tsx:40` | `renderList` recebe `any` | Tipar como `List` |

### 5.2 Substituir `console.error` por tratamento adequado

Múltiplos arquivos usam `console.error` para tratar erros. Em produção, isso não gera visibilidade. Considerar:
- Usar `showToast` já existente para erros visíveis ao usuário
- Adicionar Error Boundary em rotas críticas

### 5.3 Tipar parâmetros de busca

`useLocalSearchParams<{ id: string }>()` é usado em vários hooks. Criar tipos compartilhados para os parâmetros de busca de cada rota.

---

## FASE 6 — Organização de Imports (1 dia)

> Padronizar como imports são feitos no projeto.

### 6.1 Definir regra: sempre usar barrel exports

Quando uma feature tem `index.ts`, todos os imports devem usar o barrel:

```typescript
// ❌ Import direto
import { CardList } from '@/features/lists/components/card-list';

// ✅ Import via barrel (quando disponível)
import { CardList } from '@/features/lists';
```

### 6.2 Mover `authState.ts` para `src/hooks/` ou criar barrel

`authState.ts` é importado diretamente de 10+ arquivos. Criar um barrel em `src/features/auth/index.ts` que re-exporta `authState` reduz o acoplamento ao path interno.

---

## FASE 7 — Cobertura de Testes (2-3 dias)

> Expandir testes para features core.

### 7.1 Mapeamento de cobertura atual

| Feature | Tem testes? | Prioridade |
|---------|------------|------------|
| `auth` | ✅ `use-auth.test.tsx`, `use-user.test.tsx` | — |
| `lists` | ✅ `use-list-page-logics.property.test.ts`, `price-calcs.property.test.ts` | — |
| `dashboard` | ✅ `dashboard-metrics.property.test.ts` | — |
| `voice-assistant` | ✅ `parse-transcript.property.test.ts`, `speech-recognition-service.property.test.ts` | — |
| `utils` | ✅ `formatters.property.test.ts`, `currency.property.test.ts` | — |
| `list-detail` | ❌ | 🟠 Alta |
| `login` | ❌ | 🟡 Média |
| `create-account` | ❌ | 🟡 Média |
| `account` | ❌ | 🟡 Média |
| `onboarding` | ❌ | 🟢 Baixa |

### 7.2 Testes a criar (prioridade)

1. **`list-detail`** — `use-list-items-page-logics.ts` (core do produto)
2. **`login`** — Validação de schema, fluxo de submissão
3. **`create-account`** — Validação de schema, fluxo de submissão
4. **`account`** — `use-profile-data.tsx`

---

## FASE 8 — Estado Global (2-3 dias)

> Avaliar se `authState.ts` deve ser migrado para React Context.

### 8.1 Problema atual

`src/features/auth/authState.ts` usa variáveis globais (`let currentUser`, `let currentSession`, `listeners`). Isso:
- Funciona, mas não é idiomático React
- Dificulta testes (estado compartilhado entre testes)
- Pode causar-memory leaks se listeners não forem removidos corretamente

### 8.2 Opções

| Opção | Esforço | Risco |
|-------|---------|-------|
| Manter como está (funciona) | 0 | Baixo |
| Migrar para React Context | Alto | Médio |
| Usar Zustand/Jotai | Médio | Baixo |

**Recomendação:** Manter como está por enquanto (funciona e é testado), mas documentar a decisão no `STATE.md`.

---

## Ordem de Execução

```
Fase 1 (Typos)          → 1 dia
    ↓
Fase 2 (Hooks)          → 1-2 dias
    ↓
Fase 3 (Features)       → 1-2 dias
    ↓
Fase 4 (Código morto)   → 1 dia
    ↓
Fase 5 (Type safety)    → 1-2 dias
    ↓
Fase 6 (Imports)        → 1 dia
    ↓
Fase 7 (Testes)         → 2-3 dias
    ↓
Fase 8 (Estado global)  → Decisão/documentação
```

**Total estimado:** 8-12 dias de trabalho

---

## Métricas de Sucesso

| Métrica | Antes | Depois |
|---------|-------|--------|
| Typos em nomes de arquivo | 3 | 0 |
| Padrões de hook distintos | 5 | 1 |
| Features sem `index.ts` | 5 | 0 |
| Arquivos de teste | 9 | 13+ |
| Uso de `any` em props | 2+ | 0 |
| Código morto (tipos órfãos) | 1+ | 0 |

---

## Sub-Roadmaps Detalhados

Para as fases mais complexas, existem documentos de apoio com mapeamento completo de dependências e procedimentos passo a passo:

| Fase | Sub-roadmap | Conteúdo |
|------|-------------|----------|
| Fase 2 — Hooks | `ROADMAP-HOOKS.md` | Mapeamento de todos os hooks, padrão proposto, ordem de renomeação |
| Fase 3 — Features | `ROADMAP-FEATURES.md` | Renomeação `list` → `list-detail`, adição de barrels, estrutura padrão |
| Fase 5 — Types | `ROADMAP-TYPES.md` | Tipos de parâmetros de busca, eliminação de `any`, tratamento de erros |
| Fase 7 — Testes | `ROADMAP-TESTS.md` | Testes a criar, padrão property-based, dados de teste, configuração |
