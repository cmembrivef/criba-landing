/* Criba · lista de espera
   - Guarda los UTM de la visita (canal y pieza) para que viajen con cada registro.
   - Envía el formulario a Netlify Forms sin recargar la página. Sin JS, el formulario
     funciona igual y lleva a /gracias/. */
(function () {
  "use strict";

  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  var store = {
    get: function (k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  };

  var params = new URLSearchParams(window.location.search);
  var hasUtm = KEYS.some(function (k) { return params.get(k); });
  if (hasUtm) {
    KEYS.forEach(function (k) { store.set("criba_" + k, params.get(k) || ""); });
  }

  var referente = "";
  try {
    if (document.referrer) {
      var u = new URL(document.referrer);
      if (u.host !== window.location.host) referente = u.host;
    }
  } catch (e) { /* referrer ilegible */ }
  if (referente && !store.get("criba_referente")) store.set("criba_referente", referente);

  var form = document.getElementById("form-lista");
  if (!form) return;

  KEYS.forEach(function (k) {
    var el = form.elements[k];
    if (el) el.value = (hasUtm ? params.get(k) : store.get("criba_" + k)) || "";
  });
  if (form.elements.referente) {
    form.elements.referente.value = store.get("criba_referente") || referente || "";
  }

  var box = form.closest(".registro");
  var ok = box ? box.querySelector(".ok") : null;
  var err = form.querySelector(".form__error");
  var btn = form.querySelector("button[type='submit']");
  var btnTxt = btn ? btn.querySelector(".btn__txt") : null;

  function setSending(sending) {
    if (!btn) return;
    btn.disabled = sending;
    if (btnTxt) btnTxt.textContent = sending ? "Apuntando…" : "Apuntarme";
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (err) err.hidden = true;
    setSending(true);

    var body = new URLSearchParams(new FormData(form)).toString();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.hidden = true;
      if (ok) {
        ok.hidden = false;
        ok.focus();
      }
      // Conversión para Google Analytics (solo se envía si la persona aceptó las cookies)
      if (typeof window.cribaEvento === "function") {
        var pack = form.querySelector("input[name='pack']:checked");
        window.cribaEvento("generate_lead", { pack: pack ? pack.value : "sin-elegir" });
      }
    }).catch(function () {
      if (err) err.hidden = false;
      setSending(false);
    });
  });

  // Los botones «Apuntarme» del resto de la página llevan al formulario y dejan el cursor en el correo.
  var links = document.querySelectorAll('a[href="#lista"]');
  Array.prototype.forEach.call(links, function (a) {
    a.addEventListener("click", function () {
      var email = form.elements.email;
      if (email && !form.hidden) {
        window.setTimeout(function () { email.focus({ preventScroll: true }); }, 450);
      }
    });
  });
})();
