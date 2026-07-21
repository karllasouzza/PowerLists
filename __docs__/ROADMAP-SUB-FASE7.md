# Sub-Roadmap: Fase 7 — Deep Links e Universal Links

**Objetivo:** Verificar e atualizar deep links para a nova estrutura de rotas
**Duração estimada:** 1 dia
**Dependências:** Fases 1-6 concluídas

---

## Passo 7.1: Mapear deep links atuais

### Ação

Verificar configuração de deep links no `app.json`:

```bash
cat app.json | grep -A 20 "intentFilters"
```

### Configuração atual

```json
{
  "android": {
    "intentFilters": [
      {
        "action": "VIEW",
        "autoVerify": true,
        "data": [
          {
            "scheme": "https",
            "host": "powerlists.com",
            "pathPrefix": "/password-recovery"
          }
        ],
        "category": ["BROWSABLE", "DEFAULT"]
      }
    ]
  }
}
```

---

## Passo 7.2: Adicionar deep links para novas rotas

### Ação

Atualizar `app.json` para incluir deep links para as novas rotas:

```json
{
  "android": {
    "intentFilters": [
      {
        "action": "VIEW",
        "autoVerify": true,
        "data": [
          {
            "scheme": "https",
            "host": "powerlists.com",
            "pathPrefix": "/password-recovery"
          }
        ],
        "category": ["BROWSABLE", "DEFAULT"]
      },
      {
        "action": "VIEW",
        "autoVerify": true,
        "data": [
          {
            "scheme": "https",
            "host": "powerlists.com",
            "pathPrefix": "/lists"
          }
        ],
        "category": ["BROWSABLE", "DEFAULT"]
      }
    ]
  }
}
```

---

## Passo 7.3: Verificar scheme do Expo

### Ação

Verificar scheme no `app.json`:

```bash
cat app.json | grep "scheme"
```

### Configuração atual

```json
{
  "expo": {
    "scheme": "com.karllasouzza.powerlists"
  }
}
```

### Nota

O scheme é o bundle ID, não um scheme customizado. Para deep links internos, usar `powerlists://` ou `com.karllasouzza.powerlists://`.

---

## Passo 7.4: Criar teste `10-deep-links.yaml`

### Ação

Criar `.maestro/10-deep-links.yaml`:

```yaml
# Deep Links Test
#
# Tests: Verifies deep links navigate to correct screens
# Prerequisites:
# - App is installed on simulator/emulator
# - User is authenticated

appId: com.karllasouzza.powerlists
tags:
  - ci
  - deep-links
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
# STEP 2: TEST DEEP LINK TO LISTS
# ==========================================

# Open deep link to lists (should be index now)
- openLink: "powerlists://lists"

- extendedWaitUntil:
    visible:
      text: "Minhas Listas"
    timeout: 5000

- takeScreenshot: 29-deep-link-lists

# ==========================================
# STEP 3: TEST DEEP LINK TO LIST DETAIL
# ==========================================

# Open deep link to specific list (requires list ID)
# This test assumes a list with ID "test-list-id" exists
- openLink: "powerlists://lists/test-list-id"

- extendedWaitUntil:
    visible:
      text: "Adicionar item"
    optional: true
    timeout: 5000

- takeScreenshot: 30-deep-link-list-detail

# ==========================================
# STEP 4: TEST DEEP LINK TO PASSWORD RECOVERY
# ==========================================

# Open deep link to password recovery
- openLink: "powerlists://password-recovery"

- extendedWaitUntil:
    visible:
      text: "Recuperar senha"
    optional: true
    timeout: 5000

- takeScreenshot: 31-deep-link-password-recovery
```

---

## Passo 7.5: Verificar universal links (iOS)

### Ação

Verificar se universal links estão configurados no `app.json`:

```json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:powerlists.com"]
    }
  }
}
```

### Nota

Universal links requerem configuração no servidor (Apple App Site Association file). Verificar se `https://powerlists.com/.well-known/apple-app-site-association` existe.

---

## Passo 7.6: Typecheck e commit

### Ação

```bash
npx tsc --noEmit -p tsconfig.json
git add -A
git commit -m "fix(deep-links): update deep link configuration for new route structure"
```

---

## Validação Final (Fase 7)

### Teste E2E

```bash
maestro test .maestro/10-deep-links.yaml
```

### Checklist

- [ ] Deep link `powerlists://lists` navega para index
- [ ] Deep link `powerlists://lists/[id]` navega para detail
- [ ] Deep link `powerlists://password-recovery` funciona
- [ ] Universal links configurados (iOS)
- [ ] Intent filters configurados (Android)
- [ ] Typecheck passa
