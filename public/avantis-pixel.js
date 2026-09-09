/**
 * Avantis Pixel — rastreio de visitas, cliques e conversões.
 *
 * Instalação (antes do </body> do site/oferta):
 *   <script defer src="https://SEU-PAINEL/avantis-pixel.js" data-site="CHAVE-DO-SITE"></script>
 *
 * O que envia sozinho:
 *   - pageview a cada carregamento (e a cada troca de rota em SPA)
 *   - click em qualquer elemento com [data-avantis] e em links externos
 *
 * Eventos manuais:
 *   avantis.track("lead");
 *   avantis.track("purchase", { value: 97, currency: "BRL" });
 *   avantis.track("clicou_botao_topo", { type: "click" });
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

  var endpoint =
    (script && script.getAttribute("data-endpoint")) ||
    (script && script.src ? script.src.replace(/\/avantis-pixel\.js.*$/, "") : "") ;
  var TRACK_URL = endpoint + "/api/track";

  // ── Identificadores ─────────────────────────────────────────────────────────
  function uid() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 10)
    );
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
    } catch (e) { /* silencioso: nunca quebrar o site do cliente */ }
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
  track("pageview");

  var lastPath = window.location.pathname;
  function onRouteChange() {
    if (window.location.pathname === lastPath) return;
    lastPath = window.location.pathname;
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

  // ── Cliques automáticos ─────────────────────────────────────────────────────
  document.addEventListener(
    "click",
    function (ev) {
      var el = ev.target && ev.target.closest ? ev.target.closest("a, button, [data-avantis]") : null;
      if (!el) return;

      var named = el.getAttribute("data-avantis");
      var href = el.getAttribute("href") || "";
      var isExternal = href && /^https?:\/\//i.test(href) && href.indexOf(window.location.host) === -1;

      if (!named && !isExternal) return;

      track(named || "clique_saida", {
        type: "click",
        value: el.getAttribute("data-avantis-value") || undefined,
        meta: {
          href: href || null,
          texto: (el.innerText || "").trim().slice(0, 120) || null,
        },
      });
    },
    true
  );

  // ── API pública ─────────────────────────────────────────────────────────────
  window.avantis = {
    track: track,
    siteKey: siteKey,
    visitorId: visitorId,
    sessionId: sessionId,
    attribution: attribution,
  };
})();
