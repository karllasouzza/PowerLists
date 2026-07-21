# Sub-Roadmap: Fase 5 — Atualização de Navegação Interna

**Objetivo:** Atualizar todas as referências de rota no código
**Duração estimada:** 1 dia
**Dependências:** Fases 1-4 concluídas

---

## Passo 5.1: Mapear todas as referências de rota

### Ação

Executar busca completa por referências de rota:

```bash
# Buscar referências a /list (rota removida)
grep -rn "pathname.*'/list'" src/ --include="*.ts" --include="*.tsx"

# Buscar referências a /lists (rota que vira index)
grep -rn "pathname.*'/lists'" src/ --include="*.ts" --include="*.tsx"

# Buscar referências a /dashboard (rota que vira /dashboard)
grep -rn "pathname.*'/dashboard'" src/ --include="*.ts" --include="*.tsx"

# Buscar router.push e router.navigate
grep -rn "router.push\|router.navigate" src/ --include="*.ts" --include="*.tsx"
```

---

## Passo 5.2: Criar mapa de referências

### Tabela de referências

| Arquivo | Referência atual | Nova referência | Status |
|---------|-----------------|-----------------|--------|
| `src/features/summary/page.tsx` | `router.push('/lists')` | `router.push('/')` | Pendente |
| `src/features/lists/components/card-list.tsx` | `pathname: '/lists/[id]'` | Manter | OK |
| `src/features/dashboard/page.tsx` | `pathname: '/lists/[id]'` | Manter | OK |
| `src/app/(authenticated)/_layout.tsx` | `href={'/dashboard'}` | Manter | OK |
| `src/app/_layout.tsx` | Redirect para `/(authenticated)` | Manter | OK |

---

## Passo 5.3: Atualizar referências

### Ação

Modificar `src/features/summary/page.tsx`:

```typescript
// ANTES
const handleViewAllLists = useCallback(() => {
  router.push('/lists');
}, [router]);

// DEPOIS
const handleViewAllLists = useCallback(() => {
  router.push('/');
}, [router]);
```

---

## Passo 5.4: Criar teste `08-internal-navigation.yaml`

### Ação

Criar `.maestro/08-internal-navigation.yaml`:

```yaml
# Internal Navigation Test
#
# Tests: Verifies all internal navigation paths work correctly
# Prerequisites:
# - User is authenticated
# - User has at least one list with items

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
# STEP 2: NAVIGATE TO LIST DETAIL
# ==========================================

# Tap on first list
- tapOn:
    id: "list-card-0"
    optional: true

# OR tap on list by text
- tapOn:
    text: "Minha Lista"
    optional: true

- takeScreenshot: 20-list-detail

# ==========================================
# STEP 3: VERIFY LIST DETAIL SCREEN
# ==========================================

# Should show list items
- assertVisible:
    text: "Adicionar item"
    optional: true

- takeScreenshot: 21-list-items

# ==========================================
# STEP 4: GO BACK TO LISTS
# ==========================================

- tapOn:
    id: "back-button"
    optional: true

# OR use system back
- swipe:
    direction: RIGHT
    duration: 300

- assertVisible:
    text: "Minhas Listas"
    optional: true

- takeScreenshot: 22-back-to-lists

# ==========================================
# STEP 5: NAVIGATE TO RESUMO
# ==========================================

- tapOn:
    text: "Resumo"

- assertVisible:
    text: "Resumo"

- takeScreenshot: 23-resumo-screen

# ==========================================
# STEP 6: NAVIGATE BACK TO LISTAS
# ==========================================

- tapOn:
    text: "Listas"

- assertVisible:
    text: "Minhas Listas"
    optional: true

- takeScreenshot: 24-back-to-lists-from-resumo
```

---

## Passo 5.5: Typecheck e commit

### Ação

```bash
npx tsc --noEmit -p tsconfig.json
git add -A
git commit -m "fix(navigation): update all internal route references for new tab structure"
```

---

## Validação Final (Fase 5)

### Teste E2E

```bash
maestro test .maestro/08-internal-navigation.yaml
```

### Checklist

- [ ] Todas as referências de rota atualizadas
- [ ] Navegação Listas → List Detail funciona
- [ ] Navegação List Detail → Listas funciona
- [ ] Navegação Listas → Resumo funciona
- [ ] Navegação Resumo → Listas funciona
- [ ] Nenhuma rota quebrada
- [ ] Typecheck passa
