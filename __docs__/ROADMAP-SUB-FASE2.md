# Sub-Roadmap: Fase 2 — Rótulos e Ícones das Abas

**Objetivo:** Atualizar rótulos e ícones para refletir a nova hierarquia
**Duração estimada:** 1 dia
**Dependências:** Fase 1 concluída

---

## Passo 2.1: Definir nova paleta de ícones

### Decisão

| Aba | Ícone antigo | Ícone novo | Justificativa |
|-----|-------------|------------|---------------|
| Listas | `IconHome` / `IconHomeFilled` | `IconList` / `IconListFilled` | Comunica claramente "lista" |
| Resumo | `IconFolder` / `IconFolderFilled` | `IconChartBar` / `IconChartBarFilled` | Comunica "analytics/gráfico" |
| Perfil | `IconUser` / `IconUserFilled` | Manter | Já é claro |

### Verificar disponibilidade

```bash
grep -r "IconList\|IconChartBar" node_modules/@tabler/icons-react-native 2>/dev/null | head -5
```

---

## Passo 2.2: Atualizar `_layout.tsx` com novos ícones

### Ação

Modificar `src/app/(authenticated)/_layout.tsx`:

```typescript
import {
  IconList,
  IconListFilled,
  IconChartBar,
  IconChartBarFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react-native';

// Na seção de TabTriggers:
<TabTrigger name="index" href={'/lists'} asChild>
  <TabButton icon={IconList} focusedIcon={IconListFilled} label="Listas" />
</TabTrigger>
<TabTrigger name="dashboard" href={'/dashboard'} asChild>
  <TabButton icon={IconChartBar} focusedIcon={IconChartBarFilled} label="Resumo" />
</TabTrigger>
<TabTrigger name="account" href={'/account'} asChild>
  <TabButton icon={IconUser} focusedIcon={IconUserFilled} label="Perfil" />
</TabTrigger>
```

---

## Passo 2.3: Criar teste `04-tab-icons.yaml`

### Ação

Criar `.maestro/04-tab-icons.yaml`:

```yaml
# Tab Icons and Labels Test
#
# Tests: Verifies correct icons and labels on each tab
# Prerequisites:
# - User is authenticated

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
# STEP 2: VERIFY LISTAS TAB
# ==========================================

# Listas tab should be selected by default
- assertVisible:
    text: "Listas"
    selected: true

- takeScreenshot: 09-listas-tab-selected

# ==========================================
# STEP 3: VERIFY RESUMO TAB
# ==========================================

- tapOn:
    text: "Resumo"

- assertVisible:
    text: "Resumo"
    selected: true

- takeScreenshot: 10-resumo-tab-selected

# ==========================================
# STEP 4: VERIFY PERFIL TAB
# ==========================================

- tapOn:
    text: "Perfil"

- assertVisible:
    text: "Perfil"
    selected: true

- takeScreenshot: 11-perfil-tab-selected
```

---

## Passo 2.4: Typecheck e commit

### Ação

```bash
npx tsc --noEmit -p tsconfig.json
git add -A
git commit -m "feat(ui): update tab icons and labels for new hierarchy"
```

---

## Validação Final (Fase 2)

### Teste E2E

```bash
maestro test .maestro/04-tab-icons.yaml
```

### Checklist

- [ ] Ícone de lista aparece na aba "Listas"
- [ ] Ícone de gráfico aparece na aba "Resumo"
- [ ] Ícone de perfil aparece na aba "Perfil"
- [ ] Rótulos estão corretos: "Listas", "Resumo", "Perfil"
- [ ] Tab selecionada tem ícone preenchido (filled)
- [ ] Typecheck passa
