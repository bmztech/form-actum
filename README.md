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
- App Next.js servido por `next start` (Node) na Hostinger. As páginas são
  pré-renderizadas como estáticas no build; não há rotas de servidor.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # roda a suíte do Vitest uma vez
npm run test:watch
npm run lint
npm run build     # build de produção em .next/ (webpack)
npm run start     # serve o build
```

O deploy é feito pela Hostinger a partir do GitHub (`main`): ela roda
`npm run build` e `npm run start`. O build usa `--webpack` porque o Turbopack
precisa abrir uma porta local para o PostCSS, o que o ambiente da Hostinger
não permite.

## Regras de negócio

### 1. Objetivo do formulário

Qualificar rapidamente se o lead **pode** ter o precatório antecipado (ou
seja, vendido/adiantado pela Actum) e, se puder, capturar nome + WhatsApp
para a equipe comercial dar continuidade **manualmente pelo WhatsApp**. Não
há armazenamento de leads em banco de dados — a entrega do lead é o próprio
lead enviando a mensagem do WhatsApp.

### 2. O funil (perguntas e ordem)

Definido de forma **declarativa** em [src/lib/funnel/steps.ts](src/lib/funnel/steps.ts)
(array `STEPS`), seguindo o documento "Formulário de Qualificação de Leads —
Actum" (08/10/2026). O perfil aceito é: crédito **federal** (INSS ou União),
pago por **RPV**, com **decisão definitiva** e **ainda não pago**.

| Etapa | Step | Encerra quando |
| --- | --- | --- |
| 1 | `situacao` | Recurso ou processo em andamento (Mensagem A + nutrição); valor já recebido (F) |
| 2 | `devedor` | Estado, Prefeitura, banco ou empresa (B) |
| 3 | `relacao` (+ `habilitacao` para herdeiro/cônjuge) | Tutor ou curador de menor/incapaz (C) |
| 4 | `valor` | Abaixo de R$ 5.000 (D) ou acima do teto da RPV (E) — ambas deixam corrigir o valor |
| 5 | `objetivo` | — |
| 6 | `nome`, `telefone`, `estado`, `processo` (opcional), `aceites` | — |

"Não sei" sempre segue: a Pré-análise confirma no processo. O porquê de cada
pergunta e o texto de cada mensagem estão em
[docs/perguntas.md](docs/perguntas.md).

### 3. Telas de encerramento

As Mensagens A a F ficam em [src/lib/funnel/endings.ts](src/lib/funnel/endings.ts).
Um step encerra o funil devolvendo `endingId("X")` no `next`. Quem cai numa
delas não vai para a fila comercial. Só D e E deixam voltar ao funil (botão
"Corrigir o valor informado"); o valor anterior vai na mensagem final. A
Mensagem A oferece opt-in para a lista de nutrição, enviada por WhatsApp para
`NURTURE_WHATSAPP_NUMBER` com a marca `[NUTRIÇÃO]`.

O teto da RPV é 60 × `SALARIO_MINIMO` ([src/lib/config.ts](src/lib/config.ts)).
**Atualize o salário mínimo todo mês de janeiro** — as opções de valor e a
Mensagem E são geradas a partir dele.

### 4. Entrega do lead via WhatsApp (sem backend)

Ao terminar o funil, [buildWhatsAppUrl](src/lib/whatsapp/message.ts) monta um link
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

[readTracking()](src/lib/tracking/utm.ts) captura, na URL de entrada, os
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
[markSubmitted()](src/lib/submission/status.ts) grava `actum_submitted=1`
no `localStorage`. Se a mesma pessoa (mesmo navegador) voltar a abrir o
link do formulário, a tela inicial mostra um agradecimento
(`AlreadySubmitted`) em vez do funil, para não fazer o lead responder tudo
de novo.

Isso é uma proteção **client-side e best-effort** (por navegador/
dispositivo, sem conta de usuário) — não substitui deduplicação de verdade
no CRM/atendimento, só evita fricção óbvia com quem reabre o mesmo link.

### 7. Atalhos de teclado

Em perguntas de múltipla escolha, o usuário pode responder apertando as
teclas `A`, `B`, `C`… (mapeadas para as opções na ordem em que aparecem), além de
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

Além do `PageView` automático, [trackPixelEvent](src/lib/tracking/pixel.ts)
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
                       pergunta, encerramento A–F, concluído, já enviado)
  lib/
    config.ts          – único lugar com números de WhatsApp (comercial e
                         nutrição), URL do site, pixel, salário mínimo/teto da
                         RPV/valor mínimo e parâmetros de tracking
    funnel/            – o questionário
      types.ts         – formato de um step e de uma tela de encerramento
      steps.ts         – perguntas (STEPS), sub-perguntas, etiquetas da mensagem
      endings.ts       – telas de encerramento (Mensagens A a F)
      navigation.ts    – motor puro: próximo step, rótulos, total do caminho
      validation.ts    – erro de validação de cada tipo de campo
    format/            – formatação de valores em reais
    input/             – máscara e validação de nome e telefone
    tracking/          – UTMs (utm.ts) e Meta Pixel (pixel.ts)
    whatsapp/          – montagem da mensagem e do link wa.me (message.ts)
    submission/        – flag local de "já enviou" (status.ts)
```

Ideia central: **`funnel/steps.ts` é a fonte de verdade do funil** (perguntas,
ordem, ramificações, texto que vai pro resumo) e **`Funnel.tsx` é só o
motor** que interpreta esse array — navega entre steps, controla
histórico/voltar, valida input e decide quando encerrar ou finalizar.
Isso significa que a grande maioria dos pedidos de negócio (mudar uma
pergunta, adicionar uma opção, mudar o critério de encerramento, mudar o
texto que vai para o WhatsApp) se resolve editando **só `funnel/steps.ts` e/ou
`config.ts`**, sem tocar em `Funnel.tsx`.

Não há chamadas de API, rotas de servidor (`route.ts`) nem página dinâmica
— o site é 100% estático (pré-renderizado no build), e as únicas
"integrações externas" são os links `wa.me` (comercial e nutrição).

## Testes

Cada módulo de `src/lib/` tem o seu `.test.ts` na mesma pasta: navegação do
funil (`funnel/navigation.test.ts`), máscaras e validações (`input/*.test.ts`),
captura de UTM (`tracking/utm.test.ts`) e montagem da mensagem/link de
WhatsApp (`whatsapp/message.test.ts`). Ao alterar um módulo ou `config.ts`
(ex.: novo parâmetro de tracking), atualize os testes correspondentes.

## Documentação

- [docs/arquitetura.md](docs/arquitetura.md) — camadas, fluxo, persistência e como alterar o formulário.
- [docs/meta-pixel.md](docs/meta-pixel.md) — como trocar ou incluir o ID do Meta Pixel e testar.
- [docs/perguntas.md](docs/perguntas.md) — contexto da Actum e o porquê de cada pergunta do funil.
