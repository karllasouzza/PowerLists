# Sub-Roadmap: Type Safety (Fase 5)

**Objetivo:** Eliminar `any`, tipar props corretamente, adicionar tipos de parâmetros de busca

---

## Problemas Identificados

### 1. Uso de `any` em props

| Arquivo | Linha | Problema | Solução |
|---------|-------|----------|---------|
| `features/list/types/index.ts:12` | `navigation: any` | Tipo morto (React Navigation) | Remover (Fase 4) |
| `features/lists/page.tsx:40` | `renderList` recebe `any` | Falta tipo | Tipar como `List` |

### 2. Parâmetros de busca não tipados

`useLocalSearchParams` é usado em vários hooks sem tipo compartilhado:

| Hook | Rota | Parâmetros |
|------|------|------------|
| `use-list-items-page-logics.ts` | `/list-detail` | `{ id: string }` |
| `use-voice-assistant-logics.ts` | `/assistant` | `{ id: string }` |
| `use-item-variations-page-logics.ts` | `/item-variations` | `{ period?: string }` |
| `use-item-comparison.ts` | `/item-comparison` | `{ itemKey: string; itemTitle: string; period: string }` |

### 3. `console.error` sem tratamento adequado

Múltiplos arquivos usam `console.error` para tratar erros:

| Arquivo | Uso |
|---------|-----|
| `hooks/use-auth.ts` | `console.error('Error on signInWithPassword:', error)` |
| `hooks/use-user.ts` | `console.error('Error creating guest user:', error)` |
| `features/list/hooks/use-list-items-page-logics.ts` | `console.error('[ListItemsScreen] Error toggling item check:', error)` |
| `features/dashboard/hooks/use-dashboard-page-logics.ts` | `console.error` |
| `features/voice-assistant/hooks/use-voice-assistant-logics.ts` | (usa `showToast` - correto) |

---

## Soluções

### 1. Criar tipos de parâmetros de busca

Criar `src/types/routes.ts`:

```typescript
export type ListDetailParams = { id: string };
export type AssistantParams = { id: string };
export type ItemVariationsParams = { period?: string };
export type ItemComparisonParams = {
  itemKey: string;
  itemTitle: string;
  period: string;
};
```

### 2. Tipar `renderList` em `lists/page.tsx`

```typescript
// Antes
const renderList = useCallback(
  (list: any) => (
    <AsyncCardList
      list={list}
      ...
    />
  ),
  [...]
);

// Depois
import type { List } from '@/types';

const renderList = useCallback(
  (list: List) => (
    <AsyncCardList
      list={list}
      ...
    />
  ),
  [...]
);
```

### 3. Substituir `console.error` por tratamento adequado

Para erros visíveis ao usuário, usar `showToast`:
```typescript
// Antes
catch (error) {
  console.error('Error toggling item check:', error);
}

// Depois
catch (error) {
  console.error('Error toggling item check:', error);
  showToast({
    type: 'error',
    title: 'Erro ao atualizar item',
    subtitle: 'Tente novamente.',
  });
}
```

---

## Ordem de Execução

1. Criar `src/types/routes.ts` com tipos de parâmetros
2. Atualizar hooks para usar tipos de rota
3. Tipar `renderList` em `lists/page.tsx`
4. Adicionar `showToast` em `console.error` em points críticos

**Total estimado:** 1-2 dias
