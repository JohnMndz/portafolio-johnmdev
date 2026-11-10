# Secuencia de fondo (render propio)

Vídeo de `static/secuencia/` que `FondoSecuencia.svelte` recorre según el scroll.
Se generan con Three.js en Chrome headless; las dependencias **no** están en el
`package.json` del sitio a propósito (pesan y no hacen falta para el build).

```sh
# En una carpeta temporal fuera del repo:
npm i three@0.170.0 playwright-core@1.49.1 ffmpeg-static@5.2.0
cp <repo>/scripts/secuencia/{escena.html,render.mjs} .

# 1) PNG por fotograma al DOBLE del tamaño final (supermuestreo):
#    <salida> <cantidad> <ancho> <escritorio|movil>
node render.mjs ./png-d 480 3200 escritorio
node render.mjs ./png-m 288 1620 movil

# 2) Reducción con Lanczos y vídeo H.264 a 30 fps con un fotograma clave cada 4
#    (-g 4): saltar a cualquier punto decodifica como mucho 4 fotogramas.
FF=node_modules/ffmpeg-static/ffmpeg
X264="-c:v libx264 -profile:v high -preset slow -crf 23 -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 -movflags +faststart -an"
$FF -y -framerate 30 -i png-d/f%04d.png -vf "scale=1600:900:flags=lanczos,format=yuv420p" $X264 <repo>/static/secuencia/escritorio.mp4
$FF -y -framerate 30 -i png-m/f%04d.png -vf "scale=810:1440:flags=lanczos,format=yuv420p" $X264 <repo>/static/secuencia/movil.mp4

# 3) Primer fotograma como imagen fija (se ve antes de que cargue el vídeo)
$FF -y -i png-d/f0000.png -vf "scale=1600:900:flags=lanczos" -c:v libwebp -quality 64 <repo>/static/secuencia/escritorio.webp
$FF -y -i png-m/f0000.png -vf "scale=810:1440:flags=lanczos" -c:v libwebp -quality 64 <repo>/static/secuencia/movil.webp
```

## Calidad de bordes

El resplandor (`UnrealBloomPass`) obliga a renderizar a través de `EffectComposer`, que
ignora el `antialias: true` del renderer: sin más, los anillos finos salen con dientes
de sierra. Por eso la escena usa un destino con MSAA (`samples: 4`) **y** se renderiza
al doble para reducir después con Lanczos. No quites ninguna de las dos cosas.

## Por qué vídeo y no imágenes

Con cientos de fotogramas (los necesarios para que el scroll no avance a saltos), una
secuencia de WebP o bien ocupa gigas decodificada en memoria (~5,8 MB por fotograma de
1600×900) o bien obliga a decodificar decenas de imágenes por segundo en CPU. El vídeo
lo decodifica la GPU y pesa menos (480 fotogramas ≈ 5 MB).

## Notas

- `render.mjs` usa la GPU vía ANGLE/D3D11 (Windows) y el Chrome de
  `C:/Program Files/Google/Chrome/...`; cambia `executablePath` si está en otra ruta.
  Sin GPU, `--use-angle=swiftshader --enable-unsafe-swiftshader` funciona, mucho más lento.
- Si cambias los fps, actualiza `FPS` en `FondoSecuencia.svelte` (la cantidad de
  fotogramas se lee de la duración del vídeo; `total` en `SECUENCIAS` es solo el inicial).
- nginx cachea `/secuencia/` 30 días: al regenerar en producción, renombra los archivos
  (y las rutas en `FondoSecuencia.svelte`) para que los visitantes no vean la versión vieja.
- La escena (formas, materiales, luces y recorrido de cámara) está en `escena.html`:
  `CLAVES` define la cámara a lo largo del scroll (0 = portada, 1 = pie).
