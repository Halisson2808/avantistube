# Pixel Avantis — guia de instalação para sites e ofertas

> **Para quem está lendo isto:** este documento descreve o sistema de rastreamento
> próprio do dono deste site (painel Avantis). Leia a página que acabou de ser
> criada, decida quais eventos fazem sentido para ela e implemente. Não invente
> nomes de plataforma nem instale Google Analytics, Meta Pixel ou similares —
> aqui o rastreio é este, e só este.
>
> **Nada precisa ser cadastrado à mão.** Você escolhe a chave e o nome do site na
> própria tag; na primeira visita o site aparece no painel sozinho, já com os
> eventos. Entregue no fim só a lista do que implementou, para o dono conferir.

---

## 1. O que é

Um `<script>` de 16 KB (4,7 KB comprimido), sem dependência, que manda eventos para o painel Avantis
(`https://avantisstudio.vercel.app`) e grava tudo no Supabase. Serve para montar
funil, ver origem de anúncio (UTM, fbclid/gclid/ttclid), medir retenção de VSL,
rolagem, tempo de página, pop de saída e receita por criativo.

Nada bloqueia a página: o script é `defer`, falha em silêncio e nunca lança erro
para o site.

## 2. Instalação mínima (obrigatória em toda página)

Antes do `</body>`:

```html
<script defer src="https://avantisstudio.vercel.app/avantis-pixel.js"
        data-site="caderno-avo-yuki"
        data-site-name="Avó Yuki — Caderno (R$ 47,90)"></script>
```

**Você mesmo escolhe a chave e o nome — não precisa pedir nada a ninguém.**
Na primeira visita rastreada, o site se cadastra sozinho no painel com esse nome.

### `data-site` — a chave (identificador técnico)

- minúsculas, sem acento, separado por hífen: `avo-yuki`, `pele-coreana`;
- **uma chave por SITE, não por página e não por oferta**. Todas as rotas do
  mesmo domínio usam a MESMA chave: `/`, `/vsl`, `/sono`, `/upsell`, `/obrigado`.
  O painel separa por rota depois, com um filtro próprio — e o dono quer ver o
  site inteiro num painel só;
- só crie chave nova quando for outro site/domínio de verdade;
- se o dono te passou uma chave pronta, use a dele.

> Errado: `avo-yuki-caderno` numa página e `avo-yuki-sono` noutra do mesmo site.
> Certo: `avo-yuki` nas duas — o caminho da URL já distingue.

### `data-site-name` — o nome que ele vê no painel

Como o nome vale para o site inteiro, ele é o nome da marca/projeto — sem preço
e sem variação, porque um site tem várias ofertas dentro:

```
Avó Yuki
Pele Coreana 50+
Protocolo Alfa
```

- do jeito que o dono chama, acentuado e com maiúsculas normais;
- o mesmo nome em todas as páginas do site;
- sem esse atributo o painel inventa um nome a partir da chave
  (`avo-yuki` → "Avo Yuki"), sem acento — **sempre mande o nome**.

Opcional: `data-site-kind`. **O padrão é `organic` e é para deixar assim.** Só
use `paid` ou `both` se o dono disser, naquela conversa, que vai rodar anúncio
para esse site. Não chute.

> Se o dono renomear o site no painel depois, o nome dele prevalece — a tag não
> sobrescreve nome que foi ajustado à mão.

## 3. O que já vem sozinho (não precisa codar nada)

| Evento | Quando dispara | `meta` |
| --- | --- | --- |
| `pageview` | todo carregamento, e toda troca de rota em SPA | — |
| `rolagem_25`, `rolagem_50`, `rolagem_75`, `rolagem_90` | ao passar de cada marco da página | `percentual` |
| `tempo_30s`, `tempo_60s`, `tempo_180s` | tempo com a aba aberta na frente | `segundos` |
| `clique_saida` | clique em link externo sem marcação | `href`, `texto`, `segundos`, `rolagem` |
| `saida_intencao` | o mouse sai pelo topo da janela (desktop) | `segundos`, `rolagem` |
| `video_play` | primeiro play de qualquer `<video>` | `video` |
| `video_25`, `video_50`, `video_75`, `video_completo` | progresso do `<video>` | `video`, `percentual`, `segundos` |
| `form_enviado` | submit de qualquer `<form>` (entra como **lead**) | `formulario`, `segundos` |
| `saida_pagina` | fim da visita | `segundos`, `rolagem` (máxima), `cliques` |

