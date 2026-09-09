/**
 * Avantis Pixel — rastreio de visitas, rolagem, cliques, vídeo e conversões.
 *
 * Instalação (antes do </body> do site/oferta):
 *   <script defer src="https://SEU-PAINEL/avantis-pixel.js"
 *           data-site="chave-da-oferta"
 *           data-site-name="Nome da Oferta (R$ 47,90)"></script>
 *
 * A chave não precisa existir no painel: na primeira visita o site se cadastra
 * sozinho com o nome de data-site-name.
 *
 * O que envia sozinho:
 *   - pageview a cada carregamento (e a cada troca de rota em SPA)
 *   - rolagem_25 / rolagem_50 / rolagem_75 / rolagem_90 (marcos configuráveis)
 *   - tempo_30s / tempo_60s / tempo_180s (marcos configuráveis)
 *   - clique em qualquer elemento com [data-avantis] e em links externos
 *   - saida_intencao quando o mouse vai para fora da janela (desktop)
 *   - video_play / video_25 / video_50 / video_75 / video_completo em <video>
 *   - form_enviado em qualquer <form> submetido
 *   - saida_pagina no fim da visita, com o resumo do engajamento
 *
 * Ajustes pelo próprio <script> (todos opcionais):
 *   data-scroll="25,50,75,90"     marcos de rolagem (vazio desliga)
 *   data-time="30,60,180"         marcos de tempo em segundos (vazio desliga)
 *   data-video="25,50,75,100"     marcos de vídeo (vazio desliga)
 *   data-exit-intent="0"          desliga o evento de intenção de saída
 *   data-auto-clicks="0"          desliga o clique automático
 *   data-site-name="Oferta X (R$ 47,90)"  nome que aparece no painel
 *   data-site-kind="paid"         organic | paid | both (padrão: organic)
 *   data-allow-localhost="1"      envia mesmo rodando em localhost (padrão: não)
 *   data-endpoint="https://..."   painel diferente do host do script
 *   data-debug="1"                loga no console cada evento enviado
 *
 * Eventos manuais (a estratégia de cada site é diferente — invente os nomes):
 *   avantis.track("lead");
 *   avantis.track("purchase", { value: 47.9, currency: "BRL" });
 *   avantis.track("abriu_pop_saida", { meta: { origem: "mouseout" } });
 *   avantis.track("assistiu_vsl_50", { type: "custom" });
 *   avantis.trackVideo(elementoOuObjeto, "vsl-principal");   // player próprio
 *
 * Marcação direto no HTML:
 *   <button data-avantis="cta_topo">Comprar</button>
 *   <a data-avantis="cta_final" data-avantis-type="lead" data-avantis-value="47.90">…</a>
 *
 * As UTMs e os IDs de anúncio (fbclid/gclid/ttclid) da primeira visita ficam
 * guardados na sessão, então a venda continua atribuída à origem certa.
 */
