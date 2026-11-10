<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		/** Retraso en ms para escalonar elementos dentro de una misma grilla. */
		retraso?: number;
		class?: string;
	}

	let { children, retraso = 0, class: klass = '' }: Props = $props();

	let nodo = $state<HTMLDivElement | null>(null);
	// Arranca oculto solo visualmente y solo si hay JS: la clase `.revelar-oculto`
	// depende de `.js` en <html>, así que sin JavaScript nunca se oculta nada.
	let visible = $state(false);

	$effect(() => {
		if (!nodo) return;

		const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducido || typeof IntersectionObserver === 'undefined') {
			visible = true;
			return;
		}

		const observador = new IntersectionObserver(
			([entrada]) => {
				if (entrada.isIntersecting) {
					visible = true;
					observador.disconnect();
				}
			},
			// Margen inferior fijo, no porcentual: en pantallas muy altas un `%` puede
			// dejar al último elemento de la página en una zona que nunca intersecta.
			{ rootMargin: '0px 0px -48px 0px', threshold: 0 }
		);

		observador.observe(nodo);
		return () => observador.disconnect();
	});
</script>

<div
	bind:this={nodo}
	class="revelar {visible ? '' : 'revelar-oculto'} {klass}"
	style="transition-delay: {visible ? retraso : 0}ms"
>
	{@render children()}
</div>
