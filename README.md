# Portafolio — John Mendoza

Landing page de una sola vista, oscura y estática. SvelteKit 2 + Svelte 5 (runes) +
TypeScript + Tailwind v4, prerenderizada con `adapter-static` y servida con nginx.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # svelte-check
npm run lint       # prettier --check
npm run format     # prettier --write
npm run build      # genera build/
npm run preview
```

## Estructura

El contenido está separado de la presentación: para actualizar el CV se editan solo
archivos de `src/lib/data/`, nunca los componentes.

```
src/lib/data/          contenido tipado (perfil, experiencia, flujos, stack, enlaces)
src/lib/tipos.ts       tipos compartidos
src/lib/components/ui/         primitivos reutilizables (Seccion, Tarjeta, Visor, ...)
src/lib/components/layout/     Navegacion, PieDePagina
src/lib/components/secciones/  una por bloque de la página
src/routes/layout.css  tokens del tema (@theme) y utilidades propias
```

La configuración de SvelteKit vive inline en `vite.config.ts`; **no hay `svelte.config.js`**.

## Capturas de los flujos de n8n

Ver [static/flujos/LEEME.md](static/flujos/LEEME.md). Mientras falte una captura, la
tarjeta muestra un marcador con la retícula del canvas en vez de una imagen rota.

## Pendientes antes de publicar

- `src/lib/data/enlaces.ts`: reemplazar `URL_GITHUB`, `URL_LINKEDIN` y `SITIO_URL` por los
  reales (están marcados con `TODO`).
- `static/og.png`: imagen de 1200×630 para las tarjetas de redes sociales.

## Despliegue (Dokploy)

Aplicación de tipo Docker apuntando a este repositorio; el `Dockerfile` construye el sitio
y lo sirve con nginx en el puerto 80.

```bash
docker build -t portafolio .
docker run --rm -p 8080:80 portafolio
```
