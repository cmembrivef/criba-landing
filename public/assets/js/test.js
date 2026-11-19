/* Criba · test «¿Qué Criba eres?»
   Cinco preguntas → uno de los nueve cafés.
   - Preguntas 1 a 3: intensidad (0 ligero · 2 intenso). Suma 0–2 → café 01, 3 → café 02, 4–6 → café 03.
     Con estos cortes cada posición sale con una frecuencia parecida (37 % · 26 % · 37 %).
   - Pregunta 4: elige el pack. La 5 lo confirma o sugiere un segundo pack.
   - El resultado se queda en este navegador. Solo viaja si la persona se apunta después
     (campo «resultado_test» del formulario). */
(function () {
  "use strict";

  var PACKS = {
    momentos: {
      n: "01", nombre: "Momentos", razon: "te importa cuándo y con quién te lo tomas",
      cafes: [
        { nombre: "Chispa", tag: "afrutado y vivo.", origen: "Etiopía · Guji", proceso: "Lavado", notas: "Limón · azahar · té negro", icono: "chispa" },
        { nombre: "Charla", tag: "dulce y redondo.", origen: "Colombia · Huila", proceso: "Lavado", notas: "Caramelo · manzana roja · panela", icono: "charla" },
        { nombre: "Sobremesa", tag: "chocolate con cuerpo.", origen: "Brasil · Cerrado Mineiro", proceso: "Natural", notas: "Cacao · avellana · galleta", icono: "sobremesa" }
      ]
    },
    procesos: {
      n: "02", nombre: "Procesos", razon: "te interesa cómo se trabaja el café después de la cosecha",
      cafes: [
        { nombre: "Agua", tag: "limpio y brillante.", origen: "Costa Rica · Tarrazú", proceso: "Lavado", notas: "Lima · manzana verde · té blanco", icono: "agua" },
        { nombre: "Miel", tag: "meloso y suave.", origen: "Costa Rica · Tarrazú", proceso: "Honey", notas: "Melocotón · miel · caramelo", icono: "miel" },
        { nombre: "Sol", tag: "frutal e intenso.", origen: "Costa Rica · Tarrazú", proceso: "Natural", notas: "Fresa · vino tinto · chocolate", icono: "sol" }
      ]
    },
    origenes: {
      n: "03", nombre: "Orígenes", razon: "lo que te mueve es de dónde viene cada grano",
      cafes: [
        { nombre: "Sabana", tag: "jugoso y vibrante.", origen: "Kenia · Nyeri", proceso: "Lavado", notas: "Grosella negra · pomelo · tomate dulce", icono: "sabana" },
        { nombre: "Volcán", tag: "equilibrado y profundo.", origen: "Guatemala · Acatenango", proceso: "Lavado", notas: "Chocolate con leche · ciruela · almendra", icono: "volcan" },
        { nombre: "Isla", tag: "especiado y con cuerpo.", origen: "Indonesia · Java", proceso: "Lavado", notas: "Especias · cacao amargo · cedro", icono: "isla" }
      ]
    }
  };

  // i = intensidad · p = pack
  var PREGUNTAS = [
    { t: "¿Cómo te tomas el café?", o: [
      { l: "Solo, tal cual sale", i: 0 },
      { l: "Con un chorrito de leche", i: 1 },
      { l: "Con leche, siempre", i: 2 } ] },
    { t: "Elige postre.", o: [
      { l: "Sorbete de limón", i: 0 },
      { l: "Tarta de manzana", i: 1 },
      { l: "Brownie templado", i: 2 } ] },
    { t: "¿Y el chocolate?", o: [
      { l: "Blanco, o mejor fruta", i: 0 },
      { l: "Con leche y avellanas", i: 1 },
      { l: "Negro, cuanto más mejor", i: 2 } ] },
    { t: "De un café nuevo, lo que más te llama es…", o: [
      { l: "Cuándo tomarlo", d: "el momento del día", p: "momentos" },
      { l: "Cómo se ha hecho", d: "el proceso después de la cosecha", p: "procesos" },
      { l: "De dónde viene", d: "el país y la tierra", p: "origenes" } ] },
    { t: "Un sábado libre, tú…", o: [
      { l: "Quedas a comer y alargas la sobremesa", p: "momentos" },
      { l: "Te apuntas a un taller o visitas una bodega", p: "procesos" },
      { l: "Coges un tren a un sitio donde no has estado", p: "origenes" } ] }
  ];

  // Ilustraciones de línea con el relleno desplazado (registro imperfecto del manual)
  var ICONOS = {
    chispa: { r: '<path d="M50 14 58 42 86 50 58 58 50 86 42 58 14 50 42 42Z"/>',
              l: '<path d="M50 14 58 42 86 50 58 58 50 86 42 58 14 50 42 42Z"/>' },
    charla: { r: '<rect x="40" y="42" width="48" height="30" rx="13"/>',
              l: '<rect x="12" y="20" width="50" height="34" rx="14"/><rect x="40" y="42" width="48" height="30" rx="13"/><circle class="punto" cx="28" cy="37" r="3"/><circle class="punto" cx="37" cy="37" r="3"/><circle class="punto" cx="46" cy="37" r="3"/>' },
    sobremesa: { r: '<path d="M26 44h44v10a22 22 0 0 1-44 0z"/>',
              l: '<path d="M26 44h44v10a22 22 0 0 1-44 0z"/><path d="M70 50a8 8 0 0 1 0 14"/><path d="M18 82h60"/><path d="M40 22q4 6 0 12M52 22q4 6 0 12"/>' },
    agua: { r: '<path d="M50 16C40 34 30 46 30 60a20 20 0 0 0 40 0C70 46 60 34 50 16Z"/>',
            l: '<path d="M50 16C40 34 30 46 30 60a20 20 0 0 0 40 0C70 46 60 34 50 16Z"/><path d="M24 88q8-5 16 0t16 0 16 0"/>' },
    miel: { r: '<rect x="34" y="36" width="32" height="34" rx="12"/>',
            l: '<path d="M50 10v26"/><rect x="34" y="36" width="32" height="34" rx="12"/><path d="M34 47h32M34 59h32"/><path d="M50 70v12q0 6 4 6"/>' },
    sol: { r: '<circle cx="50" cy="50" r="17"/>',
           l: '<circle cx="50" cy="50" r="17"/><path d="M50 13v10M50 77v10M13 50h10M77 50h10M24 24l7 7M69 69l7 7M76 24l-7 7M31 69l-7 7"/>' },
    sabana: { r: '<path d="M22 40q28-22 56 0z"/>',
              l: '<path d="M22 40q28-22 56 0z"/><path d="M50 40v40M42 48l8 8 8-8"/><path d="M14 82h72"/><circle cx="78" cy="24" r="5"/>' },
    volcan: { r: '<path d="M16 80 40 40h20l24 40z"/>',
              l: '<path d="M16 80 40 40h20l24 40z"/><circle cx="46" cy="26" r="5"/><circle cx="57" cy="18" r="4"/>' },
    isla: { r: '<path d="M20 72q30-14 60 0z"/>',
            l: '<path d="M20 72q30-14 60 0"/><path d="M50 66q-2-22 4-36"/><path d="M54 30q-16-8-26 4M54 30q14-10 24 2M54 30q-4-14-16-14"/><path d="M14 86q8-5 16 0t16 0 16 0 16 0"/>' }
  };

  var ORDEN = [
    "Es el 01 de su pack: el más ligero, el que abre la cata.",
    "Es el 02 de su pack: el del medio, ni ligero ni intenso.",
    "Es el 03 de su pack: el más intenso, el que cierra la cata."
  ];

  var $ = function (id) { return document.getElementById(id); };
  var vistas = ["intro", "preguntas", "resultado"];
  var paso = 0;
  var respuestas = [];
  var actual = null;

  function evento(nombre, datos) {
    if (typeof window.cribaEvento === "function") window.cribaEvento(nombre, datos);
  }
  function slug(t) {
    return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
  }
  function guardar(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  function mostrar(id) {
    vistas.forEach(function (v) { $(v).hidden = v !== id; });
    var main = document.querySelector(".test");
    if (main) main.scrollIntoView({ block: "start" });
  }

  function pintarPregunta() {
    var q = PREGUNTAS[paso];
    var segs = document.querySelectorAll(".progreso i");
    Array.prototype.forEach.call(segs, function (s, k) { s.classList.toggle("on", k <= paso); });
    $("meta").textContent = "Pregunta " + (paso + 1) + " de " + PREGUNTAS.length;
    $("pregunta").textContent = q.t;
    var opciones = $("opciones");
    opciones.innerHTML = "";
    q.o.forEach(function (o, k) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opcion";
      b.dataset.k = String(k);
      var letra = document.createElement("span");
      letra.className = "opcion__letra";
      letra.setAttribute("aria-hidden", "true");
      letra.textContent = String.fromCharCode(65 + k);
      var txt = document.createElement("span");
      txt.className = "opcion__txt";
      txt.textContent = o.l;
      if (o.d) {
        var d = document.createElement("span");
        d.className = "opcion__desc";
        d.textContent = o.d;
        txt.appendChild(d);
      }
      b.appendChild(letra);
      b.appendChild(txt);
      if (respuestas[paso] === o) b.classList.add("elegida");
      opciones.appendChild(b);
    });
    $("atras").hidden = paso === 0;
    $("pregunta").focus({ preventScroll: true });
  }

  function calcular() {
    var intensidad = respuestas.slice(0, 3).reduce(function (s, a) { return s + a.i; }, 0);
    var idx = intensidad <= 2 ? 0 : intensidad === 3 ? 1 : 2;
    var packKey = respuestas[3].p;
    var otroKey = respuestas[4].p;
    return { idx: idx, packKey: packKey, otroKey: otroKey };
  }

  function pintarResultado() {
    var r = calcular();
    var pack = PACKS[r.packKey];
    var cafe = pack.cafes[r.idx];
    var n = "0" + (r.idx + 1);
    var id = r.packKey + "-" + slug(cafe.nombre);
    actual = { cafe: cafe, pack: pack, packKey: r.packKey, id: id };

    var bolsa = $("bolsa");
    bolsa.className = "bolsa bolsa--" + (r.idx + 1);
    var ic = ICONOS[cafe.icono];
    var lista = pack.cafes.map(function (c, k) {
      var etiqueta = "0" + (k + 1) + " " + c.nombre;
      return k === r.idx ? "<strong>" + etiqueta + "</strong>" : "<span>" + etiqueta + "</span>";
    }).join(" · ");
    bolsa.innerHTML =
      '<div class="bolsa__cierre" aria-hidden="true"></div>' +
      '<div class="bolsa__cab">' +
        '<p class="mono">Nº ' + pack.n + " · Pack " + pack.nombre + " · Café " + n + "</p>" +
        '<p class="bolsa__nombre">' + cafe.nombre + "</p>" +
        '<p class="bolsa__tag">' + cafe.tag + "</p>" +
      "</div>" +
      '<div class="bolsa__icono"><svg viewBox="0 0 100 100" aria-hidden="true">' +
        '<g class="relleno" transform="translate(4 4)">' + ic.r + "</g>" +
        '<g class="linea">' + ic.l + "</g>" +
      "</svg></div>" +
      '<div class="bolsa__banda">' +
        '<p class="bolsa__num" aria-hidden="true">' + n + "</p>" +
        '<ul class="bolsa__datos"><li>' + cafe.origen + "</li><li>" + cafe.proceso + "</li><li>" + cafe.notas + "</li></ul>" +
      "</div>" +
      '<p class="bolsa__pack mono">En el pack: ' + lista + "</p>";

    var razon = pack.razon.charAt(0).toUpperCase() + pack.razon.slice(1);
    $("porque").textContent = ORDEN[r.idx] + " " +
      (r.packKey === r.otroKey ? "Y lo tienes clarísimo: " + pack.razon : razon) +
      ", así que tu pack es " + pack.nombre + ".";

    var alt = $("alternativa");
    if (r.packKey !== r.otroKey) {
      var otro = PACKS[r.otroKey];
      alt.textContent = "Por cómo pasas los sábados, el pack " + otro.nombre + " (" + otro.cafes.map(function (c) { return c.nombre; }).join(", ") + ") también te encajaría.";
      alt.hidden = false;
    } else {
      alt.hidden = true;
    }

    $("cta").href = "/?pack=" + r.packKey + "#lista";
    $("compartido").textContent = "";
    guardar("criba_test", id);
    evento("quiz_complete", { resultado: id, pack: r.packKey });
    mostrar("resultado");
    $("resultado-titulo").focus({ preventScroll: true });
  }

  $("empezar").addEventListener("click", function () {
    paso = 0;
    respuestas = [];
    evento("quiz_start", {});
    mostrar("preguntas");
    pintarPregunta();
  });

  $("opciones").addEventListener("click", function (ev) {
    var b = ev.target.closest(".opcion");
    if (!b || b.disabled) return;
    respuestas[paso] = PREGUNTAS[paso].o[Number(b.dataset.k)];
    Array.prototype.forEach.call($("opciones").children, function (x) {
      x.disabled = true;
      x.classList.toggle("elegida", x === b);
    });
    var rapido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () {
      if (paso < PREGUNTAS.length - 1) { paso++; pintarPregunta(); }
      else pintarResultado();
    }, rapido ? 0 : 220);
  });

  $("atras").addEventListener("click", function () {
    if (paso > 0) { paso--; pintarPregunta(); }
  });

  $("repetir").addEventListener("click", function () {
    paso = 0;
    respuestas = [];
    mostrar("intro");
    $("empezar").focus({ preventScroll: true });
  });

  $("compartir").addEventListener("click", function () {
    if (!actual) return;
    var url = "https://cribacoffee.es/t";
    var texto = "Me ha salido " + actual.cafe.nombre + ", " + actual.cafe.tag + " ¿Qué Criba eres tú?";
    var aviso = $("compartido");
    if (navigator.share) {
      navigator.share({ title: "¿Qué Criba eres?", text: texto, url: url }).then(function () {
        evento("share", { method: "web_share", content_type: "resultado_test", item_id: actual.id });
      }).catch(function () { /* cancelado */ });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto + " " + url).then(function () {
        aviso.textContent = "Copiado. Pégalo donde quieras.";
        evento("share", { method: "copiar", content_type: "resultado_test", item_id: actual.id });
      }).catch(function () { aviso.textContent = texto + " " + url; });
    } else {
      aviso.textContent = texto + " " + url;
    }
  });
})();
