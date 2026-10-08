# Quiz da Avó Yuki — análise de chegada, respostas e captura

Consulta realizada em 07/10/2026, às 12h16 (America/Cuiaba). Banco: Supabase do Avantis Studio; site `avo-yuki`, funil `avo-yuki`, versão registrada `v2-2026-09-17`.

O recorte começa no primeiro evento dessa versão, em 17/09/2026 às 07h02, e termina na consulta de 07/10. Eventos anteriores pertencem ao histórico do site e não foram usados como chegadas ao quiz atual. A primeira manhã de 17/09 está parcialmente coberta. A leitura foi paginada e conferida contra a contagem exata do banco, sem alterar registros.

## O que os registros mostram

- 111 sessões chegaram à página principal, correspondentes a 97 identificadores de visitante.
- 69 sessões iniciaram o quiz, correspondentes a 64 visitantes. Uma dessas sessões não tem o evento de chegada à página.
- 55 sessões registraram alguma resposta, correspondentes a 53 visitantes.
- 52 sessões registraram resposta à sexta pergunta, correspondentes a 50 visitantes.
- 38 sessões registraram conclusão e resultado, correspondentes a 37 visitantes.
- 32 sessões registraram captura de contato, correspondentes a 31 visitantes. A tabela de leads confirma 31 contatos distintos, deduplicados por telefone dentro do funil.
- 38 sessões registraram visualização da oferta; 13 registraram ida ao checkout. Foram 14 eventos de checkout, porque uma sessão clicou mais de uma vez.

Visitante é um identificador do navegador, não uma pessoa identificada: troca de aparelho, limpeza de cookies e navegadores internos podem duplicar uma pessoa. Sessão é uma visita; respostas e cliques repetidos foram deduplicados por sessão. Contatos distintos são outra unidade.

## Onde o funil perde sessões

**Chegada → início:** das 111 sessões com chegada registrada, 68 iniciaram. Outras 43 não têm início registrado: queda observada de **38,7%**.

**Início → primeira resposta:** acompanhando as mesmas 69 sessões com início, 54 responderam a primeira pergunta. Outras 15 não têm resposta: queda de **21,7%**.

**Primeira resposta → seis perguntas:** das 54 sessões anteriores, 51 registraram todas as seis respostas. A queda no miolo é de apenas **3 sessões, ou 5,6%**. Não há evidência de uma pergunta intermediária que esteja derrubando muita gente.

**Seis respostas → conclusão:** dessas 51 sessões, 38 têm conclusão registrada. São **13 sessões sem conclusão, ou 25,5%**. O histórico atravessa uma mudança na captura de contato; esse intervalo não deve ser interpretado automaticamente como abandono causado pelas perguntas ou pelo formulário.

**Oferta → checkout:** no grupo acompanhado desde o início, 37 sessões têm oferta e 13 têm checkout. São **24 sem checkout, ou 64,9%**. No funil aberto, há 38 sessões com oferta e 13 com checkout: 65,8% sem checkout. A diferença de uma sessão decorre de eventos intermediários ausentes.

Ausência de evento significa interrupção observada, não prova individual de abandono. Bloqueios, falhas de envio e mudanças na página também podem produzir esse padrão. Não há eventos de compra neste conjunto; ida ao checkout não comprova pagamento.

## Quantas perguntas responderam

Nas 69 sessões com início registrado:

| Respostas distintas | Sessões |
|---|---:|
| Nenhuma | 15 |
| 1 | 2 |
| 2 | 0 |
| 3 | 1 |
| 4 | 0 |
| 5 | 0 |
| 6 | 51 |

Média de **4,5 perguntas por sessão iniciada**. Entre quem respondeu ao menos uma pergunta, média de **5,8**. Os 319 eventos brutos de resposta não correspondem a 319 pessoas.

Contagem aberta por pergunta, independentemente de haver início registrado:

| Pergunta | Texto | Sessões | Visitantes |
|---|---|---:|---:|
| 1 | Quais incômodos estão atrapalhando você hoje? | 55 | 53 |
| 2 | Qual destas situações mais se parece com o seu dia? | 53 | 51 |
| 3 | Com que frequência esse incômodo aparece? | 53 | 51 |
| 4 | Há quanto tempo isso vem chamando sua atenção? | 52 | 50 |
| 5 | O que você costuma fazer quando isso acontece? | 52 | 50 |
| 6 | O que mais incomoda nessa situação? | 52 | 50 |

