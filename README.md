# form-actum

Landing page com formulário de qualificação de leads (funil) para a **Actum
Precatórios**. O visitante responde a um questionário passo a passo e, no
final, é direcionado ao WhatsApp da empresa com uma mensagem pré-preenchida
contendo todas as respostas e os dados de rastreamento (UTM) da campanha.

Não existe backend: tudo roda no navegador e a "conversão" acontece quando o
lead abre o link `wa.me` com a mensagem pronta.

## Stack

- **Next.js 16** (App Router) + **React 19**, TypeScript.
- **Tailwind CSS 4** para estilo.
- **Vitest** + `jsdom` para testes unitários.
- Build de **exportação estática** (`next.config.ts` usa `output: "export"`)
  — o site final é HTML/CSS/JS estático, sem servidor Node em produção.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # roda a suíte do Vitest uma vez
npm run test:watch
npm run lint
npm run build     # gera o site estático em out/
```

`npm run build` faz o build de produção e, por causa do `output: "export"`,
já deixa o resultado pronto em `out/` — essa pasta pode ser hospedada em
qualquer serviço de arquivos estáticos (Vercel, Netlify, S3, etc.), sem
precisar rodar `next start`.

## Regras de negócio

### 1. Objetivo do formulário

Qualificar rapidamente se o lead **pode** ter o precatório antecipado (ou
seja, vendido/adiantado pela Actum) e, se puder, capturar nome + WhatsApp
para a equipe comercial dar continuidade **manualmente pelo WhatsApp**. Não
há armazenamento de leads em banco de dados — a entrega do lead é o próprio
lead enviando a mensagem do WhatsApp.

### 2. O funil (perguntas e ordem)

Definido de forma **declarativa** em [src/lib/form.ts](src/lib/form.ts), no
array `STEPS`. Ordem e ramificações:

```
situacao ──"andamento"──► disqualified (fim, sem captura)
   │
   └─(demais respostas)──► devedor ──► relacao
                                          │
                                          ├─"herdeiro"──► inventario ──► valor
                                          └─(demais)────────────────────► valor
                                                                            │
                                                                            ▼
                                                                        objetivo
                                                                            │
                                                                            ▼
                                                                         estado
                                                                            │
                                            ┌───"outro"───► estado_outro ───┤
                                            └───(estado da lista)───────────┤
                                                                            ▼
                                                                          nome
                                                                            │
                                                                            ▼
                                                                        telefone
                                                                            │
                                                                            ▼
                                                              processo (opcional)
                                                                            │
                                                                            ▼
                                                                         submit