Todo evento carrega junto, automaticamente: UTMs, `fbclid`/`gclid`/`ttclid` +
a rede do anúncio, id de visitante (localStorage), id de sessão (sessionStorage),
caminho da página, referenciador, idioma e aparelho/navegador/SO.

**Atribuição:** a origem da primeira visita fica guardada na sessão, então uma
venda que acontece 20 minutos depois continua atribuída à campanha certa.

## 4. Ajustando os marcos (na própria tag)

```html
<script defer src="https://avantisstudio.vercel.app/avantis-pixel.js"
        data-site="CHAVE"
        data-scroll="10,25,50,75,90,100"
        data-time="15,30,60,120,300"
        data-video="10,25,50,75,90,100"
        data-exit-intent="1"
        data-auto-clicks="1"
        data-debug="0"></script>
```

| Atributo | Padrão | Para que serve |
| --- | --- | --- |
| `data-scroll` | `25,50,75,90` | marcos de rolagem; `""` desliga |
| `data-time` | `30,60,180` | marcos de tempo em segundos; `""` desliga |
| `data-video` | `25,50,75,100` | marcos de vídeo; `""` desliga |
| `data-exit-intent` | `1` | `0` desliga o evento de intenção de saída |
| `data-auto-clicks` | `1` | `0` desliga o clique automático |
| `data-endpoint` | host do script | só se o painel estiver em outro domínio |
| `data-debug` | `0` | `1` loga cada evento no console (use para testar) |

**Como escolher:** página longa de texto pede rolagem fina (`10,25,50,75,90,100`);
página de VSL pede tempo curto no começo (`15,30,60,180,300`) porque o que importa
é quanto da carta a pessoa aguentou; página de captura simples pode desligar
rolagem e tempo e ficar só no clique e no form.

## 5. Marcação no HTML (o mais importante)

Todo botão que importa deve ter nome próprio. Sem isso, todo clique cai no balde
`clique_saida` e não dá para saber qual CTA vendeu.

```html
<a href="https://pay.exemplo.com/abc"
   data-avantis="cta_topo"
   data-avantis-value="47.90">QUERO AGORA</a>
```

| Atributo | Efeito |
| --- | --- |
| `data-avantis="nome"` | nome do evento no painel |
| `data-avantis-value="47.90"` | valor em reais (ponto decimal, não vírgula) |
| `data-avantis-type="lead"` | muda o tipo: `click` (padrão), `lead`, `purchase`, `custom` |
| `data-avantis-video="vsl-principal"` | dá nome a um `<video>` nos relatórios |
| `data-avantis-ignore` | num `<form>`, não rastreia aquele envio |

### Convenção de nomes (siga esta)

- minúsculas, sem acento, separado por `_`;
- prefixo dizendo o que é: `cta_`, `pop_`, `bump_`, `video_`, `form_`, `secao_`;
- posição em vez de cor/texto: `cta_topo`, `cta_meio`, `cta_final`,
  `cta_barra_mobile`, `cta_pop_saida`, `cta_checkout`;
- order bump / upsell: `bump_1_aceito`, `upsell_recusado`;
- se houver mais de um botão igual, numere pela ordem na página: `cta_meio_2`.

Nome de evento é livre — o painel agrega qualquer coisa que chegar e o dono
transforma em etapa de funil sem mexer em código. Melhor um nome específico
demais do que dois botões diferentes com o mesmo nome.

## 6. Eventos por código

Depois que o script carrega, existe `window.avantis`:

