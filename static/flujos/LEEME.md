# Export de los flujos de n8n

Coloca aquí el JSON exportado de cada workflow y descomenta la línea `flujoJson`
correspondiente en `src/lib/data/flujos.ts`. Los nombres esperados son:

- `rpa-bancario.json`
- `asistente-telegram.json`
- `bot-devops-pr.json`
- `ocr-gemini.json`

Recomendaciones:

- Exporta el workflow completo desde n8n (selecciona todo → copiar, o "Download").
- **Antes de subir el archivo**, revisa cada nodo y elimina cualquier credencial,
  cookie, token o header sensible (por ejemplo un `httpRequest` con `Authorization`
  o `Cookie` pegados a mano). El visor solo necesita `nodes` (name, type, position)
  y `connections` — todo lo demás es opcional.

Mientras un archivo no exista, el visor dibuja un marcador con la retícula del canvas;
el sitio nunca muestra un canvas roto. El canvas interactivo se renderiza con
[Svelte Flow](https://svelteflow.dev) (ver `src/lib/n8n/mapearFlujo.ts` y
`src/lib/components/flujo/`).