```

1. **situacao** — situação do processo judicial. Se a resposta for
   `"andamento"` (processo ainda em andamento, sem precatório expedido), o
   lead é **desqualificado** — a Actum só antecipa créditos já reconhecidos
   pela Justiça (precatório expedido ou aguardando expedição).
2. **devedor** — quem deve o crédito (federal, estadual, municipal). Usado
   só para contexto/qualificação, não desqualifica ninguém.
3. **relacao** — vínculo do lead com o crédito (titular, herdeiro, advogado).
   Se `"herdeiro"`, abre a sub-pergunta **inventario** (existe partilha
   homologada?) antes de seguir — é um dado importante para a análise
   jurídica de créditos herdados. Para as demais respostas, pula direto
   para `valor`.
4. **valor** — faixa de valor aproximado do precatório.
5. **objetivo** — intenção do lead (urgência, comparar propostas, planejar).
6. **estado** — em qual estado o lead está, com os dez estados de maior
   volume na lista (SP, RJ, MG, PR, RS, SC, BA, GO, PE, DF) e a opção
   **"Outro estado"**, que abre a sub-pergunta **estado_outro** (campo de
   texto livre para o lead escrever o estado). Como a lista é longa, esse
   step usa `layout: "grid"` — duas colunas no desktop e sem atalho de
   teclado (as letras A–F só fazem sentido em listas curtas). Não
   desqualifica ninguém.
7. **nome**, **telefone**, **processo** — captura de contato. `processo`
   (nº do processo ou CPF do titular) é **opcional**; o helper no formulário
   avisa que preencher acelera a análise, mas o funil não trava se ficar em
   branco.

Depois de `processo`, o `next` é o id reservado `"submit"`, que dispara a
montagem da mensagem e a tela final de WhatsApp (não existe um step com esse
id em `STEPS`).

**Como adicionar/editar perguntas:** mexa só no array `STEPS`. Cada step
tem:
- `next` como **string** → sempre vai para aquele id.
- `next` como **função** `(value) => id` → ramificação condicional a partir
  da resposta atual (é assim que `situacao` e `relacao` funcionam).
- `summaryLabel` → rótulo usado na mensagem de WhatsApp final.
- `hideInSummary` → some do resumo da mensagem mesmo tendo sido respondido.
- `optional` (só em steps de texto) → o botão de continuar vira "Pular esta
  etapa" quando o campo está vazio.
- `layout: "grid"` (só em steps de escolha) → opções em duas colunas, sem
  badge de letra nem atalho de teclado (para listas longas, como `estado`).

Os ids **`"disqualified"`** e **`"submit"`** são reservados pelo motor do
funil ([Funnel.tsx](src/components/Funnel.tsx)) e não devem ser reusados
como id de uma pergunta normal.

`pathTotal()` calcula quantas perguntas existem no caminho atual (para a
barra de progresso). As sub-perguntas condicionais ficam declaradas no mapa
`BRANCH_STEPS` em [src/lib/form.ts](src/lib/form.ts) — hoje `inventario`
(quando `relacao = "herdeiro"`) e `estado_outro` (quando
`estado = "outro"`): elas saem da contagem base e voltam +1 cada quando a
condição é verdadeira. Ao criar uma nova ramificação que mude a quantidade
de perguntas do caminho, basta adicionar uma entrada nesse mapa.

### 3. Desqualificação é definitiva

Uma vez que o lead cai na tela de desqualificação (`Disqualified`), **não
há como reabrir o funil a partir dali** — a única ação disponível é ir para
o site institucional (`SITE_URL`). Isso é intencional: só vale a pena falar
com quem já tem o crédito judicial definido (expedido ou aguardando
expedição), processos "em andamento" ainda não são elegíveis para
antecipação.

### 4. Entrega do lead via WhatsApp (sem backend)

Ao terminar o funil, [buildWhatsAppUrl](src/lib/whatsapp.ts) monta um link
`https://wa.me/<numero>?text=<mensagem>` com:

- Uma primeira linha de resumo (`buildHeadline`) — devedor + faixa de valor,
  para quem for atender já ter o contexto do caso.
- Todas as respostas do funil, na ordem de `STEPS`, usando `summaryLabel`
  (campos vazios ou `hideInSummary` são omitidos).
- Um bloco `— origem —` com os parâmetros de rastreamento capturados (só
  aparece se houver pelo menos um valor).

**A conversão só é confirmada quando o próprio lead aperta "enviar" no
WhatsApp** — o clique no botão da tela final (`Done`) só abre o link, quem
efetivamente manda a mensagem é o navegador/app de WhatsApp do usuário. Por
isso a UI reforça: _"Sem esse envio, a nossa equipe não recebe o seu caso."_

O número que recebe os leads é `WHATSAPP_NUMBER` em
[src/lib/config.ts](src/lib/config.ts) — é o único lugar que deve ser
editado para trocar o número.

### 5. Rastreamento de campanhas (UTM)

[readTracking()](src/lib/whatsapp.ts) captura, na URL de entrada, os
parâmetros listados em `TRACKING_PARAMS`
([src/lib/config.ts](src/lib/config.ts)): `utm_source`, `utm_medium`,
`utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid` — mais
`referrer` e `landing_page`, capturados automaticamente.

Esses valores são persistidos em `sessionStorage` (`actum_tracking`) assim
que a página carrega, para não se perderem se o lead navegar dentro do site
e a URL mudar no meio do funil. `referrer` e `landing_page` só são gravados
na primeira leitura (não são sobrescritos depois). Tudo isso vai para o
bloco `— origem —` da mensagem de WhatsApp.

Para rastrear uma nova origem/parâmetro, basta adicionar a chave em
`TRACKING_PARAMS`.

### 6. Não repetir o funil (dedupe local)

Depois que o lead clica em "Falar com a Actum agora" na tela final,
[markSubmitted()](src/lib/submission-status.ts) grava `actum_submitted=1`
no `localStorage`. Se a mesma pessoa (mesmo navegador) voltar a abrir o
link do formulário, a tela inicial mostra um agradecimento
(`AlreadySubmitted`) em vez do funil, para não fazer o lead responder tudo
de novo.

