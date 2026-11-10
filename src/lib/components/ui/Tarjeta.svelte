<script lang="ts">
	import type { Snippet } from 'svelte';
	import { foco } from '$lib/acciones/interaccion';

	interface Props {
		children: Snippet;
		interactiva?: boolean;
		padded?: boolean;
		class?: string;
	}

	let { children, interactiva = false, padded = true, class: klass = '' }: Props = $props();

	const BASE =
		'foco brillo-superior overflow-hidden rounded-3xl border border-borde bg-superficie/70';
	const HOVER =
		'transition-[border-color,background-color,transform] duration-500 ease-salida hover:-translate-y-1 hover:border-borde-fuerte hover:bg-elevado/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0';
</script>

<div use:foco class="{BASE} {interactiva ? HOVER : ''} {padded ? 'p-6 sm:p-7' : ''} {klass}">
	{@render children()}
</div>
