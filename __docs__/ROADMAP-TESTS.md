# Sub-Roadmap: Cobertura de Testes (Fase 7)

**Objetivo:** Expandir testes para features core que não têm cobertura

---

## Situação Atual

### Arquivos de teste existentes (9)

| Arquivo | Tipo | O que testa |
|---------|------|-------------|
| `src/hooks/__tests__/use-auth.test.tsx` | Unit | Hook de autenticação |
| `src/hooks/__tests__/use-user.test.tsx` | Unit | Hook de usuário |
| `src/utils/__tests__/formatters.property.test.ts` | Property | Formatação de moeda |
| `src/utils/__tests__/currency.property.test.ts` | Property | Cálculos de moeda |
| `src/features/lists/utils/__tests__/price-calcs.property.test.ts` | Property | Cálculos de preço |
| `src/features/lists/hooks/__tests__/use-list-page-logics.property.test.ts` | Property | Lógica da página de listas |
| `src/features/dashboard/utils/__tests__/dashboard-metrics.property.test.ts` | Property | Métricas do dashboard |
| `src/features/voice-assistant/utils/__tests__/parse-transcript.property.test.ts` | Property | Parsing de transcrição |
| `src/features/voice-assistant/__tests__/speech-recognition-service.property.test.ts` | Property | Serviço de reconhecimento |

### Features sem testes

| Feature | Complexidade | Prioridade |
|---------|-------------|------------|
| `list-detail` | Alta (core do produto) | 🔴 Alta |
| `login` | Média (validação + fluxo) | 🟠 Média |
| `create-account` | Média (validação + fluxo) | 🟠 Média |
| `account` | Média (perfil + preferências) | 🟡 Média |
| `onboarding` | Baixa (UI simples) | 🟢 Baixa |
| `password-recovery` | Média (fluxo multi-etapa) | 🟡 Média |

---

## Testes a Criar

### 1. `list-detail` — Prioridade 🔴 Alta

#### `src/features/list-detail/hooks/__tests__/use-list-items-page.property.test.ts`

**O que testar:**
- `items` retorna itens da lista correta (filtrados por `listId`)
- `filteredItems` filtra por busca corretamente
- `sortedItems` ordena por sortMode (default, price-asc, price-desc, name)
- `total` soma preços corretamente
- `payableTotal` soma apenas itens marcados (`isChecked: true`)
- `handleToggleCheck` alterna status corretamente

**Dados de teste:**
```typescript
// Itens mock
const mockItems = [
  { id: '1', listId: 'list-1', title: 'Arroz', price: 25.90, amount: 2, isChecked: false },
  { id: '2', listId: 'list-1', title: 'Feijão', price: 8.50, amount: 1, isChecked: true },
  { id: '3', listId: 'list-2', title: 'Leite', price: 5.90, amount: 3, isChecked: false },
];
```

**Propriedades:**
- Total = 25.90 * 2 + 8.50 * 1 = 60.30
- PayableTotal = 8.50 * 1 = 8.50 (apenas itens marcados)
- Filtrar por "ar" retorna apenas "Arroz"

---

### 2. `login` — Prioridade 🟠 Média

#### `src/features/login/__tests__/login-schema.test.ts`

**O que testar:**
- Schema aceita email válido
- Schema rejeita email inválido
- Schema aceita senha com 6+ caracteres
- Schema rejeita senha vazia

**Dados de teste:**
```typescript
const validLogin = { email: 'test@example.com', password: '123456' };
const invalidEmail = { email: 'invalid', password: '123456' };
const shortPassword = { email: 'test@example.com', password: '123' };
```

---

### 3. `create-account` — Prioridade 🟠 Média

#### `src/features/create-account/__tests__/create-account-schema.test.ts`

**O que testar:**
- Schema aceita email + senha válidos
- Schema rejeita email inválido
- Schema rejeita senha com menos de 6 caracteres
- Schema exige confirmação de senha

---

### 4. `account` — Prioridade 🟡 Média

#### `src/features/account/__tests__/use-account-page.test.tsx`

**O que testar:**
- `profile` retorna perfil do usuário logado
- `isGuest` retorna true para usuários convidados
- `signOut` limpa estado e navega para login

---

## Configuração de Teste

### Verificar configuração existente

```bash
cat jest.config.cjs
cat jest.behavior.config.cjs
```

### Padrão de teste (property-based com fast-check)

O projeto já usa `fast-check` para property-based testing. Manter esse padrão:

```typescript
import * as fc from 'fast-check';
import { calculateTotal } from '../formatters';

describe('calculateTotal', () => {
  it('should return positive total for positive prices', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          price: fc.float({ min: 0, max: 1000 }),
          amount: fc.integer({ min: 1, max: 100 }),
          isChecked: fc.boolean(),
        })),
        (items) => {
          const total = calculateTotal(items);
          expect(total).toBeGreaterThanOrEqual(0);
        }
      )
    );
  });
});
```

### Comando para executar testes

```bash
# Todos os testes
npx jest --config jest.config.cjs

# Teste específico
npx jest --config jest.config.cjs src/features/list-detail/hooks/__tests__/

# Com coverage
npx jest --config jest.config.cjs --coverage
```

---

## Ordem de Execução

1. Criar testes para `list-detail` (core do produto)
2. Criar testes para `login` (validação de schema)
3. Criar testes para `create-account` (validação de schema)
4. Criar testes para `account` (perfil + preferências)

**Total estimado:** 2-3 dias

---

## Métricas de Sucesso

| Métrica | Antes | Depois |
|---------|-------|--------|
| Arquivos de teste | 9 | 13+ |
| Features com testes | 5 | 9 |
| Cobertura de hooks core | 40% | 70%+ |
