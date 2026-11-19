/* Criba · test «¿Qué Criba eres?»
   El test es una criba: entran los nueve cafés y, pregunta a pregunta, unos pasan y otros se quedan.
   - Primera criba (preguntas 1–3: acidez, dulzor y cuerpo, los atributos de la ficha de cata):
     suma 0–2 → se quedan los 01, 3 → los 02, 4–6 → los 03 (37 % · 26 % · 37 %).
   - Segunda criba (preguntas 4–5: lo que te mueve): la 4 elige el pack; si la 5 no coincide,
     el café de ese otro pack «casi se queda».
   - La última criba la hace cada persona con su taza: tres cafés, tu propio criterio.
   El resultado se queda en este navegador. Solo viaja si la persona se apunta después
   (campo «resultado_test» del formulario). */
(function () {
  "use strict";

  var PACKS = {
    momentos: {
      n: "01", nombre: "Momentos", razon: "Lo que te mueve es cuándo y con quién te lo tomas",
      cafes: [
        { nombre: "Chispa", tag: "afrutado y vivo.", origen: "Etiopía · Guji", proceso: "Lavado", notas: "Limón · azahar · té negro", icono: "chispa" },
        { nombre: "Charla", tag: "dulce y redondo.", origen: "Colombia · Huila", proceso: "Lavado", notas: "Caramelo · manzana roja · panela", icono: "charla" },
        { nombre: "Sobremesa", tag: "chocolate con cuerpo.", origen: "Brasil · Cerrado Mineiro", proceso: "Natural", notas: "Cacao · avellana · galleta", icono: "sobremesa" }
      ]
    },
    procesos: {
      n: "02", nombre: "Procesos", razon: "Lo que te mueve es cómo se trabaja el café después de la cosecha",
      cafes: [
        { nombre: "Agua", tag: "limpio y brillante.", origen: "Costa Rica · Tarrazú", proceso: "Lavado", notas: "Lima · manzana verde · té blanco", icono: "agua" },
        { nombre: "Miel", tag: "meloso y suave.", origen: "Costa Rica · Tarrazú", proceso: "Honey", notas: "Melocotón · miel · caramelo", icono: "miel" },
        { nombre: "Sol", tag: "frutal e intenso.", origen: "Costa Rica · Tarrazú", proceso: "Natural", notas: "Fresa · vino tinto · chocolate", icono: "sol" }
      ]
    },
    origenes: {
      n: "03", nombre: "Orígenes", razon: "Lo que te mueve es de dónde viene cada grano",
      cafes: [
        { nombre: "Sabana", tag: "jugoso y vibrante.", origen: "Kenia · Nyeri", proceso: "Lavado", notas: "Grosella negra · pomelo · tomate dulce", icono: "sabana" },
        { nombre: "Volcán", tag: "equilibrado y profundo.", origen: "Guatemala · Acatenango", proceso: "Lavado", notas: "Chocolate con leche · ciruela · almendra", icono: "volcan" },
        { nombre: "Isla", tag: "especiado y con cuerpo.", origen: "Indonesia · Java", proceso: "Lavado", notas: "Especias · cacao amargo · cedro", icono: "isla" }
      ]
    }
  };
  var FILAS = ["momentos", "procesos", "origenes"];

  // a = atributo (etiqueta) · pista = lo que significa en la cata · i = intensidad · p = pack
  var PREGUNTAS = [
    { a: "Acidez", t: "Muerdes una fruta. ¿Cuál?",
      pista: "En el café, la acidez es la viveza en la lengua, como la de una fruta.",
      o: [
        { l: "Una mandarina ácida", i: 0 },
        { l: "Una manzana roja", i: 1 },
        { l: "Un plátano bien maduro", i: 2 } ] },
    { a: "Dulzor", t: "Elige postre.",
      pista: "El dulzor de un café recuerda al caramelo o a la fruta madura.",
      o: [
        { l: "Sorbete de limón", i: 0 },
        { l: "Tarta de manzana", i: 1 },
        { l: "Brownie templado", i: 2 } ] },
    { a: "Cuerpo", t: "¿Y para beber?",
      pista: "El cuerpo es lo que pesa en la boca: ligero o denso.",
      o: [
        { l: "Un té frío, ligerito", i: 0 },
        { l: "Un zumo de manzana", i: 1 },
        { l: "Un chocolate a la taza, espeso", i: 2 } ] },
    { a: "Lo que te mueve", t: "Te gusta un café. ¿Qué quieres saber?",
      pista: "Cada pack cambia una sola cosa para que notes la diferencia en la taza.",
      o: [
        { l: "Cuándo tomarlo", d: "el momento del día y con quién", p: "momentos" },
        { l: "Cómo lo han hecho", d: "lo que pasa después de la cosecha", p: "procesos" },
        { l: "De dónde viene", d: "el país y la tierra", p: "origenes" } ] },
    { a: "Lo que te mueve", t: "Un sábado libre, tú…",
      pista: "Sin pensarlo mucho.",
      o: [
        { l: "Quedas a comer y alargas la sobremesa", p: "momentos" },
        { l: "Te apuntas a un taller para ver cómo se hace algo", p: "procesos" },
        { l: "Coges un tren a un sitio donde no has estado", p: "origenes" } ] }
  ];

  var CRIBA1 = [
    "Te va lo vivo: fruta ácida, postre fresco y bebida ligera. En la criba se quedan los 01, los más ligeros de cada pack: Chispa, Agua y Sabana.",
    "Ni lo más ácido ni lo más denso: te quedas en el medio. En la criba se quedan los 02, dulces y redondos: Charla, Miel y Volcán.",
    "Te va lo denso y lo dulce: fruta madura, chocolate y bebida con cuerpo. En la criba se quedan los 03, los más intensos de cada pack: Sobremesa, Sol e Isla."
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

  var $ = function (id) { return document.getElementById(id); };
  var vistas = ["intro", "preguntas", "criba", "resultado"];
  var paso = 0;
  var respuestas = [];
  var actual = null;
  var tranquilo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function evento(nombre, datos) {
    if (typeof window.cribaEvento === "function") window.cribaEvento(nombre, datos);
  }
  function slug(t) {
    return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
  }
  function guardar(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  function despues(ms, fn) { window.setTimeout(fn, tranquilo ? 0 : ms); }

  function mostrar(id, foco) {
    vistas.forEach(function (v) { $(v).hidden = v !== id; });
    var main = document.querySelector(".test");
    if (main) main.scrollIntoView({ block: "start" });
    if (foco) $(foco).focus({ preventScroll: true });
  }

  function intensidad() {
    var s = respuestas.slice(0, 3).reduce(function (t, a) { return t + a.i; }, 0);
    return s <= 2 ? 0 : s === 3 ? 1 : 2;
  }

  // Cuadrícula de los nueve cafés: filas = packs, columnas = orden de cata
  function pintarNueve(cont) {
    cont.innerHTML = FILAS.map(function (pk) {
      var p = PACKS[pk];
      return '<div class="nueve__fila"><span class="nueve__pack mono">Nº ' + p.n + "</span>" +
        p.cafes.map(function (c, k) {
          return '<span class="nueve__c nueve__c--' + (k + 1) + '" data-pack="' + pk + '" data-k="' + k + '">' + c.nombre + "</span>";
        }).join("") + "</div>";
    }).join("");
    return Array.prototype.slice.call(cont.querySelectorAll(".nueve__c"));
  }
  function cribarColumnas(celdas, idx, animar) {
    celdas.forEach(function (c) {
      var pasa = Number(c.dataset.k) !== idx;
      if (!animar) c.classList.add("sin-anim");
      c.classList.toggle("pasa", pasa);
      c.classList.toggle("queda", !pasa);
    });
  }

  function pintarPregunta() {
    var q = PREGUNTAS[paso];
    var segs = document.querySelectorAll(".progreso i");
    Array.prototype.forEach.call(segs, function (s, k) { s.classList.toggle("on", k <= paso); });
    $("meta").textContent = "Pregunta " + (paso + 1) + " de " + PREGUNTAS.length + " · " + q.a;
    $("pregunta").textContent = q.t;
    $("pista").textContent = q.pista;
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

  function pintarCriba() {
    var idx = intensidad();
    var celdas = pintarNueve($("criba-nueve"));
    $("criba-texto").textContent = CRIBA1[idx];
    mostrar("criba", "criba-titulo");
    despues(350, function () { cribarColumnas(celdas, idx, true); });
  }

  function pintarResultado() {
    var idx = intensidad();
    var packKey = respuestas[3].p;
    var otroKey = respuestas[4].p;
    var pack = PACKS[packKey];
    var cafe = pack.cafes[idx];
    var n = "0" + (idx + 1);
    var id = packKey + "-" + slug(cafe.nombre);
    actual = { cafe: cafe, pack: pack, id: id };

    // Segunda criba: de los tres que quedaban, se queda uno
    var celdas = pintarNueve($("final-nueve"));
    cribarColumnas(celdas, idx, false);
    despues(450, function () {
      celdas.forEach(function (c) {
        if (Number(c.dataset.k) !== idx) return;
        var esta = c.dataset.pack === packKey;
        c.classList.remove("sin-anim");
        c.classList.toggle("pasa", !esta);
        c.classList.toggle("elegido", esta);
        c.classList.toggle("casi", !esta && c.dataset.pack === otroKey && otroKey !== packKey);
      });
    });

    var bolsa = $("bolsa");
    bolsa.className = "bolsa bolsa--" + (idx + 1);
    var ic = ICONOS[cafe.icono];
    var lista = pack.cafes.map(function (c, k) {
      var etiqueta = "0" + (k + 1) + " " + c.nombre;
      return k === idx ? "<strong>" + etiqueta + "</strong>" : "<span>" + etiqueta + "</span>";
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

    var razon = packKey === otroKey
      ? "Lo tienes claro: " + pack.razon.charAt(0).toLowerCase() + pack.razon.slice(1)
      : pack.razon;
    $("porque").textContent = razon + ", así que de los tres que quedaban se queda el del pack " +
      pack.nombre + ": " + cafe.nombre + ", " + cafe.tag;

    var alt = $("alternativa");
    if (packKey !== otroKey) {
      var otro = PACKS[otroKey];
      alt.textContent = "Casi se queda " + otro.cafes[idx].nombre + ", del pack " + otro.nombre + ", por cómo pasas los sábados.";
      alt.hidden = false;
    } else {
      alt.hidden = true;
    }

    $("criterio").textContent = "El test hace la primera criba. La última la haces tú: cata los tres cafés de " +
      pack.nombre + " en orden, puntúalos sin mirar y quédate con el tuyo. Si al final eliges otro, mejor: el criterio es tuyo.";

    $("cta").href = "/?pack=" + packKey + "#lista";
    $("compartido").textContent = "";
    guardar("criba_test", id);
    evento("quiz_complete", { resultado: id, pack: packKey });
    mostrar("resultado", "resultado-titulo");
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
    despues(220, function () {
      if (paso === 2) { pintarCriba(); return; }
      if (paso < PREGUNTAS.length - 1) { paso++; pintarPregunta(); }
      else pintarResultado();
    });
  });

  $("atras").addEventListener("click", function () {
    if (paso > 0) { paso--; pintarPregunta(); }
  });

  $("seguir").addEventListener("click", function () {
    paso = 3;
    mostrar("preguntas");
    pintarPregunta();
  });

  $("criba-atras").addEventListener("click", function () {
    paso = 2;
    mostrar("preguntas");
    pintarPregunta();
  });

  $("repetir").addEventListener("click", function () {
    paso = 0;
    respuestas = [];
    mostrar("intro", "empezar");
  });

  $("compartir").addEventListener("click", function () {
    if (!actual) return;
    var url = "https://cribacoffee.es/t";
    var texto = "En mi criba se ha quedado " + actual.cafe.nombre + ", " + actual.cafe.tag + " ¿Qué Criba eres tú?";
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
