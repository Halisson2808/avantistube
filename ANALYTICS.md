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

- `pageview` a cada carregamento (e a cada troca de rota em SPA);
- `click` em links externos e em qualquer elemento com `data-avantis`.

## Eventos manuais

```html
<button data-avantis="botao_comprar">Comprar</button>
```

```js
avantis.track("lead");
avantis.track("purchase", { value: 97, currency: "BRL" });
avantis.track("assistiu_vsl_50", { type: "custom" });
```

A UTM e o ID do anúncio da primeira visita ficam guardados na sessão, então uma venda
feita minutos depois continua atribuída à campanha certa.

## Rotas da API

| Rota | Acesso | Uso |
| --- | --- | --- |
| `POST /api/track` (e `GET` como beacon) | público | ingestão de eventos do pixel |
| `GET /api/analytics/overview?site=&days=` | logado | totais, série diária, origens, campanhas, páginas, aparelhos |
| `GET /api/analytics/funnel?site=&days=` | logado | etapas do funil com conversão |
| `POST /api/analytics/funnel-steps` | logado | salva as etapas de um site |
| `GET /api/analytics/events?site=&limit=` | logado | eventos recentes |
| `GET/POST/PUT/DELETE /api/analytics/sites` | logado | cadastro de sites |