Isso é uma proteção **client-side e best-effort** (por navegador/
dispositivo, sem conta de usuário) — não substitui deduplicação de verdade
no CRM/atendimento, só evita fricção óbvia com quem reabre o mesmo link.

### 7. Atalhos de teclado

Em perguntas de múltipla escolha, o usuário pode responder apertando as
teclas `A`–`F` (mapeadas para as opções na ordem em que aparecem), além de
clicar. É um detalhe de UX para agilizar o preenchimento em desktop.

### 8. Pixel da Meta (Facebook Ads)

O site carrega o "código de base" padrão do Pixel da Meta direto no
`<body>`, via `next/script` ([src/app/layout.tsx](src/app/layout.tsx)) — o
mesmo trecho gerado pelo Gerenciador de Eventos em **Configure um Pixel da
Meta → Copiar código de base**. Ele dispara automaticamente o evento
`PageView` a cada carregamento de página (inclui fallback `<noscript>` com
pixel de imagem para quem tem JS desabilitado).

O ID do pixel fica isolado em `META_PIXEL_ID`
([src/lib/config.ts](src/lib/config.ts)) — é o único lugar que precisa ser
editado para trocar de pixel:

```ts
// src/lib/config.ts
export const META_PIXEL_ID = "1234567890123456"; // exemplo — troque pelo ID real do seu Pixel
```

> O valor acima é só um exemplo de formato (16 dígitos), não é um ID válido.
> Pegue o ID real em **Gerenciador de Eventos da Meta → Conectar fontes de
> dados → Web → seu Pixel → Copiar código de base** — ele aparece dentro da
> chamada `fbq('init', '...')` do trecho copiado.

Além do `PageView` automático, [trackPixelEvent](src/lib/pixel.ts)
(wrapper de `window.fbq("track", event)`) dispara o evento `Lead` no clique
do botão final "Falar com a Actum agora"
([Funnel.tsx](src/components/Funnel.tsx)) — esse é o evento de conversão a
ser otimizado nas campanhas do Meta Ads.

## Arquitetura

```
src/
  app/
    layout.tsx      – layout raiz, fonte (Poppins), metadata/SEO, viewport
    page.tsx         – única rota do site: renderiza <Funnel />
    globals.css      – tema Tailwind (cores "gold", "ink", "paper" etc.)
  components/
    Funnel.tsx       – motor do funil: estado, navegação, telas (intro,
                       pergunta, desqualificado, concluído, já enviado)
  lib/
    form.ts           – definição declarativa das perguntas (STEPS) e
                       helpers de navegação/resumo
    whatsapp.ts        – tracking de UTM, montagem da mensagem e do link
                       wa.me, máscara/validação de telefone
    submission-status.ts – flag local de "já enviou" (localStorage)
    config.ts          – único lugar com número de WhatsApp, URL do site
                       institucional e lista de parâmetros de tracking
```

Ideia central: **`form.ts` é a fonte de verdade do funil** (perguntas,
ordem, ramificações, texto que vai pro resumo) e **`Funnel.tsx` é só o
motor** que interpreta esse array — navega entre steps, controla
histórico/voltar, valida input e decide quando desqualificar ou finalizar.
Isso significa que a grande maioria dos pedidos de negócio (mudar uma
pergunta, adicionar uma opção, mudar o critério de desqualificação, mudar o
texto que vai para o WhatsApp) se resolve editando **só `form.ts` e/ou
`config.ts`**, sem tocar em `Funnel.tsx`.

Não há chamadas de API, rotas de servidor (`route.ts`) nem página dinâmica
— o site é 100% estático (compatível com `output: "export"`), e a única
"integração externa" é o link `wa.me`.

## Testes

[src/lib/whatsapp.test.ts](src/lib/whatsapp.test.ts) cobre a parte com mais
lógica e mais fácil de quebrar silenciosamente: captura de UTM, montagem da
mensagem/link de WhatsApp e máscara/validação de telefone. Ao alterar
`whatsapp.ts` ou `config.ts` (ex.: novo parâmetro de tracking), atualize os
testes correspondentes.