```js
avantis.track("lead");                                  // tipo lead
avantis.track("purchase", { value: 47.9 });             // tipo purchase, com receita
avantis.track("bump_1_aceito", { value: 27 });          // custom com valor
avantis.track("secao_depoimentos_vista");               // custom simples
avantis.track("pop_saida_exibido", { meta: { origem: "mouseout" } });
```

Assinatura: `avantis.track(nome, { type, value, currency, meta })` — tudo opcional.
O `type` é deduzido do nome quando ele for exatamente `pageview`, `click`, `lead`
ou `purchase`; qualquer outro nome vira `custom`.

Como o script é `defer`, proteja chamadas que rodem cedo:

```js
const rastrear = (nome, dados) => window.avantis && window.avantis.track(nome, dados);
```

### Vídeo que não é `<video>`

Players de terceiros (VTurb, Panda, Vimeo, YouTube API…) não são detectados
sozinho. Ligue manualmente passando algo que exponha `duration` e `currentTime`:

```js
avantis.trackVideo(player, "vsl-principal");
```

O pixel consulta uma vez por segundo e dispara os marcos configurados. Se o player
só oferece callbacks de progresso, mande os eventos na mão:

```js
player.on("progress", (pct) => {
  if (pct >= 50) avantis.track("video_50", { meta: { video: "vsl-principal", percentual: 50 } });
});
```

> Mantenha o padrão `video_NN` e `meta.percentual`: é assim que o painel monta a
> curva de retenção. O mesmo vale para `rolagem_NN`.

## 7. O que instrumentar em cada tipo de página

**Página de vendas com VSL**
- marcos de tempo curtos e de vídeo (`data-time="15,30,60,180,300"`);
- `video_play` e retenção (vem sozinho no `<video>`, ou via `trackVideo`);
- CTA que aparece depois do pitch: `cta_pos_vsl`;
- se o botão fica escondido até X minutos, dispare `cta_liberado` quando ele aparecer.

**Página de vendas longa (texto)**
- rolagem fina;
- um `data-avantis` em cada CTA, pela posição;
- `secao_X_vista` nas seções decisivas (preço, garantia, depoimentos), via
  `IntersectionObserver`.

**Pop de saída / modal**
- `pop_saida_exibido` quando abre, com `meta.origem` (mouse, tempo, scroll);
- `pop_saida_fechado` com `meta.via` (x, botão, clique fora);
- o CTA de dentro do pop com `data-avantis="cta_pop_saida"`.

**Barra fixa / sticky**
- `barra_mobile_exibida` quando ela aparece;
- CTA com `data-avantis="cta_barra_mobile"`.

**Captura de lead**
- o `<form>` já vira `form_enviado` (tipo lead) sozinho;
- para nomear: `<form data-avantis="lead_ebook">`.

**Checkout externo (Cakto, Hotmart, Kiwify…)**
- o clique que sai da página é o mais próximo de venda que dá para medir aqui —
  marque com `data-avantis` e `data-avantis-value`;
- venda confirmada só entra se a página de obrigado tiver o pixel e disparar
  `avantis.track("purchase", { value: 47.9 })`.

**Página de obrigado — obrigatória em toda oferta**

Sem ela o funil termina no clique do checkout e a receita nunca aparece: o
checkout é de terceiro (Cakto, Hotmart, Kiwify) e não avisa o painel sozinho.

Se a oferta ainda não tiver página de obrigado, **crie uma** (`/obrigado`) e
configure-a como página de redirecionamento pós-compra na plataforma. Regras:

- mesma chave do site (`data-site` idêntico ao das outras páginas);
- dispara `purchase` assim que carrega, com o valor real da venda;
- se a plataforma mandar o valor na URL, use-o em vez do preço fixo;
- nada de disparar `purchase` em página que a pessoa possa abrir sem ter
  comprado (não vale colocar num popup ou na própria página de vendas).

