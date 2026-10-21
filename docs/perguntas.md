# Perguntas do funil: o que cada uma pergunta e por quê

Atualizado em 20/10/2026

Este guia explica cada pergunta do formulário, o que acontece com cada resposta e por que a regra existe. A fonte das regras é o documento **"Formulário de Qualificação de Leads — Actum"** (Luis Fernando da Silva, 08/10/2026). Os códigos no texto (`situacao`, `endingId("A")`) são os mesmos de `src/lib/funnel/steps.ts` e `endings.ts`.

## Contexto: a Actum Precatórios

A [Actum Precatórios S.A.](https://actumprecatorios.com.br/) analisa créditos judiciais já reconhecidos pela Justiça e avalia se é possível **antecipar** o recebimento. A pessoa cede o crédito à Actum e recebe antes, com desconto, em vez de esperar o pagamento do governo.

Hoje a Actum compra um tipo específico de crédito:

- **Devedor federal**, principalmente o INSS.
- **Pago por RPV** (Requisição de Pequeno Valor), que tem teto de 60 salários mínimos: R$ 97.260 em 2026.
- **Com decisão definitiva** (trânsito em julgado) e **ainda não pago**.

O funil existe para deixar passar só esse perfil. Lead bom passa, lead ruim sai antes de chegar à equipe comercial, e sai com uma explicação clara do motivo.

### Termos usados no funil

| Termo | O que é |
| --- | --- |
| **Trânsito em julgado** | O processo terminou e não cabe mais recurso. Só a partir daí o valor é definitivo. |
| **RPV** | Requisição de Pequeno Valor. Ordem de pagamento para dívidas até 60 salários mínimos. A RPV federal costuma ser paga em cerca de 60 dias após a emissão. |
| **Precatório** | Ordem de pagamento para valores acima do teto da RPV. Entra numa fila mais longa. Hoje a Actum não compra. |
| **Cessão de crédito** | O titular transfere o crédito à Actum e recebe à vista, com desconto. |
| **Habilitação de herdeiros** | Decisão no processo que reconhece quem são os herdeiros e a parte de cada um. Sem ela, a sucessão não está definida nos autos. |
| **Pré-análise** | Primeira etapa da Actum: a equipe consulta o processo e confirma o que o lead respondeu. |

## Estratégia do funil

1. **Elegibilidade primeiro.** As Etapas 1 a 4 cortam quem não pode antecipar, antes de pedir qualquer dado pessoal.
2. **"Não sei" segue.** Em situação, devedor e valor, quem não sabe passa. Muita gente não conhece os detalhes do próprio processo. A Pré-análise confirma depois.
3. **Toda saída explica o motivo.** Cada encerramento tem sua mensagem (A a F). Ninguém sai sem entender por quê.
4. **Contato só no fim.** Nome, WhatsApp e estado vêm na Etapa 6, quando o lead já investiu nas respostas e tende a concluir.

```
situacao ─┬─ recorreu / andamento ──► Mensagem A (+ nutrição)
          ├─ já recebeu ────────────► Mensagem F
          └─ demais ──► devedor ─┬─ Estado / Prefeitura / empresa ──► Mensagem B
                                 └─ demais ──► relacao ─┬─ tutor/curador ──► Mensagem C
                                                        ├─ herdeiro / cônjuge ──► habilitacao ─┐
                                                        └─ demais ─────────────────────────────┤
                                                                                               ▼
                                   valor ─┬─ abaixo do mínimo ──► Mensagem D ──(corrigir)──► valor
                                          ├─ acima do teto ─────► Mensagem E ──(corrigir)──► valor
                                          └─ demais ──► objetivo ──► nome ──► telefone ──► estado
                                                                     ──► processo (opcional) ──► aceites ──► WhatsApp
```

## Etapa 1: Filtro de elegibilidade básica

### `situacao`: Qual é a situação atual do seu processo?

Texto de ajuda: "Decisão definitiva é quando o processo terminou e não cabe mais recurso/revisão da decisão (trânsito em julgado)."

| Opção | Resultado |
| --- | --- |
| Ganhei, não cabe mais recurso e a ordem de pagamento (RPV) já foi emitida | Segue |
| Ganhei, não cabe mais recurso, mas a ordem de pagamento ainda não foi emitida | Segue |
| Ganhei, mas a outra parte recorreu ou ainda pode recorrer | **Mensagem A** + nutrição |
| O processo ainda está em andamento, sem decisão | **Mensagem A** + nutrição |
| O valor já foi depositado ou eu já recebi | **Mensagem F** |
| Não tenho certeza | Segue |

**Por quê:**

- A Actum só compra crédito com decisão definitiva. Com recurso possível ou processo em andamento, o valor ainda pode mudar ou não existir.
- Quem está nessa situação pode virar cliente depois. Por isso a Mensagem A oferece entrar numa **lista de nutrição**, separada da fila comercial.
- "Já recebi" encerra porque não há o que antecipar. Como a RPV federal é paga em cerca de 60 dias, esse caso é frequente.
- "Não tenho certeza" segue. A Pré-análise confirma a fase na consulta ao processo.

**Mensagem A:** "Ainda não conseguimos antecipar o seu crédito. A Actum compra créditos de processos que já terminaram, sem possibilidade de recurso. Se quiser, deixe seu WhatsApp e avisamos você quando fizer sentido refazer a simulação."

A tela mostra o checkbox "Aceito receber contato da Actum pelo WhatsApp". Marcado, aparece o botão que abre o WhatsApp da nutrição com uma mensagem `[NUTRIÇÃO]` pronta. O documento previa um campo de WhatsApp. Como o site não tem backend, o contato chega pelo próprio WhatsApp, que já identifica o número de quem enviou.

**Mensagem F:** "Se o valor já foi depositado, ele já está disponível para você sacar, e não há o que antecipar. Em caso de dúvida sobre o saque, fale com o advogado do seu processo."

## Etapa 2: Perfil do devedor

### `devedor`: Quem deve pagar o seu crédito?

Texto de ajuda: "Ações contra o INSS são federais, mesmo quando o processo corre na Justiça Estadual (como as de auxílio-acidente)."

| Opção | Resultado |
| --- | --- |
| INSS | Segue |
| União ou outro órgão federal (universidades federais, Receita, Forças Armadas etc.) | Segue |
| Governo do Estado (Polícia Militar, secretarias, IPE etc.) | **Mensagem B** |
| Prefeitura | **Mensagem B** |
| Banco ou empresa (Caixa, Banco do Brasil, Petrobras etc.) | **Mensagem B** |
| Não sei informar | Segue |

**Por quê:**

- A Actum compra só créditos pagos pelo Governo Federal via RPV.
- O **INSS é uma opção separada** porque é o caso mais comum e o que mais confunde. Ações de auxílio-acidente correm na Justiça Estadual, mas o devedor é federal. O texto de ajuda evita que esse lead marque "Estado" por engano.
- **Banco ou empresa** encerra porque esses devedores não pagam por RPV. Isso inclui ações de FGTS contra a Caixa.
- "Não sei informar" segue. A Pré-análise confirma o devedor no processo.

**Mensagem B:** "Obrigado pelo seu interesse. Hoje a Actum compra apenas créditos pagos pelo Governo Federal, como os de ações contra o INSS. Créditos contra Estados, Prefeituras, bancos ou empresas não fazem parte do que atendemos no momento."

## Etapa 3: Legitimidade e relação com o crédito

### `relacao`: Qual é a sua relação com este crédito?

| Opção | Resultado |
| --- | --- |
| Sou o titular do processo | Segue |
| Estou ajudando o titular, que está vivo (sou familiar ou procurador) | Segue, com a etiqueta **titular precisa assinar** |
| Sou advogado e o crédito é do meu cliente | Segue |
| Sou advogado e o crédito é dos meus honorários | Segue |
| Sou herdeiro(a) do titular falecido | Sub-pergunta `habilitacao` |
| Sou cônjuge ou companheiro(a) do titular falecido | Sub-pergunta `habilitacao` |
| Sou responsável legal (tutor ou curador) por menor de idade ou pessoa incapaz | **Mensagem C** |

**Por quê:** só quem tem direito sobre o crédito pode cedê-lo. A resposta diz ao comercial quem assina e quais documentos pedir.

- **Ajudando o titular:** caso comum com idosos. Segue, mas a mensagem leva a etiqueta "titular precisa assinar", porque quem conversa não é quem assina o contrato.
- **Duas opções de advogado:** crédito do cliente e honorários do advogado são créditos diferentes, com valores diferentes. Vão separados na mensagem.
- **Tutor ou curador:** encerra. Créditos de menores ou incapazes têm alta probabilidade de reconhecimento de hipossuficiência ou debilidade da parte, o que inviabiliza a cessão.

**Mensagem C:** "No momento, a Actum não antecipa créditos de menores de idade ou de pessoas incapazes. Agradecemos o seu contato."

### `habilitacao`: Os herdeiros já foram habilitados no processo, com a parte de cada um reconhecida?

Só para herdeiro e cônjuge. Opções: Sim, já foram habilitados · Ainda não · Não sei. **Todas seguem.**

**Por quê:** a Actum só compra quando a sucessão está definida nos autos. A resposta não encerra porque o lead nem sempre sabe responder com segurança. Ela vai na mensagem, e a Pré-análise confirma.

## Etapa 4: Faixa de valor

### `valor`: Qual é o valor total aproximado do crédito, já atualizado?

Texto de ajuda: "Use o valor total que aparece no processo ou que o seu advogado informou, antes de descontar os honorários. Se não souber, marque 'Não sei'."

| Opção (valores de 2026) | Resultado |
| --- | --- |
| Até R$ 4.999 | **Mensagem D** |
| De R$ 5.000 a R$ 19.999 | Segue |
| De R$ 20.000 a R$ 59.999 | Segue (núcleo) |
| De R$ 60.000 a R$ 97.260 | Segue |
| Acima de R$ 97.260 | **Mensagem E** |
| Não sei o valor | Segue |

**Por quê:**

- **Valor bruto:** o teto da RPV (60 salários mínimos) é calculado sobre o total, antes dos honorários. O mínimo da Actum também.
- **Mínimo de R$ 5.000:** abaixo disso a operação não compensa para a Actum.
- **Acima do teto:** o crédito vira precatório, que a Actum não compra hoje.
- **"Não sei" segue.** A Pré-análise apura o valor no processo.

**Correção do valor:** as Mensagens D e E têm o botão **"Corrigir o valor informado"**. Ele volta para esta pergunta com as outras respostas mantidas. Se o novo valor estiver na faixa, o funil segue. Se não, a mensagem aparece de novo. O valor informado antes vai na mensagem do WhatsApp ("Valor informado antes da correção"), para a Pré-análise ver a mudança. O lead só é enviado uma vez, no fim, então não há cadastro duplicado.

**Atualização anual obrigatória:** o teto muda com o salário mínimo. Todo mês de janeiro, troque `SALARIO_MINIMO` em `src/lib/config.ts`. As opções acima e o valor da Mensagem E são gerados a partir dele.

**Mensagem D:** "O valor que você informou está abaixo do mínimo que a Actum consegue antecipar hoje. Agradecemos o seu interesse."

**Mensagem E:** "Hoje a Actum antecipa apenas créditos federais pagos por Requisição de Pequeno Valor (RPV), que tem limite de 60 salários mínimos (R$ 97.260,00). O seu crédito está acima desse limite ou foi emitido como precatório, por isso ainda não conseguimos avançar com a antecipação."

## Etapa 5: Momento e intenção de venda

### `objetivo`: Qual é o seu principal objetivo hoje ao buscar essa simulação?

Opções: preciso do dinheiro com urgência · quero comparar propostas · quero planejar para os próximos meses. **Todas seguem.**

**Por quê:** mede a intenção de fechar e ajuda o comercial a decidir quem atender primeiro e como abordar. Urgência é lead quente. Comparar pede transparência nas condições. Planejar pede acompanhamento, não pressão.

## Etapa 6: Captura de contato e validação de segurança

Texto de apoio (tela final e abertura): "Sua simulação é gratuita, sem compromisso e seus dados são protegidos pela LGPD." A menção a "sigilo bancário" saiu, porque só se aplica a instituições financeiras.

| Step | Campo | Regra |
| --- | --- | --- |
| `nome` | Nome completo | Só letras, espaço, apóstrofo e hífen. Mínimo de 2 letras. |
| `telefone` | WhatsApp | Máscara `(00) 00000-0000`. Aceita 10 ou 11 dígitos. |
| `estado` | Estado | Lista com os 26 estados e o DF, num seletor. Obrigatório. |
| `processo` | Número do processo ou CPF do titular | Opcional. Aviso: "Informar o número do processo agiliza a análise da sua proposta." |
| `aceites` | "Aceito receber contato da Actum pelo WhatsApp" e "Quero me conectar com um especialista" | Os dois são obrigatórios. |

**Por quê:**

- **Estado:** diz em qual tribunal o processo provavelmente corre e permite medir campanhas por região. A lista completa num seletor substitui a lista curta com "Outro estado".
- **Processo opcional:** com o número, a Pré-análise consulta o tribunal sem depender da memória do lead. Obrigar faria muita gente desistir na última tela. A promessa de "24 horas" saiu, para não criar um prazo que a equipe pode não cumprir.
- **Aceites:** registram o consentimento para o contato pelo WhatsApp e a intenção de falar com um especialista. O aceite de Política de Privacidade previsto no documento foi substituído por "Quero me conectar com um especialista".

## O que chega no WhatsApp

Toda conversão leva para a Pré-análise:

- Situação do processo (Etapa 1)
- Devedor (Etapa 2)
- Relação com o crédito (Etapa 3) e a habilitação dos herdeiros, quando houver
- Faixa de valor (Etapa 4)
- Objetivo (Etapa 5)
- Nome, WhatsApp, estado, número do processo ou CPF (se informado) e os aceites
- **Observações:** "titular precisa assinar" e o valor anterior à correção, quando houver
- **Origem:** UTMs e página de entrada da campanha

## Fora do escopo por enquanto

- **Prioridade (Alta, Média, Baixa).** O documento sugere critérios de prioridade a partir das respostas. Está em espera e não foi implementado.
- **Número da nutrição.** Até a Actum definir um número próprio, `NURTURE_WHATSAPP_NUMBER` aponta para o comercial. As mensagens chegam marcadas com `[NUTRIÇÃO]`.
