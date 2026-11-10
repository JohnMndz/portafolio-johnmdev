<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icono from './Icono.svelte';
	import type { NombreIcono } from '$lib/tipos';
	import { magnetico } from '$lib/acciones/interaccion';

	type Variante = 'solido' | 'contorno' | 'fantasma';

	interface Props {
		href: string;
		children: Snippet;
		variante?: Variante;
		icono?: NombreIcono;
		externo?: boolean;
		class?: string;
	}

	let {
		href,
		children,
		variante = 'contorno',
		icono,
		externo = false,
		class: klass = ''
	}: Props = $props();

	const ESTILOS: Record<Variante, string> = {
		solido:
			'bg-acento-400 text-fondo border-transparent shadow-[0_0_0_1px_rgb(255_255_255/0.15)_inset,0_8px_30px_-8px_var(--color-acento-500)] hover:bg-acento-300',
		contorno:
			'vidrio border-borde-fuerte text-tinta hover:border-tinta-tenue hover:bg-white/[0.04]',
		fantasma: 'border-transparent text-tinta-suave hover:text-tinta'
	};
</script>

<a
	{href}
	target={externo ? '_blank' : undefined}
	rel={externo ? 'noreferrer noopener' : undefined}
	use:magnetico
	class="boton group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm font-medium transition-colors duration-300 motion-reduce:transition-none {ESTILOS[
		variante
	]} {klass}"
>
	{#if variante === 'solido'}
		<span aria-hidden="true" class="destello"></span>
	{/if}
	<span class="relative">{@render children()}</span>
	{#if icono}
		<span class="relative grid size-4 place-items-center overflow-hidden">
			<Icono
				nombre={icono}
				class="size-4 transition-transform duration-500 ease-salida group-hover:translate-x-5"
			/>
			<Icono
				nombre={icono}
				class="absolute size-4 -translate-x-5 transition-transform duration-500 ease-salida group-hover:translate-x-0"
			/>
		</span>
	{/if}
</a>

<style>
	/* Barrido de luz diagonal al pasar el cursor por el botón sólido. */
	.destello {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			110deg,
			transparent 30%,
			rgb(255 255 255 / 0.55) 50%,
			transparent 70%
		);
		transform: translateX(-120%);
		pointer-events: none;
	}

	.boton:hover .destello {
		transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
		transform: translateX(120%);
	}
</style>
