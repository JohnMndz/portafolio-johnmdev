<script lang="ts">
	/*
	 * Animación de fondo ligada al scroll (estilo Apple): el progreso de la página elige
	 * el fotograma y un suavizado exponencial le da inercia. Es un render propio de
	 * Three.js (ver scripts/secuencia/) en dos cortes: 16:9 y vertical.
	 *
	 * Va como vídeo y no como secuencia de imágenes: con cientos de fotogramas (los que
	 * hacen falta para que el scroll no avance a saltos) las imágenes o bien ocupan
	 * gigas de memoria decodificadas, o bien hay que decodificar decenas por segundo en
	 * CPU. El vídeo lo decodifica la GPU, ocupa poca memoria y pesa menos. Está
	 * codificado con un fotograma clave cada 4 para que saltar a cualquier punto sea
	 * inmediato.
	 */
	const SECUENCIAS = {
		// `total` es solo el valor inicial: al cargar se toma de la duración real del vídeo.
		escritorio: { video: '/secuencia/escritorio.mp4', total: 480 },
		movil: { video: '/secuencia/movil.mp4', total: 288 }
	} as const;
	type Modo = keyof typeof SECUENCIAS;

	/** Fotogramas por segundo con los que se codificó el vídeo (ver scripts/secuencia/README.md). */
	const FPS = 30;
	/**
	 * Constante de tiempo del suavizado, en ms: más alto, más inercia. Con la rueda del
	 * ratón cada muesca salta ~100px de golpe; esta inercia reparte ese salto en el tiempo.
	 */
	const SUAVIZADO_MS = 300;
	/**
	 * Velocidad mínima mientras se mueve, en fracción del recorrido por segundo. Un
	 * suavizado exponencial puro se arrastra al final: los últimos fotogramas quedan
	 * 100–300 ms cada uno y un scroll corto se ve a saltos. Con este piso el tramo final
	 * avanza a ritmo constante y termina enseguida.
	 */
	const VELOCIDAD_MINIMA = 0.04;
	/**
	 * Si el decodificador no confirma una búsqueda (`seeked`) en este tiempo, se da por
	 * perdida y se pide la siguiente: sin esto una búsqueda atascada congelaba el fondo.
	 */
	const BUSQUEDA_MAX_MS = 400;

	/*
	 * Dos <video> apilados: `red` arranca al instante en streaming nativo (el MP4 lleva
	 * `faststart`, con unos cientos de KB ya hay fotogramas) mientras el vídeo completo
	 * se descarga en segundo plano. Cuando está en memoria, `memoria` toma el relevo en
	 * el mismo fotograma y `red` se descarta: así no se espera a bajar varios MB para
	 * animar, y después cada salto del scroll se resuelve sin tocar la red.
	 */
	let videoRed: HTMLVideoElement | undefined;
	let videoMemoria: HTMLVideoElement | undefined;
	let velo: HTMLDivElement | undefined;
	let visible = $state<'red' | 'memoria' | null>(null);
	let modo = $state<Modo>(
		typeof window !== 'undefined' && window.matchMedia('(max-aspect-ratio: 1/1)').matches
			? 'movil'
			: 'escritorio'
	);

	// La orientación decide el corte; al girar el móvil se carga el vídeo adecuado.
	$effect(() => {
		const consulta = window.matchMedia('(max-aspect-ratio: 1/1)');
		const aplicar = () => (modo = consulta.matches ? 'movil' : 'escritorio');
		aplicar();
		consulta.addEventListener('change', aplicar);
		return () => consulta.removeEventListener('change', aplicar);
	});

	$effect(() => {
		if (!videoRed || !videoMemoria) return;
		const capa = velo;
		const red = videoRed;
		const memoria = videoMemoria;
		/** El vídeo que se está mostrando y al que se le piden los fotogramas. */
		let nodo = red;
		const { video: url } = SECUENCIAS[modo];
		// Se corrige con la duración real al cargar: si no coincide con lo codificado,
		// se piden tiempos más allá del final y el fondo se queda en el último cuadro.
		let total: number = SECUENCIAS[modo].total;
		const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const ahorro =
			(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
			true;
		const animado = !reducido && !ahorro;

		// Medidas cacheadas: leer `scrollHeight` en cada evento de scroll fuerza un
		// recálculo de layout si algo cambió (revelados, contadores…) y traba el scroll.
		let alto = window.innerHeight;
		let maximo = 0;
		function medir() {
			alto = window.innerHeight;
			maximo = Math.max(document.documentElement.scrollHeight - alto, 0);
		}
		medir();
		const observador = new ResizeObserver(medir);
		observador.observe(document.body);
		window.addEventListener('resize', medir, { passive: true });

		let velado = -1;
		// Donde existen las animaciones ligadas al scroll el velo es CSS puro (ver estilos).
		const veloCss = CSS.supports?.('animation-timeline: scroll(root block)') === true;
		function atenuar() {
			// El velo oscurece el fondo en cuanto se sale de la portada: el render es
			// protagonista arriba y acompaña sin competir con el contenido después.
			if (veloCss) return;
			const p = Math.min(window.scrollY / alto, 1);
			const valor = Math.round((0.05 + p * 0.33) * 200) / 200;
			if (valor !== velado) {
				velado = valor;
				capa?.style.setProperty('opacity', String(valor));
			}
		}

		let vivo = true;
		let objetivo = 0;
		let actual = 0;
		let mostrado = -1;
		let pendiente = -1;
		let inicioBusqueda = 0;
		let fotograma = 0;
		let ultimoTiempo = 0;
		let urlLocal = '';

		const progreso = () => (maximo > 0 ? Math.min(Math.max(window.scrollY / maximo, 0), 1) : 0);

		/** Mitad del fotograma: así el tiempo cae dentro de él y no en el borde. */
		const tiempo = (i: number) => (i + 0.5) / FPS;

		/**
		 * Pide el fotograma `i`. Mientras el vídeo busca no se encadenan búsquedas (se
		 * atascaría); se guarda la última pedida y se aplica al terminar la actual.
		 */
		function mostrar(i: number) {
			if (nodo.readyState < 1) return;
			if (nodo.seeking && performance.now() - inicioBusqueda < BUSQUEDA_MAX_MS) {
				pendiente = i;
				return;
			}
			pendiente = -1;
			mostrado = i;
			inicioBusqueda = performance.now();
			nodo.currentTime = tiempo(i);
		}

		function alBuscar() {
			if (!visible) alCargar();
			if (pendiente >= 0 && pendiente !== mostrado) mostrar(pendiente);
		}

		function animar(t: number) {
			fotograma = 0;
			atenuar();
			// Sin vídeo todavía (o si falló la descarga) no hay bucle: lo arranca `alCargar`.
			if (!animado || nodo.readyState < 1) {
				ultimoTiempo = 0;
				return;
			}

			const dt = ultimoTiempo ? Math.min(t - ultimoTiempo, 64) : 16;
			ultimoTiempo = t;
			const resto = objetivo - actual;
			const paso = Math.max(
				Math.abs(resto) * (1 - Math.exp(-dt / SUAVIZADO_MS)),
				(VELOCIDAD_MINIMA * total * dt) / 1000
			);
			const llego = paso >= Math.abs(resto);
			actual = llego ? objetivo : actual + Math.sign(resto) * paso;

			const i = Math.min(Math.max(Math.round(actual), 0), total - 1);

			if (i !== mostrado && i !== pendiente) mostrar(i);
			// Una búsqueda pendiente que se quedó sin `seeked` se reintenta desde aquí.
			else if (pendiente >= 0) mostrar(pendiente);

			// En reposo el bucle se detiene: el movimiento sin scroll es la deriva CSS
			// (ver estilos), que no pide fotogramas al vídeo.
			if (llego && pendiente < 0) {
				ultimoTiempo = 0;
				return;
			}
			fotograma = requestAnimationFrame(animar);
		}

		/** El evento solo apunta el objetivo; todo el trabajo va en un único rAF. */
		function alDesplazar() {
			objetivo = progreso() * (total - 1);
			if (!fotograma) fotograma = requestAnimationFrame(animar);
		}

		function alMetadatos() {
			const real = Math.floor(nodo.duration * FPS);
			if (Number.isFinite(real) && real > 0) total = real;
			objetivo = actual = progreso() * (total - 1);
			// Fuerza la decodificación del primer fotograma aunque `play()` haya sido
			// bloqueado por las políticas de ahorro/autoplay de Chrome móvil.
			if (!visible) mostrar(Math.round(objetivo));
		}

		function alCargar() {
			if (!visible) visible = 'red';
			// Arranca el bucle en cuanto hay fotogramas.
			if (!fotograma) fotograma = requestAnimationFrame(animar);
		}

		atenuar();
		window.addEventListener('scroll', alDesplazar, { passive: true });
		const abortador = new AbortController();

		function escuchar(v: HTMLVideoElement) {
			v.addEventListener('seeked', alBuscar);
			v.addEventListener('loadedmetadata', alMetadatos);
			v.addEventListener('loadeddata', alCargar);
		}

		function soltar(v: HTMLVideoElement) {
			v.removeEventListener('seeked', alBuscar);
			v.removeEventListener('loadedmetadata', alMetadatos);
			v.removeEventListener('loadeddata', alCargar);
		}

		function activarFuente(v: HTMLVideoElement, fuente: string) {
			v.muted = true;
			v.src = fuente;
			v.load();
			// Safari en iOS no pinta los fotogramas de un vídeo que nunca se
			// reprodujo: arrancarlo y pararlo (está silenciado, se permite) lo
			// desbloquea.
			v.play()
				.then(() => v.pause())
				.catch(() => {});
		}

		/**
		 * Relevo al vídeo en memoria: se le pide el fotograma que se ve ahora y, cuando
		 * lo tiene pintado, pasa a ser el visible y el de streaming se descarga.
		 */
		function relevar(fuente: string) {
			let preparado = false;
			const alListo = () => {
				if (!vivo || memoria.readyState < 1) return;
				if (!preparado) {
					preparado = true;
					const i = mostrado >= 0 ? mostrado : Math.round(actual);
					memoria.currentTime = tiempo(i);
					mostrado = i;
					return;
				}
				// Primer `seeked`: ya tiene el fotograma, toma el relevo.
				memoria.removeEventListener('loadedmetadata', alListo);
				memoria.removeEventListener('seeked', alListo);
				soltar(red);
				nodo = memoria;
				pendiente = -1;
				escuchar(memoria);
				visible = 'memoria';
				red.removeAttribute('src');
				red.load();
				alCargar();
			};
			memoria.addEventListener('loadedmetadata', alListo);
			memoria.addEventListener('seeked', alListo);
			memoria.preload = 'auto';
			activarFuente(memoria, fuente);
		}

		function descargar(reintentos = 1) {
			fetch(url, { signal: abortador.signal })
				.then((r) => (r.ok ? r.blob() : Promise.reject()))
				.then((blob) => {
					if (!vivo) return;
					if (blob.size === 0) return Promise.reject();
					urlLocal = URL.createObjectURL(blob);
					relevar(urlLocal);
				})
				.catch(() => {
					if (!vivo || abortador.signal.aborted) return;
					// Si falla (corte de red momentáneo) se reintenta; si no, se queda el
					// streaming, que ya está funcionando.
					if (reintentos > 0) setTimeout(() => descargar(reintentos - 1), 1200);
				});
		}

		// Sin movimiento o en ahorro de datos: se queda la imagen fija del CSS.
		if (animado) {
			// Arranca donde está la página (recarga a media página) sin animar desde 0.
			objetivo = actual = progreso() * (total - 1);
			escuchar(red);
			// Solo metadatos: lo justo para pintar ya, sin competir por ancho de banda con
			// la descarga completa; los saltos del scroll piden por rangos lo que falte.
			red.preload = 'metadata';
			activarFuente(red, url);
			descargar();
		}

		return () => {
			vivo = false;
			visible = null;
			abortador.abort();
			observador.disconnect();
			window.removeEventListener('resize', medir);
			window.removeEventListener('scroll', alDesplazar);
			if (fotograma) cancelAnimationFrame(fotograma);
			if (!animado) return;
			for (const v of [red, memoria]) {
				soltar(v);
				v.removeAttribute('src');
				v.load();
			}
			if (urlLocal) URL.revokeObjectURL(urlLocal);
		};
	});
</script>

<div class="secuencia" aria-hidden="true">
	<video
		bind:this={videoRed}
		class:visible={visible === 'red'}
		muted
		playsinline
		preload="none"
		disablepictureinpicture
	></video>
	<video
		bind:this={videoMemoria}
		class:visible={visible === 'memoria'}
		muted
		playsinline
		preload="none"
		disablepictureinpicture
	></video>
	<div class="velo" bind:this={velo}></div>
</div>

<style>
	/* El primer fotograma como fondo CSS: se ve antes de hidratar, sin JavaScript y
	   mientras se descarga el vídeo. */
	.secuencia {
		position: absolute;
		inset: 0;
		background: var(--color-fondo) url('/secuencia/escritorio.webp') center / cover no-repeat;
	}

	@media (max-aspect-ratio: 1/1) {
		.secuencia {
			background-image: url('/secuencia/movil.webp');
		}
	}

	video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		/* Oculto hasta tener el primer fotograma: evita un destello negro sobre la imagen. */
		opacity: 0;
		pointer-events: none;
	}

	video.visible {
		opacity: 1;
	}

	/* Deriva en reposo: un acercamiento y desplazamiento muy lentos para que el fondo
	   no parezca una imagen fija. Va en `transform` (compositor), así que es fluida a
	   cualquier velocidad; mover fotogramas del vídeo tan despacio se veía a saltos.
	   Con movimiento reducido la anula la regla global de `layout.css`. */
	@media (prefers-reduced-motion: no-preference) {
		video {
			animation: deriva 18s ease-in-out infinite alternate;
		}
	}

	@keyframes deriva {
		from {
			transform: scale(1.03) translate3d(0, 0, 0);
		}
		to {
			transform: scale(1.08) translate3d(-1.2%, -0.8%, 0);
		}
	}

	/* Legibilidad: lateral oscuro donde va el texto de la portada y velo general
	   cuya opacidad crece con el scroll (la ajusta el script). */
	.secuencia::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgb(6 7 9 / 0.6) 0%, rgb(6 7 9 / 0.15) 40%, transparent 65%),
			linear-gradient(180deg, transparent 65%, rgb(6 7 9 / 0.45) 100%);
	}

	@media (max-aspect-ratio: 1/1) {
		.secuencia::after {
			background: linear-gradient(180deg, rgb(6 7 9 / 0.7) 0%, rgb(6 7 9 / 0.2) 55%, transparent);
		}
	}

	.velo {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: var(--color-fondo);
		opacity: 0.05;
		/* Capa propia: cambiar su opacidad al hacer scroll solo recompone, no repinta. */
		will-change: opacity;
	}

	/* Mismo recorrido que `atenuar()` (0.05 → 0.38 en la primera pantalla de scroll),
	   pero lo resuelve el compositor sin JavaScript. */
	@supports (animation-timeline: scroll()) {
		.velo {
			animation: velar linear both;
			animation-timeline: scroll(root block);
			animation-range: 0 100vh;
		}
	}

	@keyframes velar {
		from {
			opacity: 0.05;
		}
		to {
			opacity: 0.38;
		}
	}
</style>
