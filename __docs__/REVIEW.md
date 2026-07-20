# Relatório de Review — PowerLists

**Data:** 16/07/2026
**Escopo:** Facilidade de uso (UX), Produto (value prop + features) e Marca (identidade visual + consistência)
**Base analisada:** código-fonte (`src/`), `app.json`, `package.json`, `assets/`, `__docs__/RULES.md`, `.qoder/repowiki`

---

## 1. Visão Geral

PowerLists é um app React Native/Expo (v1.0.0) de **listas de compras inteligentes**. Diferenciais claros:
- Total em tempo real por lista (preço × quantidade) — `use-list-page-logics.ts`, `list-totals.ts`
- **Assistente de voz** para adicionar itens por comando de voz (`voice-assistant`, `expo-speech-recognition`, sons de feedback)
- **Comparação de variações/preços** de itens (`item-variations`, `item-comparison`) — funcionalidade rara e forte
- Modo convidado (local-first via WatermelonDB) + sync em nuvem (Supabase)
- Tema claro/escuro + tema roxo alternativo, personalizável por lista (5 cores de acento)

A arquitetura é sólida e moderna (Expo Router, WatermelonDB reativo, RN Primitives, NativeWind, React 19). O produto tem potencial real. Abaixo, os pontos de melhoria por dimensão.

---

## 2. FACILIDADE (UX)

### Pontos fortes
- Onboarding de 3 passos com ilustrações e CTA claro ("Começar") — `onboarding/page.tsx`
- Criação de conta opcional: usuário entra como **convidado** e só faz login depois — excelente para reduzir atrito
- Listas vazias têm empty-state com botão de ação (`IconFolderOff` + "Criar primeira lista")
- Swipe para editar/excluir listas, FAB para adicionar, busca por lista e por item
- Toasts de feedback, skeleton loaders, boot splash animado

### Problemas / fricção
1. **Navegação inconsistente entre telas.** O `_layout.tsx` autenticado usa abas `Dashboard / Listas / Perfil`, mas o `index` redireciona para `/(authenticated)` e a estrutura de rotas referencia `(authenticated)/lists` e `/list` como telas distintas. Há confusão entre "Dashboard" (index) e "Listas" (lists) — ambas podem parecer a mesma coisa para o usuário.
2. **Botão "Dashboard" sem propósito claro.** O label é "Dashboard" mas a tela raiz é apenas redirect/Listas. Falta definir o que o Dashboard mostra (insights, gráficos com `victory-native` que está no package mas aparentemente não usado na tela principal).
3. **Assistente de voz escondido.** O FAB roxo (`IconRobotFace`) fica acima do FAB de adicionar e só aparece dentro de uma lista. Sem onboarding sobre o que ele faz, o usuário pode não descobrir o diferencial do app.
4. **Descoberta de "Comparar preços" é fraca.** `item-variations` e `item-comparison` são telas ocultas (aba escondida) e não têm CTAs óbvios a partir da listagem de itens.
5. **Acessibilidade sub-utilizada.** As `RULES.md` exigem labels de acessibilidade, mas `card-list.tsx` e o FAB não definem `accessibilityLabel`/`accessibilityRole` consistentes; ícones sem texto (FABs) precisam de hint.
6. **Microcópia.** "Procurando por algo?" (busca de listas) e "Buscar itens..." são OK, mas faltam confirmações e estados de erro visíveis (ex.: falha de sync mostra só `console.error`).

---

## 3. PRODUTO

### Pontos fortes
- Proposta de valor clara e resolvida no onboarding: "saiba na hora quanto vai gastar".
- Local-first (WatermelonDB) garante funcionamento offline — diferencial para uso em supermercado (sinal ruim).
- Voice assistant + comparação de preços = par de features com apelo real e pouco comum.
- Sistema de temas e personalização por lista agrega senso de posse.

