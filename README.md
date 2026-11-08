# Criba · lista de espera

Landing de la lista de espera del Pack de Cata de **Criba** (proyecto académico de Xarxes Socials, TecnoCampus, 2026).
Dominio: **cribacoffee.es** · Alojamiento: Netlify (se publica sola con cada cambio en `main`).

## Qué hay
- `public/index.html`: la página. Formulario con Netlify Forms (`lista-espera`).
- `public/privacidad/`: aviso de privacidad (RGPD). Contacto: MD de @cribacoffee.
- `public/gracias/`: confirmación si el navegador no ejecuta JavaScript.
- `public/descargas/ficha-de-cata-criba.pdf`: ficha de cata que se ofrece al apuntarse.
- `public/_redirects`: enlaces cortos con UTM (`/ig`, `/ig/<pieza>`, `/tt`, `/tt/<pieza>`).
- `public/assets/`: estilos, script, fuentes (Fraunces y DM Mono, licencia OFL), logotipos e imágenes.

## Datos de cada registro
`email`, `pack` (opcional), `consentimiento`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `referente` (web de la que llega la visita).
Los registros se ven en Netlify → Forms → `lista-espera` y se pueden exportar a CSV.
Revisad también la pestaña de spam: el filtro de Netlify a veces marca registros reales; se recuperan con «Mark as verified».
Se borran el 31/12/2026, como dice el aviso de privacidad.

## Identidad
Colores, tipografía y reglas del Manual de marca de Criba (Grupo 1, 2026). Imágenes de producto generadas con IA.
