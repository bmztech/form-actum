# Meta Pixel: como incluir ou trocar o ID

Atualizado em 19/10/2026

O formulário da Actum tem uma rota só (`/`) e um pixel só. Para trocar o ID, você edita uma constante (ou uma variável de ambiente) e gera um novo build. Este guia mostra onde, como testar e o que fazer se for preciso mais de um pixel.

## Como está hoje

| Peça | Arquivo | O que faz |
| --- | --- | --- |
| ID do pixel | `src/lib/config.ts` (`META_PIXEL_ID`) | Guarda o ID. Lê `NEXT_PUBLIC_META_PIXEL_ID` e, se não houver, usa o valor fixo do código. |
| Código base | `src/app/layout.tsx` | Carrega o script do Meta com `next/script`, faz `fbq('init', ID)` e dispara `PageView`. Inclui o `noscript` com a imagem de 1 pixel. |
| Evento de conversão | `trackPixelEvent()` em `src/lib/tracking/pixel.ts` | Wrapper de `window.fbq('track', evento)`. Não faz nada se o `fbq` não existir. |
| Ponto de conversão | Tela `Done` em `src/components/Funnel.tsx` | O clique em "Falar com a Actum agora" chama `trackPixelEvent("Lead")` e `markSubmitted()`. |

O ID é lido em um lugar só. O `layout.tsx` usa a mesma constante no script e no `noscript`, então não existe ID escrito direto no HTML.

### Atenção: o ID atual precisa ser confirmado

Hoje o código e o `.env.example` apontam para IDs diferentes:

| Onde | ID |
| --- | --- |
| Valor padrão em `src/lib/config.ts` (o que vai para produção sem `.env.local`) | `1605537040923542` |
| `.env.example` | `1747237356474748` |

O commit `e9aabd2` ("Update Meta Pixel ID to the Actum form pixel") trocou o padrão de `1747…` para `1605…`. Só que `1605537040923542` é o mesmo ID que o `form-main/docs/meta-pixel.md` registra para o site previdenciario.bmzadvogados.adv.br (repo `form-prev-mql-kommo`). Se os dois sites usarem o mesmo pixel, os eventos da Actum e da BMZ Previdenciário se misturam no mesmo conjunto de dados.

Antes de qualquer campanha, confirme no Gerenciador de Eventos qual é o pixel da Actum. Depois deixe `config.ts` e `.env.example` com o mesmo valor. Se alguém copiar o `.env.example` para `.env.local` como ele está hoje, o build passa a usar `1747…` sem nenhum aviso.

## Onde pegar o ID

