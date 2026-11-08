/* Criba · aviso de cookies y Google Analytics 4
   - Analytics solo se carga si la persona pulsa «Aceptar» (consentimiento previo, como pide la AEPD).
   - «Aceptar» y «Rechazar» tienen el mismo peso visual.
   - La elección se guarda en este navegador y se puede cambiar con cualquier enlace marcado
     con data-abrir-cookies (el «Cookies» del pie y el botón de la política de privacidad). */
(function () {
  "use strict";

  var GA_ID = "";            // ID de medición de Google Analytics (G-…). Vacío = sin Analytics ni aviso.
  var CLAVE = "criba_cookies"; // "si" | "no"
  var DIAS = 90;             // duración máxima de las cookies de Analytics

  if (!/^G-[A-Z0-9]+$/.test(GA_ID)) return;

  function leer() { try { return window.localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { window.localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento */ } }
  function olvidar() { try { window.localStorage.removeItem(CLAVE); } catch (e) { /* sin almacenamiento */ } }

  var cargado = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function activarGA() {
    window["ga-disable-" + GA_ID] = false;
    if (cargado) return;
    cargado = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { cookie_expires: DIAS * 24 * 60 * 60 });
  }

  function desactivarGA() {
    window["ga-disable-" + GA_ID] = true;
    var host = window.location.hostname;
    var dominios = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    document.cookie.split(";").forEach(function (c) {
      var nombre = c.split("=")[0].trim();
      if (nombre === "_ga" || nombre.indexOf("_ga_") === 0) {
        dominios.forEach(function (d) {
          document.cookie = nombre + "=; Max-Age=0; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  var aviso = null;
  function crearAviso() {
    aviso = document.createElement("div");
    aviso.className = "cookies";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.innerHTML =
      '<p class="cookies__texto">¿Nos dejas contar las visitas con Google Analytics? Usa cookies y solo lo activamos si aceptas. ' +
      '<a href="/privacidad/#cookies">Más información</a>.</p>' +
      '<div class="cookies__botones">' +
      '<button type="button" class="cookies__btn" data-cookies="si">Aceptar</button>' +
      '<button type="button" class="cookies__btn" data-cookies="no">Rechazar</button>' +
      "</div>";
    aviso.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-cookies]");
      if (!b) return;
      var v = b.getAttribute("data-cookies");
      guardar(v);
      ocultar();
      if (v === "si") activarGA(); else desactivarGA();
    });
    document.body.appendChild(aviso);
  }
  function mostrar() {
    if (!aviso) crearAviso();
    aviso.hidden = false;
    document.body.classList.add("con-aviso");
  }
  function ocultar() {
    if (aviso) aviso.hidden = true;
    document.body.classList.remove("con-aviso");
  }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest("[data-abrir-cookies]");
    if (!a) return;
    ev.preventDefault();
    olvidar();
    desactivarGA();
    mostrar();
  });

  // Para main.js: evento de conversión, solo si hay consentimiento
  window.cribaEvento = function (nombre, datos) {
    if (cargado && !window["ga-disable-" + GA_ID]) window.gtag("event", nombre, datos || {});
  };

  var eleccion = leer();
  if (eleccion === "si") activarGA();
  else if (eleccion !== "no") mostrar();
})();
