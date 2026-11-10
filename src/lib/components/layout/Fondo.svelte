<script lang="ts">
	import FondoSecuencia from './FondoSecuencia.svelte';

	let luz: HTMLDivElement | undefined;

	// Luz que sigue al cursor por toda la página. Se mueve con `transform` sobre una
	// sola capa, con suavizado exponencial para que arrastre un poco de inercia.
	$effect(() => {
		if (!luz) return;
		const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!fino || reducido) return;

		let objetivoX = window.innerWidth / 2;
		let objetivoY = window.innerHeight / 3;
		let x = objetivoX;
		let y = objetivoY;
		let fotograma = 0;

		const nodo = luz;
		nodo.style.opacity = '1';

		function animar() {
			x += (objetivoX - x) * 0.12;
			y += (objetivoY - y) * 0.12;
			nodo.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
			if (Math.abs(objetivoX - x) + Math.abs(objetivoY - y) > 0.5) {
				fotograma = requestAnimationFrame(animar);
			} else {
				fotograma = 0;
			}
		}

		function alMover(e: PointerEvent) {
			objetivoX = e.clientX;
			objetivoY = e.clientY;
			if (!fotograma) fotograma = requestAnimationFrame(animar);
		}

		window.addEventListener('pointermove', alMover, { passive: true });
		animar();
		return () => {
			window.removeEventListener('pointermove', alMover);
			if (fotograma) cancelAnimationFrame(fotograma);
		};
	});
</script>

<div class="fondo" aria-hidden="true">
	<FondoSecuencia />
	<div class="aurora">
		<span class="mancha mancha-1"></span>
		<span class="mancha mancha-2"></span>
		<span class="mancha mancha-3"></span>
	</div>
	<div class="lineas"></div>
	<div class="luz" bind:this={luz}></div>
	<div class="ruido"></div>
</div>

<style>
	.fondo {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
		background: var(--color-fondo);
		contain: strict;
	}

	/* Manchas de color muy difusas: el "aurora". */
	.aurora {
		position: absolute;
		inset: -20%;
		/* Sin `filter: blur()`: desenfocar una capa a pantalla completa cuyas manchas se
		   mueven obliga a recalcular el blur en cada cuadro y le roba tiempo a la secuencia
		   del scroll. Los degradados radiales ya terminan en transparente y dan la misma
		   suavidad a coste casi nulo. */
	}

	/* Manchas fijas: animadas (deriva de ~30 s) costaban ~8 fps al hacer scroll por
	   recomponer tres capas enormes sobre el vídeo, y detrás de él apenas se notaba. */
	.mancha {
		position: absolute;
		border-radius: 9999px;
		/* Tenue: el protagonista es el render; la aurora solo funde sus bordes. */
		opacity: 0.22;
	}

	.mancha-1 {
		top: 0%;
		left: 8%;
		width: 42vmax;
		height: 42vmax;
		background: radial-gradient(
			circle,
			color-mix(in oklab, var(--color-acento-500) 38%, transparent),
			transparent 72%
		);
	}

	.mancha-2 {
		top: 10%;
		right: 0%;
		width: 38vmax;
		height: 38vmax;
		background: radial-gradient(
			circle,
			color-mix(in oklab, var(--color-cian-400) 26%, transparent),
			transparent 72%
		);
	}

	.mancha-3 {
		bottom: -5%;
		left: 35%;
		width: 46vmax;
		height: 46vmax;
		background: radial-gradient(
			circle,
			color-mix(in oklab, var(--color-violeta-400) 18%, transparent),
			transparent 72%
		);
	}


	/* Retícula de líneas finas que se desvanece hacia los bordes. */
	.lineas {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to right, rgb(255 255 255 / 0.035) 1px, transparent 1px),
			linear-gradient(to bottom, rgb(255 255 255 / 0.035) 1px, transparent 1px);
		background-size: 72px 72px;
		mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 100%);
		/* Capa propia: la máscara se calcula una vez y no al cambiar lo que hay debajo. */
		transform: translateZ(0);
	}

	.luz {
		position: absolute;
		top: 0;
		left: 0;
		width: 640px;
		height: 640px;
		border-radius: 9999px;
		background: radial-gradient(
			circle,
			color-mix(in oklab, var(--color-acento-400) 9%, transparent),
			transparent 60%
		);
		opacity: 0;
		transition: opacity 1s ease;
		will-change: transform;
	}

	.ruido {
		position: absolute;
		inset: 0;
		/* Mezcla normal, no `mix-blend-mode: overlay`: un modo de fusión a pantalla
		   completa sobre el vídeo del scroll obliga a recomponer
		   todo el fondo en cada cuadro (era lo que más bajaba los fps al hacer scroll). */
		opacity: 0.035;
		transform: translateZ(0);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
	}

</style>
