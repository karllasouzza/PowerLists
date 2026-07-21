# Índice: Lists como Tela Primária

**Roadmap principal:** `ROADMAP-LISTS-PRIMARY.md`
**Data:** 20/07/2026

---

## Visão Geral

Transformar a tela de Listas na入口 principal do app, movendo o Dashboard para aba secundária "Resumo".

---

## Sub-Roadmaps por Fase

| Fase | Sub-roadmap | Duração | Validação E2E |
|------|-------------|---------|---------------|
| 1 — Inverter abas | `ROADMAP-SUB-FASE1.md` | 1 dia | `01-lists-primary.yaml`, `02-dashboard-secondary.yaml`, `03-tab-navigation.yaml` |
| 2 — Rótulos/ícones | `ROADMAP-SUB-FASE2.md` | 1 dia | `04-tab-icons.yaml` |
| 3 — TopBar | `ROADMAP-SUB-FASE3.md` | 1 dia | `05-topbar-resumo-button.yaml` |
| 4 — Dashboard→Summary | `ROADMAP-SUB-FASE4.md` | 1-2 dias | `06-summary-cards.yaml`, `07-summary-period-filter.yaml` |
| 5 — Navegação interna | `ROADMAP-SUB-FASE5.md` | 1 dia | `08-internal-navigation.yaml` |
| 6 — Empty state | `ROADMAP-SUB-FASE6.md` | 1 dia | `09-empty-state.yaml` |
| 7 — Deep links | `ROADMAP-SUB-FASE7.md` | 1 dia | `10-deep-links.yaml` |

**Total estimado:** 5-7 dias

---

## Estrutura de Testes E2E

```
.maestro/
├── config.yaml
├── flows/
│   ├── auth-preflight.yaml
│   └── navigate-to-lists.yaml
├── scripts/
│   └── mock-data.js
├── 01-lists-primary.yaml          # Fase 1
├── 02-dashboard-secondary.yaml    # Fase 1
├── 03-tab-navigation.yaml         # Fase 1
├── 04-tab-icons.yaml              # Fase 2
├── 05-topbar-resumo-button.yaml   # Fase 3
├── 06-summary-cards.yaml          # Fase 4
├── 07-summary-period-filter.yaml  # Fase 4
├── 08-internal-navigation.yaml    # Fase 5
├── 09-empty-state.yaml            # Fase 6
└── 10-deep-links.yaml             # Fase 7
```

---

## Ordem de Execução

```
Fase 1 (Inverter abas)         → 1 dia
    ↓ Validar: 01, 02, 03
Fase 2 (Rótulos/ícones)        → 1 dia
    ↓ Validar: 04
Fase 3 (TopBar)                → 1 dia
    ↓ Validar: 05
Fase 4 (Dashboard→Summary)     → 1-2 dias
    ↓ Validar: 06, 07
Fase 5 (Navegação)             → 1 dia
    ↓ Validar: 08
Fase 6 (Empty state)           → 1 dia
    ↓ Validar: 09
Fase 7 (Deep links)            → 1 dia
    ↓ Validar: 10
```

---

## Comandos Úteis

```bash
# Executar todos os testes E2E
maestro test .maestro/

# Executar teste específico
maestro test .maestro/01-lists-primary.yaml

# Executar com debug
maestro test --debug .maestro/01-lists-primary.yaml

# Gravar vídeo
maestro record .maestro/01-lists-primary.yaml

# Maestro Studio (interativo)
maestro studio
```

---

## Pré-requisitos para Testes

1. **Simulador/emulador rodando** com app instalado
2. **Java 17** instalado (para Maestro)
3. **Maestro CLI** instalado
4. **Usuário autenticado** no app (ou fluxo adaptativo)
5. **Pelo menos uma lista** criada (para testes que precisam de dados)

---

## Tags de Filtro

| Tag | Descrição |
|-----|-----------|
| `ci` | Testes para CI/CD |
| `smoke` | Testes de fumaça (rápidos) |
| `navigation` | Testes de navegação |
| `deep-links` | Testes de deep links |

```bash
# Executar apenas testes de CI
maestro test --include-tags ci .maestro/

# Executar apenas smoke tests
maestro test --include-tags smoke .maestro/

# Excluir testes de deep links
maestro test --exclude-tags deep-links .maestro/
```