1. Abra o Gerenciador de Eventos do Meta, em [business.facebook.com/events_manager](https://business.facebook.com/events_manager).
2. Escolha a conta de anúncios da **Actum Precatórios** e a fonte de dados do tipo Pixel.
3. Copie o **ID do conjunto de dados**, que tem 15 ou 16 dígitos. Ele também aparece dentro de `fbq('init', '...')` no código base que o painel oferece em "Configurar → Copiar código de base".

O ID do pixel é público e aparece no código de qualquer página. Não é segredo e pode ficar no repositório.

## Trocar o ID do pixel

Você tem dois caminhos. O recomendado é o primeiro, porque deixa o ID versionado.

### Opção A: no código (recomendado)

1. Edite `src/lib/config.ts` e troque o valor padrão:
    ```ts
    export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "NOVO_ID_AQUI";
    ```
2. Atualize o `.env.example` para o mesmo ID, para os dois não divergirem de novo.
3. Não mexa em mais nada. O `layout.tsx` lê a constante no script e no `noscript`.
4. Rode `npm run lint`, `npm run test` e `npm run build`.
5. Faça commit numa branch `feat/...` ou `fix/...`, abra o PR e publique o conteúdo novo de `out/`.
6. Siga a seção "Como testar".

### Opção B: por variável de ambiente

1. Crie `.env.local` (ou configure a variável no provedor de build):
    ```
    NEXT_PUBLIC_META_PIXEL_ID=NOVO_ID_AQUI
    ```
2. Gere o build de novo.

O site é exportação estática (`output: "export"`). Variáveis `NEXT_PUBLIC_*` são **gravadas no JavaScript na hora do build**, não lidas em tempo de execução. Trocar a variável no servidor sem refazer o build não muda nada. Use esta opção para apontar um build de teste para um pixel de teste. Para produção, prefira a opção A.

## Incluir um segundo pixel

Use quando duas contas de anúncios precisam receber **os mesmos eventos**, por exemplo a conta da Actum e uma conta da agência. Hoje isso **não está implementado**. É preciso alterar dois pontos.

1. Em `src/lib/config.ts`, troque a constante por uma lista:
    ```ts
    export const META_PIXEL_IDS = ["ID_ACTUM", "NOVO_ID_AQUI"];
    ```
2. Em `src/app/layout.tsx`, gere um `fbq('init', ...)` para cada ID. O `PageView` é disparado uma vez e vai para todos os pixels iniciados:
    ```js
    fbq('init', 'ID_ACTUM');
    fbq('init', 'NOVO_ID_AQUI');
    fbq('track', 'PageView');
    ```
    Repita a imagem do `noscript` para cada ID.

O `trackPixelEvent("Lead")` funciona sem mudança. Com vários pixels iniciados, `fbq('track', 'Lead')` envia para todos. Para mandar um evento a um pixel específico, use `fbq('trackSingle', 'ID', 'Lead')`.

## Outras plataformas (TikTok, Google)

Não implementado. O `fbq` só fala com o Meta. Se a Actum anunciar no TikTok, siga o modelo do `form-main`: um pixel próprio (`ttq`) rodando **em paralelo** ao Meta, com componente e arquivo de ID separados, e o evento de conversão disparado no mesmo clique da tela `Done`. Cada plataforma só atribui conversões a quem clicou no anúncio dela, então os dois juntos não misturam a otimização. O passo a passo está em `form-main/docs/meta-pixel.md`, seção "TikTok Pixel".

## Como testar

1. Instale a extensão **Meta Pixel Helper** no Chrome.
2. Abra o formulário com um parâmetro que fure o cache, por exemplo `https://SEU_DOMINIO/?x=1`. A extensão deve mostrar o pixel com o ID novo e o evento `PageView` em verde.
3. No Gerenciador de Eventos, abra a aba **Testar eventos** e informe a URL do site. Os eventos aparecem em poucos segundos.
4. Responda o funil até a tela final e clique em "Falar com a Actum agora". O evento `Lead` deve aparecer.
5. Confira que o `Lead` **não** aparece para quem cai numa tela de encerramento (Mensagens A a F, inclusive quem clica no WhatsApp da nutrição), para quem abandona o funil nem para quem cai na tela "Agradecemos o seu contato" ao reabrir o link. Isso é o esperado.

Para repetir o teste no mesmo navegador, apague `actum_submitted` do `localStorage` (DevTools → Application) ou use uma aba anônima nova. Sem isso, o funil não abre de novo.

O clique navega para o WhatsApp na mesma aba. Se o `Lead` aparecer abaixo do esperado, é possível que o navegador cancele o envio ao sair da página. A alternativa é disparar o evento quando a tela final aparece, dentro de `finish()` em `Funnel.tsx`. Isso passa a contar também quem vê a tela e não clica.

## Cuidados

- **Ambiente de desenvolvimento dispara de verdade.** Não há proteção por ambiente. Abrir `npm run dev` envia `PageView` para o pixel configurado. Para testar sem sujar os dados, use a aba Testar eventos, ou aponte o `.env.local` para um pixel de teste.
- **O `Lead` é o clique, não a mensagem.** O pixel mede quem clicou para abrir o WhatsApp. A conversa só existe se o lead apertar "enviar" no app. Compare o volume de `Lead` com o de conversas recebidas no WhatsApp da Actum.
- **Cache de CDN.** Depois do deploy, a URL limpa pode continuar servindo o build antigo. Confira sempre com `?x=1`.
- **Bloqueadores de anúncio.** Eles deixam o `fbq` indefinido. O `trackPixelEvent` checa `typeof window.fbq === "function"` de propósito, para o formulário funcionar mesmo assim. Não remova essa checagem.

## Eventos

| Evento | Quando dispara | Onde |
| --- | --- | --- |
| `PageView` | Toda carga de página | `layout.tsx` |
| `Lead` | Clique em "Falar com a Actum agora" na tela final | `Funnel.tsx`, componente `Done` |
