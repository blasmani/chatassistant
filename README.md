# ChatAssistant — sitio web

Página pública de **ChatAssistant** (en Google Play: “ChatAssistant: Business”), de Web Business Tools (blasmani).
Se publica con GitHub Pages en **https://blasmani.github.io/chatassistant/**, sin dominio propio (no hay `CNAME`).

| Página | Dirección |
| --- | --- |
| Inicio | https://blasmani.github.io/chatassistant/ |
| Política de privacidad (la que va en Google Play) | https://blasmani.github.io/chatassistant/privacy.html |
| Términos del servicio | https://blasmani.github.io/chatassistant/terms.html |

Inglés por defecto, con el conmutador **EN | ES** arriba y abajo. `?lang=es` abre directamente en español
(por ejemplo `privacy.html?lang=es`) y la elección se recuerda en el navegador.

## Cómo publicarlo

1. Crea el repositorio público `chatassistant` en la cuenta `blasmani`.
2. Sube el contenido de esta carpeta a la rama `main` (en la raíz del repositorio).
3. En el repositorio: **Settings › Pages › Build and deployment › Deploy from a branch** → `main` / `(root)`.
4. Copia el icono de la app (`docs/store/icon-512.png` del proyecto) a `assets/icon.png` antes de subir.

## Cómo está hecho

- HTML y CSS estáticos, sin compilación. Único JavaScript: `assets/lang.js` (el conmutador de idioma).
- Cada texto lleva sus dos versiones en el mismo elemento (`data-en` / `data-es`), igual que el sitio de
  AutoTrade P2P. Nunca pongas un `<svg>` DENTRO de un elemento con `data-en`: el conmutador lo borraría.
- Sin cookies, analítica ni rastreadores. Solo las fuentes vienen de Google Fonts.
- `404.html` usa `<base href="/chatassistant/">` para que sus enlaces funcionen desde cualquier ruta inexistente.
- `.nojekyll` desactiva Jekyll para que GitHub Pages sirva los archivos tal cual.

## Mantener los textos legales iguales en la app y en la web

`privacy.html` y `terms.html` se generan desde la misma fuente que los textos que muestra la app
(`app/src/main/assets/legal/*.md` y `docs/PRIVACY_POLICY.md`, `docs/TERMS.md`). Si cambias uno, cambia los otros
el mismo día y actualiza la fecha de “Última actualización”.