### Lacunas
1. **Posicionamento confuso entre "lista de compras" e "financeiro".** O app calcula gastos e tem gráficos (`victory-native`) mas não fecha o loop de "economia" prometida no onboarding (slide 3: "Mais economia"). Não há tela de histórico/relatórios visível.
2. **Features órfãs.** `victory-native`, `item-comparison`, `dashboard` existem no código mas não estão integrados no fluxo principal descoberível.
3. **Sem compartilhamento real.** O onboarding promete "compartilhe com a família / sincronize em tempo real", mas o fluxo de colaboração não está evidente na UI (apenas sync do próprio usuário via Supabase).
4. **README / marketing inexistentes.** Não há `README.md` nem copy de App Store/Play Store. Impossível comunicar valor fora do app.
5. **i18n não implementado** (`languagepacks.json` vazio) apesar de regra mandar PT-BR — hoje só PT-BR hardcoded, sem expansão.

---

## 4. MARCA

### Pontos fortes
- Paleta de "verde musgo / bege" coesa e agradável (`src/lib/themes.ts`), com dark mode e tema roxo.
- Tipografia definida (Poppins + Lora).
- Assets de splash, bootsplash e ícones adaptativos gerados.

### Problemas críticos
1. **🔴 Inconsistência de nome na marca.** O arquivo `src/lib/themes.ts` contém o comentário `Design System: Ecobi Grocery Green Theme`. O app se chama **PowerLists** em todo lugar (`app.json`, `package.json`, telas, bundle id `com.karllasouzza.powerlists`), mas o design system interno ainda referencia "Ecobi" — sinal de rebrand incompleto ou fork. Isso confunde qualquer pessoa que entre no código.
2. **Identidade visual sem logo definida.** Há `icon.png`, `adaptive-icon.png`, `new-icon-concept.png` e `bootsplash/logo.png`. O login usa `adaptive-icon.png` (1024px) em vez de um logo de marca propriamente dito. O `new-icon-concept.png` sugere redesign em andamento, mas não está em uso.
3. **Cor primária vs. promessa.** O verde remete a "ecológico/organico" (Ecobi), mas o produto é sobre organização e economia em compras, não sustentabilidade. A marca visual não comunica o valor real.
4. **Voz da marca ausente.** Não há tom de marca, guidelines de copy ou manifesto. O nome "PowerLists" é genérico e confundível com outros "power list" apps.

---

## 5. Recomendações Priorizadas

| # | Prioridade | Ação | Dimensão |
|---|-----------|------|----------|
| 1 | 🔴 Crítica | Remover/resolver referência "Ecobi" e unificar nome da marca (PowerLists) em código, comentários e design system | Marca |
| 2 | 🔴 Alta | Definir logo oficial (usar `new-icon-concept.png` ou refinar) e aplicar em login, splash e stores | Marca |
| 3 | 🟠 Alta | Esclarecer navegação: definir o que é "Dashboard" vs "Listas"; ocultar abas que não são telas reais | Facilidade |
| 4 | 🟠 Alta | Tornar o Assistente de Voz e a Comparação de Preços descobertíveis (onboarding/tour, CTAs) | Facilidade/Produto |
| 5 | 🟡 Média | Fechar o loop de "economia": tela de relatórios/histórico usando `victory-native` já presente | Produto |
| 6 | 🟡 Média | Adicionar acessibilidade (labels/hints) em FABs, cards e ícones | Facilidade |
| 7 | 🟡 Média | Criar README + copy de loja (App Store/Play Store) com a proposta de valor | Produto/Marca |
| 8 | 🟢 Baixa | Reavaliar paleta: alinhar cor primária à promessa de economia/organização, não "verde ecológico" | Marca |
| 9 | 🟢 Baixa | Implementar i18n ou remover a regra de i18n pendente | Produto |

---

## 6. Veredito

O **produto é tecnicamente robusto e tem diferenciais reais** (voz + comparação de preços + offline). A **facilidade é boa no core**, mas prejudicada por navegação confusa e features escondidas. A **marca é o ponto mais frágil**: nome incompleto (Ecobi vs PowerLists), sem logo oficial consolidado e sem voz/copy. Resolver itens 1–4 traria o maior ganho de percepção com esforço moderado.

---

## 7. Roadmap de Qualidade (Código)

Além dos itens acima (facilidade/produto/marca), existe um roadmap separado focado em **qualidade de código, nomenclatura e organização**: veja `ROADMAP-QUALITY.md` e seus sub-roadmaps (`ROADMAP-HOOKS.md`, `ROADMAP-FEATURES.md`, `ROADMAP-TYPES.md`, `ROADMAP-TESTS.md`).
