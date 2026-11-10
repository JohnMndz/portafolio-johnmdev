<script lang="ts">
	let barra: HTMLDivElement | undefined;

	// Donde existen las animaciones ligadas al scroll la barra es CSS puro; si no, un
	// listener pasivo que escribe un único `transform` por fotograma.
	$effect(() => {
		if (!barra) return;
		if (CSS.supports?.('animation-timeline: scroll(root block)')) return;

		const nodo = barra;
		let fotograma = 0;
		function pintar() {
			fotograma = 0;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			const p = max > 0 ? window.scrollY / max : 0;
			nodo.style.transform = `scaleX(${Math.min(Math.max(p, 0), 1)})`;
		}
		function alDesplazar() {
			if (!fotograma) fotograma = requestAnimationFrame(pintar);
		}
		window.addEventListener('scroll', alDesplazar, { passive: true });
		pintar();
		return () => {
			window.removeEventListener('scroll', alDesplazar);
			if (fotograma) cancelAnimationFrame(fotograma);
		};
	});
</script>

<div class="barra" bind:this={barra} aria-hidden="true"></div>

<style>
	.barra {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 60;
		height: 2px;
		transform-origin: 0 50%;
		transform: scaleX(0);
		background: linear-gradient(90deg, var(--color-acento-400), var(--color-cian-400));
		box-shadow: 0 0 12px color-mix(in oklab, var(--color-acento-400) 60%, transparent);
		pointer-events: none;
	}

	@supports (animation-timeline: scroll()) {
		.barra {
			animation: progreso linear both;
			animation-timeline: scroll(root block);
		}
	}

	@keyframes progreso {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
</style>
