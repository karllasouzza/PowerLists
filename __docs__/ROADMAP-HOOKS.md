# Sub-Roadmap: Padronização de Hooks (Fase 2)

**Objetivo:** Unificar nomenclatura de todos os hooks do projeto seguindo o padrão `use-{feature}-{purpose}.ts`

---

## Mapeamento Completo de Hooks

### Hooks globais (`src/hooks/`)

| Arquivo | Responsabilidade | Ação |
|---------|-----------------|------|
| `use-auth.ts` | Hook principal de autenticação (286 linhas) | Manter nome (padrão correto) |
| `use-user.ts` | Operações de usuário (create, update, delete) | Manter nome (padrão correto) |
| `use-observable-query.ts` | Wrapper para consultas WatermelonDB reativas | Manter nome (utilitário) |
| `use-countdown.ts` | Timer regressivo | Manter nome (utilitário) |
| `use-gradual-animation.tsx` | Animação gradual | Manter nome (utilitário) |

### Hooks de features (`src/features/*/hooks/`)

#### Auth

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-auth-page-logic.ts` | 36 | `features/auth/page.tsx` | `use-auth-page.ts` |

#### Create Account

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-create-account-logic.ts` | 50 | `features/create-account/page.tsx` | `use-create-account-page.ts` |

#### Dashboard

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-dashboard-page-logics.ts` | ~100 | `features/dashboard/page.tsx` | `use-dashboard-page.ts` |
| `use-item-variations-page-logics.ts` | ~80 | `features/dashboard/item-variations-page.tsx` | `use-item-variations-page.ts` |
| `use-item-price-comparison-logics.ts` | ~80 | `features/dashboard/item-price-comparison-page.tsx` | `use-item-comparison.ts` |

#### List (Detail)

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-list-items-page-logics.ts` | 138 | `features/list/page.tsx` | `use-list-items-page.ts` |

#### Lists

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-list-page-logics.ts` | 89 | `features/lists/page.tsx` | `use-lists-page.ts` |

#### Password Recovery

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-password-recovery-page-logic.ts` | ~60 | `features/password-recovery/page.tsx` | `use-password-recovery-page.ts` |

#### Request Password Recovery

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-request-password-recovery-page-logic.ts` | ~60 | `features/request-password-recovery/page.tsx` | `use-request-password-recovery-page.ts` |

#### Voice Assistant

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-voice-assistant-logics.ts` | 212 | `features/voice-assistant/page.tsx` | `use-voice-assistant.ts` |
| `use-assistant-audios.ts` | ~50 | `use-voice-assistant-logics.ts` | Manter (utilitário interno) |
| `use-list-item-creation-flow.ts` | ~100 | `use-voice-assistant-logics.ts` | Manter (utilitário interno) |

#### Account

| Arquivo atual | Linhas | Importado por | Novo nome |
|--------------|--------|---------------|-----------|
| `use-profile-data.tsx` | 30 | `features/account/page.tsx` | `use-account-page.ts` |

---

## Procedimento de Renomeação (por hook)

### Passo 1: Renomear o arquivo
```bash
git mv src/features/{feature}/hooks/{old}.ts src/features/{feature}/hooks/{new}.ts
```

### Passo 2: Atualizar exports (se houver barrel)
Se o hook é exportado via `index.ts`, atualizar o nome do export.

### Passo 3: Atualizar imports
```bash
# Encontrar todos os arquivos que importam o hook
grep -r "from.*{old}" src/ --include="*.ts" --include="*.tsx"
# Atualizar cada ocorrência
```

### Passo 4: Verificar typecheck
```bash
npx tsc --noEmit -p tsconfig.json
```

### Passo 5: Commit atômico
```bash
git add -A && git commit -m "refactor(hooks): rename {old} → {new}"
```

---

## Ordem de Execução (para minimizar conflitos)

1. `use-auth-page-logic.ts` → `use-auth-page.ts` (1 import)
2. `use-create-account-logic.ts` → `use-create-account-page.ts` (1 import)
3. `use-profile-data.tsx` → `use-account-page.ts` (1 import)
4. `use-password-recovery-page-logic.ts` → `use-password-recovery-page.ts` (1 import)
5. `use-request-password-recovery-page-logic.ts` → `use-request-password-recovery-page.ts` (1 import)
6. `use-list-page-logics.ts` → `use-lists-page.ts` (1 import)
7. `use-dashboard-page-logics.ts` → `use-dashboard-page.ts` (1 import)
8. `use-item-variations-page-logics.ts` → `use-item-variations-page.ts` (1 import)
9. `use-item-price-comparison-logics.ts` → `use-item-comparison.ts` (1 import)
10. `use-list-items-page-logics.ts` → `use-list-items-page.ts` (1 import)
11. `use-voice-assistant-logics.ts` → `use-voice-assistant.ts` (1 import)

**Total:** 11 renomeações, ~15 arquivos modificados
