# Criba · lista de espera

Landing de la lista de espera del Pack de Cata de **Criba** (proyecto académico de Xarxes Socials, TecnoCampus, 2026).
Dominio: **cribacoffee.es** · Alojamiento: Netlify (se publica sola con cada cambio en `main`).

## Qué hay
- `public/index.html`: la página de inicio. Formulario con Netlify Forms (`lista-espera`).
- `public/que-criba-eres/`: test «¿Qué Criba eres?» (`assets/js/test.js`). Cinco preguntas → uno de los nueve cafés. El botón final lleva al formulario con el pack marcado y el resultado viaja en el campo `resultado_test`.
- `public/privacidad/`: aviso de privacidad (RGPD). Contacto: MD de @cribacoffee.
- `public/gracias/`: confirmación si el navegador no ejecuta JavaScript.
- `public/descargas/ficha-de-cata-criba.pdf`: ficha de cata que se ofrece al apuntarse.
- `public/_redirects`: enlaces cortos con UTM (`/ig`, `/ig/<pieza>`, `/tt`, `/tt/<pieza>`) y del test (`/test`, `/ig/test`, `/t` para compartir).
- `public/assets/`: estilos, script, fuentes (Fraunces y DM Mono, licencia OFL), logotipos e imágenes.

## Datos de cada registro
`email`, `pack` (opcional), `consentimiento`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `referente` (web de la que llega la visita) y `resultado_test` (p. ej. `procesos-miel`, si hizo el test antes).
Los registros se ven en Netlify → Forms → `lista-espera` y se pueden exportar a CSV.
Revisad también la pestaña de spam: el filtro de Netlify a veces marca registros reales; se recuperan con «Mark as verified».
Se borran el 31/12/2026, como dice el aviso de privacidad.

## Google Analytics
Propiedad GA4 `G-BY35E4YVML`. Solo se carga si se acepta el aviso de cookies (`public/assets/js/consentimiento.js`).
Al apuntarse se envía el evento `generate_lead` con el pack elegido y el resultado del test. El test envía `quiz_start`, `quiz_complete` y `share`.

## Identidad
Colores, tipografía y reglas del Manual de marca de Criba (Grupo 1, 2026). Imágenes de producto generadas con IA.
