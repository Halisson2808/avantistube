# Sites & Tráfego (módulo /analytics)

Rastreio próprio de cliques e conversões dos sites e páginas de oferta — no estilo UTMify,
só que dentro do painel e com os dados no seu Supabase.

## Estrutura de rotas do painel

| Rota | O que é |
| --- | --- |
| `/` | Início — escolhe o módulo |
| `/youtube` | Painel do YouTube (canais, vídeos, thumbnails) |
| `/youtube/buscar`, `/youtube/monitoramento`, `/youtube/meus-canais`, `/youtube/exportar`, `/youtube/perfis`, `/youtube/thumbnails` | telas do módulo YouTube |
| `/analytics` | Visão geral do tráfego |
| `/analytics/funil` | Funil de conversão (etapas configuráveis por site) |
| `/analytics/eventos` | Últimos eventos recebidos |
| `/analytics/sites` | Cadastro de sites + código de instalação |
| `/analytics/utm` | Gerador de links com UTM |
| `/pdf` | Gerador de PDF — ebooks e order bumps em A4 (tema claro próprio, layout fora do Studio) |

As rotas antigas (`/buscar`, `/monitoramento`, …) redirecionam sozinhas para `/youtube/...`.

## Banco (Supabase)

Migration: `supabase/migrations/20260909000000_analytics.sql`

- `tracking_sites` — sites/ofertas cadastrados, cada um com uma `site_key`.
- `tracking_events` — eventos brutos (pageview, click, lead, purchase, custom) com UTM,
  identificador de anúncio (fbclid/gclid/ttclid), sessão, visitante, valor e aparelho.
- `tracking_funnel_steps` — etapas do funil por site.

Leitura liberada para usuário logado; escrita só pelo backend (service_role).

## Instalação do pixel no site

1. Cadastre o site em `/analytics/sites` e copie a chave.
2. Cole antes do `</body>` do site:

```html
<script defer src="https://SEU-PAINEL/avantis-pixel.js" data-site="CHAVE-DO-SITE"></script>
```

Já são registrados sozinhos:

| Evento | Quando |
| --- | --- |
| `pageview` | a cada carregamento (e a cada troca de rota em SPA) |
| `rolagem_25/50/75/90` | quando a pessoa passa de cada marco da página |
| `tempo_30s/60s/180s` | tempo com a aba aberta na frente |
| `click` | links externos e qualquer elemento com `data-avantis` |
| `saida_intencao` | o mouse sai da janela (desktop) |
| `video_play`, `video_25/50/75`, `video_completo` | progresso de qualquer `<video>` da página |
| `form_enviado` | envio de formulário (entra como lead) |
| `saida_pagina` | fim da visita, com tempo, rolagem máxima e nº de cliques |

Os marcos são configuráveis no próprio `<script>`:

```html
<script defer src="https://SEU-PAINEL/avantis-pixel.js"
        data-site="CHAVE"
        data-scroll="10,25,50,75,90"
        data-time="15,30,60,300"
        data-video="25,50,75,100"
        data-exit-intent="1"
        data-debug="0"></script>
```

Deixar um atributo vazio desliga aquele grupo (ex.: `data-scroll=""`).

## Eventos manuais

```html
<button data-avantis="botao_comprar">Comprar</button>
```

```js
avantis.track("lead");
avantis.track("purchase", { value: 97, currency: "BRL" });
avantis.track("abriu_pop_saida", { meta: { origem: "mouseout" } });
avantis.trackVideo(meuPlayer, "vsl-principal");   // player de terceiros
```

O nome do evento é livre — a estratégia muda de site para site, e tudo que
chegar aparece no painel em "Eventos personalizados" e pode virar etapa do funil
sem precisar mexer no código.

A UTM e o ID do anúncio da primeira visita ficam guardados na sessão, então uma venda
feita minutos depois continua atribuída à campanha certa.

## Rotas da API

| Rota | Acesso | Uso |
| --- | --- | --- |
| `POST /api/track` (e `GET` como beacon) | público | ingestão de eventos do pixel |
| `GET /api/analytics/overview?site=&days=` | logado | totais, série diária, origens, campanhas, páginas, aparelhos, rolagem, vídeo e eventos personalizados |
| `GET /api/analytics/funnel?site=&days=` | logado | etapas do funil com conversão |
| `POST /api/analytics/funnel-steps` | logado | salva as etapas de um site |
| `GET /api/analytics/events?site=&limit=` | logado | eventos recentes |
| `GET/POST/PUT/DELETE /api/analytics/sites` | logado | cadastro de sites |

## Período

Todas as telas aceitam os atalhos (24h, 7, 30, 90 dias) ou um intervalo de datas
escolhido no calendário. Na API é `?days=N` ou `?from=AAAA-MM-DD&to=AAAA-MM-DD`
(as duas pontas entram na conta). A escolha fica salva no navegador e vale para
visão geral, funil e eventos.

## Sites instrumentados

| Chave | Onde | Eventos próprios da página |
| --- | --- | --- |
| `avo-yuki-caderno` | yukinakamura.vercel.app `/` e `/page2` | `cta_menu`, `cta_topo`, `cta_meio`, `cta_final`, `cta_barra_mobile`, `cta_pop_saida`, `cta_checkout`, `pop_saida_exibido`, `pop_saida_fechado`, `barra_mobile_exibida` |
| `avo-yuki-sono` | yukinakamura.vercel.app `/sono` | `cta_checkout`, `cta_final` |

Os CTAs levam `data-avantis-value` com o preço, então o clique já entra no painel
com o valor da oferta.