## Captura de contato: o ponto mais importante

O último `lead_captured` é de **29/09/2026, às 18h47**. Na tabela `quiz_attempts`, de 01/10 até a consulta, existem **7 tentativas concluídas e nenhuma vinculada a lead**. O pixel registra seis conclusões nesse mesmo intervalo, mostrando que as duas fontes também têm lacunas.

A página pública consultada em 07/10 permite responder às seis perguntas, ver o resultado e avançar à oferta sem pedir nome ou WhatsApp. Seu código envia `quiz_completed` e `result_viewed`; o payload de captura não contém `lead`, e não existe emissão de `lead_captured` na página atual.

Portanto, **o fluxo atual não transforma a conclusão em um contato recuperável pelo Studio**. A ausência de leads recentes coincide com isso; não é evidência de que essas sete pessoas recusaram fornecer o telefone. Não foi possível determinar a data exata em que a etapa deixou de existir. A versão enviada continua sendo `v2-2026-09-17`, apesar da diferença de comportamento observada.

## Minha prioridade de ação

1. **Restabelecer a captura, se o objetivo é gerar leads.** Testar uma etapa curta, após as perguntas, explicando o motivo do contato e com consentimento claro. Medir separadamente visualização do formulário, tentativa, erro, sucesso e eventual opção de continuar sem contato. Comparar leads por chegada e avanço ao checkout para avaliar o efeito.
2. **Melhorar a entrada e a primeira pergunta.** Tornar claros o benefício do resultado, o número de perguntas e o tempo real esperado. Na primeira tela de múltipla seleção, tornar evidente que é necessário selecionar e continuar. Validar a experiência no navegador interno do Instagram.
3. **Trabalhar a passagem da oferta ao checkout.** Conferir clareza da oferta, botão e destino do checkout; medir cliques e pagamentos aprovados separadamente. A queda observada aqui é alta, mas não permite atribuir a causa ao preço ou ao texto sem um teste.
4. **Corrigir a comparabilidade dos dados.** Alterar `quiz_version` quando o fluxo mudar, registrar a etapa exibida e os erros de captura. Hoje o código da página absorve silenciosamente falhas da API, e o backend atualiza `completed_at` novamente em resultado, oferta e checkout. Por isso, esse timestamp não serve como horário exato de conclusão para medir duração do quiz.

Eu começaria pela captura de contato e pela entrada; reduzir as perguntas intermediárias tem prioridade menor, pois a retenção entre a primeira e a sexta resposta é boa.

## Conferência e limitações

Foram lidos 2.498 eventos históricos do site, 73 tentativas, 31 leads e 323 respostas salvas. No recorte do quiz há 1.607 eventos do site. Duas sessões identificadas por nomes explícitos de teste foram excluídas da análise de eventos; nenhuma contém evento do quiz. Outros testes sem marcação podem estar incluídos.

As tabelas de tentativas registram 73 sessões e 39 concluídas, enquanto o pixel registra 69 inícios e 38 conclusões. São canais de gravação separados, não números intercambiáveis. Há duas sessões com eventos de quiz sem início registrado, uma sessão iniciada sem pageview e seis conclusões sem captura de contato no pixel. O relatório usa o pixel para o percurso e as tabelas de quiz para conferir contatos e a ausência recente de leads.

As contagens por etapa usam a presença de eventos na mesma sessão; a ordem de recebimento dos beacons não é tratada como ordem exata de interação. A contagem aberta inclui sessões com etapas anteriores ausentes; o funil acompanhado exige todas as etapas anteriores, exceto captura de contato, que não é obrigatória na página atual. A amostra é pequena e não sustenta conclusões estatísticas sobre testes de conversão.

Arquivos anexos: `funil.csv`, `perguntas.csv`, `respostas-por-sessao.csv`, `por-dia.csv` e `summary.json`. São agregados, sem nomes, telefones ou respostas individuais.