```html
<script defer src="https://avantisstudio.vercel.app/avantis-pixel.js"
        data-site="avo-yuki" data-site-name="Avó Yuki"></script>
<script>
  window.addEventListener("load", function () {
    var p = new URLSearchParams(location.search);
    var valor = parseFloat(p.get("valor") || p.get("amount") || "47.90");
    if (window.avantis) window.avantis.track("purchase", { value: valor });
  });
</script>
```

Entregue sempre dizendo se a página de obrigado foi criada e qual o valor usado.

## 8. Localhost não conta

O pixel se desliga sozinho em ambiente de desenvolvimento — `localhost`,
`127.0.0.1`, `192.168.x`, `10.x`, `172.16-31.x`, domínios `.local`/`.test` e
arquivos abertos direto (`file://`). Nesses casos ele escreve um aviso no console
e não manda nada.

Isso é de propósito: o dono abre a página dezenas de vezes por dia enquanto
constrói, e isso inflaria visitas, rolagem e funil com tráfego que não existe.

- **Não remova essa proteção** e não coloque `data-allow-localhost="1"` na tag
  que vai para produção.
- Para testar o pixel de propósito na sua máquina, use `data-allow-localhost="1"`
  **temporariamente** e tire antes de publicar. Melhor ainda: teste no domínio de
  preview (Vercel/Netlify), que já conta como produção.
- Como confirmar que está instalado sem ter dados: o console mostra
  `[avantis-pixel] ambiente local ... nada será enviado`. Isso é sinal de que
  carregou certo.

## 9. Regras que não podem ser quebradas

1. Um `data-avantis` por elemento clicável importante — sem exceção.
2. `data-avantis-value` sempre com **ponto** decimal (`47.90`, nunca `47,90`).
3. Nada de dado pessoal em nome de evento ou em `meta` — sem e-mail, telefone,
   CPF ou nome. O pixel identifica por id anônimo, e é para continuar assim.
   (O `value` aceita vírgula, mas o padrão da casa é ponto.)
4. Não duplicar o mesmo sinal: se o botão já tem `data-avantis`, não chame
   `avantis.track` no mesmo clique — vira contagem dobrada.
5. Não colocar o script duas vezes na mesma página.
6. Nada de `async` no lugar de `defer`, e nada de mover o script para o `<head>`
   sem `defer` — a página vem primeiro.
7. Os marcos são idempotentes por carregamento (cada um dispara uma vez só);
   se você criar eventos próprios repetitivos, garanta você mesmo que não vão
   disparar em looping de scroll.

## 10. Como testar antes de entregar

1. Suba a página e abra com `?utm_source=teste&utm_medium=cpc&utm_campaign=validacao`.
2. Troque `data-debug="0"` por `data-debug="1"` e abra o console: cada evento
   aparece como `[avantis-pixel] nome {…}`.
3. Role a página inteira, clique em cada CTA (volte depois), abra o pop de saída.
4. Confirme no console: `pageview`, os `rolagem_*`, os `cta_*` com o valor certo,
   e `saida_pagina` ao trocar de aba.
5. Volte `data-debug` para `0` antes de publicar.
6. O dono confere em `/analytics/eventos` no painel, que mostra os eventos ao vivo.
   O site aparece sozinho em `/analytics/sites`, marcado como "automático",
   assim que o primeiro evento chegar.

## 11. Modelo de entrega

Termine a tarefa listando assim:

```
Pixel instalado — chave: <CHAVE-DO-SITE>   nome no painel: <NOME DO SITE>
Páginas: /, /vsl, /obrigado   (todas com a MESMA chave)

Automático: pageview, rolagem 25/50/75/90, tempo 30/60/180s, saida_intencao, saida_pagina
Marcados a mão:
  cta_topo         (R$ 47,90)  botão do primeiro dobra
  cta_meio         (R$ 47,90)  depois dos depoimentos
  cta_final        (R$ 47,90)  bloco de preço
  cta_pop_saida    (R$ 47,90)  dentro do modal de saída
  pop_saida_exibido / pop_saida_fechado
  purchase         (valor real) na página de obrigado

Sugestão de funil: pageview → rolagem_50 → cta_final → purchase
```
