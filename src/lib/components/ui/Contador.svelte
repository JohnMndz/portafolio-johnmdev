<script lang="ts">
	interface Props {
		valor: number;
		/** Duración de la cuenta en ms. */
		duracion?: number;
		sufijo?: string;
	}

	let { valor, duracion = 1600, sufijo = '' }: Props = $props();

	// Arranca en el valor final: sin JS (o en SSR) se ve el número correcto.
	// svelte-ignore state_referenced_locally
	let mostrado = $state(valor);
	let nodo = $state<HTMLSpanElement | null>(null);

	$effect(() => {
		if (!nodo) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (typeof IntersectionObserver === 'undefined') return;

		const final = valor;
		mostrado = 0;
		let fotograma = 0;

		const observador = new IntersectionObserver(([e]) => {
			if (!e.isIntersecting) return;
			observador.disconnect();
			const inicio = performance.now();
			const paso = (t: number) => {
				const p = Math.min((t - inicio) / duracion, 1);
				// easeOutExpo: arranca rápido y se asienta despacio sobre el valor.
				const suave = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
				mostrado = Math.round(final * suave);
				if (p < 1) fotograma = requestAnimationFrame(paso);
			};
			fotograma = requestAnimationFrame(paso);
		});
		observador.observe(nodo);

		return () => {
			observador.disconnect();
			if (fotograma) cancelAnimationFrame(fotograma);
			mostrado = final;
		};
	});
</script>

<span bind:this={nodo} class="tabular-nums">{mostrado}{sufijo}</span>
