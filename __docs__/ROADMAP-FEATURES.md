# Sub-Roadmap: Estrutura de Features (Fase 3)

**Objetivo:** Padronizar estrutura interna de cada feature e renomear `list` → `list-detail`

---

## Situação Atual

### Features com estrutura completa (`page.tsx`, `index.ts`, `hooks/`, `components/`, `modals/`, `utils/`, `types/`)

| Feature | `page.tsx` | `index.ts` | `hooks/` | `components/` | `modals/` | `utils/` | `types/` |
|---------|-----------|-----------|---------|--------------|----------|---------|---------|
| `account` | ✅ | ✅ | ✅ (hook na raiz) | ✅ | ✅ | ❌ | ❌ |
| `create-account` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `dashboard` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `lists` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `voice-assistant` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

### Features incompletas

| Feature | `page.tsx` | `index.ts` | `hooks/` | `components/` | `modals/` | `utils/` | `types/` |
|---------|-----------|-----------|---------|--------------|----------|---------|---------|
| `auth` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `list` | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `login` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `onboarding` | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| `password-recovery` | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `request-password-recovery` | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |

---

## Renomeação: `list` → `list-detail`

### Por que?

A feature `src/features/list/` gerencia os **itens de uma lista específica** (tela de detalhe). O nome `list` é ambíguo com `lists` (gerenciamento de listas). Renomear para `list-detail` torna a intenção óbvia.

### Mapeamento de dependências

#### Arquivos a renomear

| De | Para |
|----|------|
| `src/features/list/` | `src/features/list-detail/` |
| `src/app/(authenticated)/list.tsx` | `src/app/(authenticated)/list-detail.tsx` |

#### Imports a atualizar

| Arquivo | Import atual | Novo import |
|---------|-------------|-------------|
| `src/app/(authenticated)/list.tsx` | `@/features/list/page` | `@/features/list-detail/page` |
| `src/app/(authenticated)/_layout.tsx` | Referência a `/list` | `/list-detail` |
| `src/features/dashboard/page.tsx` | `router.push({ pathname: '/list' })` | `router.push({ pathname: '/list-detail' })` |
| `src/features/dashboard/hooks/use-dashboard-page-logics.ts` | `pathname: '/list'` | `pathname: '/list-detail'` |

#### Verificação de dependências

```bash
# Encontrar todas as referências a '/list' (rota)
grep -r "pathname.*'/list'" src/ --include="*.ts" --include="*.tsx"
grep -r "href.*'/list'" src/ --include="*.ts" --include="*.tsx"
grep -r "navigate.*'/list'" src/ --include="*.ts" --include="*.tsx"

# Encontrar imports de features/list
grep -r "from.*@/features/list" src/ --include="*.ts" --include="*.tsx"
```

### Procedimento

1. Criar diretório `src/features/list-detail/`
2. Mover conteúdo de `src/features/list/` para `src/features/list-detail/`
3. Renomear `src/app/(authenticated)/list.tsx` → `list-detail.tsx`
4. Atualizar `src/app/(authenticated)/_layout.tsx` (rota `/list` → `/list-detail`)
5. Atualizar todas as referências de rota no código
6. Atualizar todos os imports de `@/features/list/` para `@/features/list-detail/`
7. Criar `src/features/list-detail/index.ts` (barrel export)
8. Typecheck
9. Commit atômico

---

## Adicionar `index.ts` em features sem barrel

### Padrão de barrel export

```typescript
// src/features/{feature}/index.ts
export { default } from './page';
```

### Features a atualizar

| Feature | Ação |
|---------|------|
| `auth` | Criar `index.ts` exportando `page` e `useAuthPageLogic` |
| `onboarding` | Criar `index.ts` exportando `page` |
| `password-recovery` | Criar `index.ts` exportando `page` |
| `request-password-recovery` | Criar `index.ts` exportando `page` |
| `list-detail` (após renomeação) | Criar `index.ts` exportando `page` |

### Observação

Nem todos os imports devem usar barrels. Regra:
- **Page-level imports** (rota → feature): usar barrel
- **Internal feature imports** (component → hook): import direto é aceitável

---

## Resumo de Impacto

| Ação | Arquivos movidos | Arquivos renomeados | Imports atualizados |
|------|-----------------|--------------------|--------------------|
| `list` → `list-detail` | ~15 | 2 | ~8 |
| Adicionar `index.ts` | 0 | 0 | 0 (criação) |
| **Total** | ~15 | 2 | ~8 |
