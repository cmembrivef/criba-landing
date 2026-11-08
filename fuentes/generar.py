"""Genera la ficha de cata en PDF, la imagen para compartir (og.png) y los iconos.
Uso: python3 fuentes/generar.py   (desde la raíz del repositorio)"""
from pathlib import Path
from playwright.sync_api import sync_playwright

raiz = Path(__file__).resolve().parent.parent
pub = raiz / "public"
simbolo = (pub / "assets/logo/criba-simbolo-reducido-perfil.svg").read_text()
# Símbolo reducido sin el círculo de fondo, para el icono cuadrado de iOS
simbolo_sin_fondo = simbolo.replace('<circle r="60" fill="#F5D4C8"/>', "")

with sync_playwright() as p:
    b = p.chromium.launch()
    # Ficha de cata (A4, vectorial)
    pg = b.new_page()
    pg.goto((raiz / "fuentes/ficha.html").as_uri())
    pg.wait_for_load_state("networkidle")
    pg.evaluate("document.fonts.ready")
    pg.pdf(path=str(pub / "descargas/ficha-de-cata-criba.pdf"), format="A4", print_background=True,
           margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
    # Vista previa de la ficha en PNG (solo para revisar)
    pg.set_viewport_size({"width": 794, "height": 1123})
    pg.screenshot(path="/tmp/claude-0/-home-claude/75c7ff61-7716-59e4-9ff2-998f820ffd94/scratchpad/ficha-preview.png")
    pg.close()
    # Imagen para compartir 1200 x 630
    pg = b.new_page(viewport={"width": 1200, "height": 630})
    pg.goto((raiz / "fuentes/og.html").as_uri())
    pg.wait_for_load_state("networkidle")
    pg.evaluate("document.fonts.ready")
    pg.screenshot(path=str(pub / "og.jpg"), type="jpeg", quality=86)
    pg.close()
    # Iconos
    for size, name, svg, bg in [
        (32, "favicon-32.png", simbolo, "transparent"),
        (180, "apple-touch-icon.png", simbolo_sin_fondo, "#F5D4C8"),
    ]:
        pg = b.new_page(viewport={"width": size, "height": size})
        pad = 0 if name.startswith("favicon") else round(size * 0.12)
        html = (f'<html><body style="margin:0;background:{bg};width:{size}px;height:{size}px;'
                f'display:grid;place-items:center">'
                f'<div style="width:{size-2*pad}px;height:{size-2*pad}px">'
                + svg.replace('width="512" height="512"', 'width="100%" height="100%"') + "</div></body></html>")
        pg.set_content(html)
        pg.screenshot(path=str(pub / name), omit_background=(bg == "transparent"))
        pg.close()
    b.close()
print("ok")