(function () {
  "use strict";

  var script = document.currentScript;
  var siteKey =
    (script && (script.getAttribute("data-site") || script.getAttribute("data-site-key"))) ||
    window.AVANTIS_SITE_KEY;

  if (!siteKey) {
    console.warn("[avantis-pixel] data-site ausente — nada será enviado.");
    return;
  }

  // ── Configuração ────────────────────────────────────────────────────────────
  function attr(name, fallback) {
    var v = script && script.getAttribute(name);
    return v === null || v === undefined ? fallback : v;
  }

  /**
   * Ambiente de desenvolvimento não entra na conta.
   *
   * Abrir a página no localhost dezenas de vezes por dia enquanto se mexe no
   * site inflaria visitas, rolagem e tudo mais. Só cai fora quem realmente é
   * máquina de desenvolvimento — domínio de verdade sempre envia.
   *
   * Para testar o pixel localmente de propósito: data-allow-localhost="1".
   */
  function ambienteLocal() {
    var host = window.location.hostname || "";
    return (
      window.location.protocol === "file:" ||
      host === "" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host === "0.0.0.0" ||
      /\.local$|\.test$|\.localhost$/i.test(host) ||
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    );
  }

  if (ambienteLocal() && attr("data-allow-localhost", "0") === "0") {
    console.info(
      "[avantis-pixel] ambiente local (" + window.location.hostname +
      ") — nada será enviado. Use data-allow-localhost=\"1\" para testar."
    );
    window.avantis = {
      track: function () { },
      trackVideo: function () { },
      siteKey: siteKey,
      desativado: "ambiente-local",
    };
    return;
  }

  function numbers(value) {
    return String(value)
      .split(",")
      .map(function (n) { return parseFloat(n.trim()); })
      .filter(function (n) { return !isNaN(n); })
      .sort(function (a, b) { return a - b; });
  }

  // Identificação da oferta no painel (usada no cadastro automático).
  var siteName = attr("data-site-name", null);
  var siteKind = attr("data-site-kind", null); // organic | paid | both

  var CONFIG = {
    scroll: numbers(attr("data-scroll", "25,50,75,90")),
    time: numbers(attr("data-time", "30,60,180")),
    video: numbers(attr("data-video", "25,50,75,100")),
    exitIntent: attr("data-exit-intent", "1") !== "0",
    autoClicks: attr("data-auto-clicks", "1") !== "0",
    debug: attr("data-debug", "0") !== "0",
  };

  var endpoint =
    attr("data-endpoint", null) ||
    (script && script.src ? script.src.replace(/\/avantis-pixel\.js.*$/, "") : "");
  var TRACK_URL = endpoint + "/api/track";

  // ── Identificadores ─────────────────────────────────────────────────────────
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  function store(kind, key, value) {
    try {
      var s = kind === "session" ? sessionStorage : localStorage;
      if (value !== undefined) s.setItem(key, value);
      return s.getItem(key);
    } catch (e) {
      return value !== undefined ? value : null;
    }
  }

  var visitorId = store("local", "avantis_vid") || store("local", "avantis_vid", uid());
  var sessionId = store("session", "avantis_sid") || store("session", "avantis_sid", uid());

  // ── Origem do tráfego (persiste na sessão) ──────────────────────────────────
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var CLICK_IDS = { fbclid: "meta", gclid: "google", ttclid: "tiktok", msclkid: "microsoft" };

  function readAttribution() {
    var params = new URLSearchParams(window.location.search);
    var data = {};
    var found = false;

    UTM_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) { data[k] = v; found = true; }
    });

    Object.keys(CLICK_IDS).forEach(function (k) {
      var v = params.get(k);
      if (v) {
        data.click_id = v;
        data.ad_network = CLICK_IDS[k];
        found = true;
      }
    });

    if (found) {
      store("session", "avantis_attr", JSON.stringify(data));
      return data;
    }

    try {
      return JSON.parse(store("session", "avantis_attr") || "{}");
    } catch (e) {
      return {};
    }
  }

  var attribution = readAttribution();

  // ── Envio ───────────────────────────────────────────────────────────────────
  function send(payload) {
    var body = JSON.stringify(payload);
    if (CONFIG.debug) console.log("[avantis-pixel]", payload.eventName, payload);

    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
        if (navigator.sendBeacon(TRACK_URL, blob)) return;
      }
    } catch (e) { /* cai no fetch */ }

    try {
      fetch(TRACK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: body,
        keepalive: true,
        mode: "cors",
      }).catch(function () { });
    } catch (e) { /* silencioso: nunca quebrar o site */ }
  }

  /** Evita mandar duas vezes o mesmo marco na mesma página. */
  var jaEnviado = {};
  function once(chave, fn) {
    if (jaEnviado[chave]) return;
    jaEnviado[chave] = true;
    fn();
  }

  function track(eventName, options) {
    options = options || {};
    var type = options.type;
    if (!type) {
      type = ["pageview", "click", "lead", "purchase"].indexOf(eventName) >= 0
        ? eventName
        : "custom";
    }

    send({
      siteKey: siteKey,
      siteName: siteName,
      siteKind: siteKind,
      eventName: eventName,
      eventType: type,
      url: window.location.href,
      path: window.location.pathname || "/",
      referrer: document.referrer || null,
      utmSource: attribution.utm_source || null,
      utmMedium: attribution.utm_medium || null,
      utmCampaign: attribution.utm_campaign || null,
      utmContent: attribution.utm_content || null,
      utmTerm: attribution.utm_term || null,
      clickId: attribution.click_id || null,
      adNetwork: attribution.ad_network || null,
      visitorId: visitorId,
      sessionId: sessionId,
      value: options.value,
      currency: options.currency || "BRL",
      language: navigator.language || null,
      userAgent: navigator.userAgent,
      meta: options.meta || {},
    });
  }

  // ── Pageview automático (inclusive em SPAs) ─────────────────────────────────
  var inicio = Date.now();
  var rolagemMaxima = 0;
  var cliques = 0;

  track("pageview");

  var lastPath = window.location.pathname;
  function onRouteChange() {
    if (window.location.pathname === lastPath) return;
    lastPath = window.location.pathname;
    jaEnviado = {};
    inicio = Date.now();
    rolagemMaxima = 0;
    track("pageview");
  }
  ["pushState", "replaceState"].forEach(function (m) {
    var orig = history[m];
    history[m] = function () {
      var r = orig.apply(this, arguments);
      setTimeout(onRouteChange, 0);
      return r;
    };
  });
  window.addEventListener("popstate", onRouteChange);

  // ── Rolagem ─────────────────────────────────────────────────────────────────
  function percentualLido() {
    var doc = document.documentElement;
    var alturaTotal = Math.max(
      document.body.scrollHeight, doc.scrollHeight,
      document.body.offsetHeight, doc.offsetHeight
    );
    var visivel = window.innerHeight || doc.clientHeight;
    var rolavel = alturaTotal - visivel;
    if (rolavel <= 0) return 100;
    var y = window.pageYOffset || doc.scrollTop || 0;
    return Math.min(Math.round((y / rolavel) * 100), 100);
  }

  function checarRolagem() {
    var pct = percentualLido();
    if (pct > rolagemMaxima) rolagemMaxima = pct;
    CONFIG.scroll.forEach(function (marco) {
      if (pct >= marco) {
        once("scroll-" + marco, function () {
          track("rolagem_" + marco, { meta: { percentual: marco } });
        });
      }
    });
  }

  if (CONFIG.scroll.length) {
    var scrollAgendado = false;
    window.addEventListener("scroll", function () {
      if (scrollAgendado) return;
      scrollAgendado = true;
      setTimeout(function () { scrollAgendado = false; checarRolagem(); }, 300);
    }, { passive: true });
    checarRolagem();
  }

  // ── Tempo na página ─────────────────────────────────────────────────────────
  CONFIG.time.forEach(function (segundos) {
    setTimeout(function () {
      // Só conta quem ainda está com a aba aberta.
      if (document.visibilityState === "hidden") return;
      once("tempo-" + segundos, function () {
        track("tempo_" + segundos + "s", { meta: { segundos: segundos } });
      });
    }, segundos * 1000);
  });

  // ── Cliques ─────────────────────────────────────────────────────────────────
  if (CONFIG.autoClicks) {
    document.addEventListener(
      "click",
      function (ev) {
        var el = ev.target && ev.target.closest
          ? ev.target.closest("a, button, [data-avantis]")
          : null;
        if (!el) return;

        var named = el.getAttribute("data-avantis");
        var href = el.getAttribute("href") || "";
        var isExternal = href && /^https?:\/\//i.test(href) && href.indexOf(window.location.host) === -1;

        if (!named && !isExternal) return;
        cliques++;

        var valor = el.getAttribute("data-avantis-value");
        track(named || "clique_saida", {
          type: el.getAttribute("data-avantis-type") || "click",
          value: valor ? parseFloat(String(valor).replace(",", ".")) : undefined,
          meta: {
            href: href || null,
            texto: (el.innerText || "").trim().slice(0, 120) || null,
            segundos: Math.round((Date.now() - inicio) / 1000),
            rolagem: rolagemMaxima,
          },
        });
      },
      true
    );
  }

  // ── Intenção de saída ───────────────────────────────────────────────────────
  if (CONFIG.exitIntent) {
    document.addEventListener("mouseout", function (ev) {
      if (ev.clientY > 0 || ev.relatedTarget) return;
      once("exit-intent", function () {
        track("saida_intencao", {
          meta: {
            segundos: Math.round((Date.now() - inicio) / 1000),
            rolagem: rolagemMaxima,
          },
        });
      });
    });
  }

  // ── Vídeo / VSL ─────────────────────────────────────────────────────────────
  /**
   * Liga os marcos de progresso a um player.
   * @param alvo  um <video> da página, ou um objeto { duration, currentTime }
   *              consultado a cada segundo (players de terceiros).
   * @param nome  identificador do vídeo nos relatórios (ex.: "vsl-principal").
   */
  function trackVideo(alvo, nome) {
    if (!alvo || !CONFIG.video.length) return;
    var id = nome || alvo.getAttribute && (alvo.getAttribute("data-avantis-video") || alvo.id) || "video";

    function progresso() {
      var duracao = Number(alvo.duration) || 0;
      var atual = Number(alvo.currentTime) || 0;
      if (!duracao) return;
      var pct = Math.min(Math.round((atual / duracao) * 100), 100);

      CONFIG.video.forEach(function (marco) {
        if (pct >= marco) {
          once("video-" + id + "-" + marco, function () {
            track(marco >= 100 ? "video_completo" : "video_" + marco, {
              meta: { video: id, percentual: marco, segundos: Math.round(atual) },
            });
          });
        }
      });
    }

    if (typeof alvo.addEventListener === "function") {
      alvo.addEventListener("play", function () {
        once("video-" + id + "-play", function () {
          track("video_play", { meta: { video: id } });
        });
      });
      alvo.addEventListener("timeupdate", progresso);
      alvo.addEventListener("ended", function () {
        once("video-" + id + "-100", function () {
          track("video_completo", { meta: { video: id, percentual: 100 } });
        });
      });
    } else {
      // Player de terceiros: consulta o estado uma vez por segundo.
      setInterval(progresso, 1000);
    }
  }

  function ligarVideosDaPagina() {
    var videos = document.querySelectorAll("video");
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].__avantisLigado) continue;
      videos[i].__avantisLigado = true;
      trackVideo(videos[i], videos[i].getAttribute("data-avantis-video") || "video-" + (i + 1));
    }
  }
  ligarVideosDaPagina();
  // VSLs costumam ser injetadas depois do carregamento.
  setTimeout(ligarVideosDaPagina, 3000);
  setTimeout(ligarVideosDaPagina, 10000);

  // ── Formulários ─────────────────────────────────────────────────────────────
  document.addEventListener("submit", function (ev) {
    var form = ev.target;
    if (!form || form.hasAttribute("data-avantis-ignore")) return;
    track(form.getAttribute("data-avantis") || "form_enviado", {
      type: form.getAttribute("data-avantis-type") || "lead",
      meta: {
        formulario: form.getAttribute("name") || form.id || null,
        segundos: Math.round((Date.now() - inicio) / 1000),
      },
    });
  }, true);

  // ── Fim da visita: resumo do engajamento ────────────────────────────────────
  function encerrar() {
    once("saida", function () {
      track("saida_pagina", {
        meta: {
          segundos: Math.round((Date.now() - inicio) / 1000),
          rolagem: rolagemMaxima,
          cliques: cliques,
        },
      });
    });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") encerrar();
  });
  window.addEventListener("pagehide", encerrar);

  // ── API pública ─────────────────────────────────────────────────────────────
  window.avantis = {
    track: track,
    trackVideo: trackVideo,
    siteKey: siteKey,
    siteName: siteName,
    visitorId: visitorId,
    sessionId: sessionId,
    attribution: attribution,
    config: CONFIG,
  };
})();
