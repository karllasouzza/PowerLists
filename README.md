# PowerLists

Listas de compras inteligentes que calculam o total na hora, comparam preços e funcionam offline.

## O que é

PowerLists é um app de listas de compras para quem quer saber exatamente quanto vai gastar antes de chegar ao caixa — sem papel, sem surpresas.

## Diferenciais

- **Total em tempo real** — preço × quantidade somados por lista, visíveis na hora.
- **Assistente de voz** — adicione itens à lista falando, com feedback sonoro.
- **Comparação de preços** — veja altas e quedas de preço por item e compare variações para economizar.
- **Funciona offline** — seus dados ficam no dispositivo (local-first) e sincronizam na nuvem quando você faz login.
- **Personalizável** — temas claro/escuro e cores de destaque por lista.

## Começando

```bash
yarn install
yarn start          # Expo dev server
yarn android        # emulador/dispositivo Android
yarn ios            # simulador/dispositivo iOS
```

## Stack

React Native + Expo (Expo Router), WatermelonDB (local-first), Supabase (sync), NativeWind (Tailwind), React 19.

Veja `__docs__/RULES.md` para convenções de arquitetura e código.
