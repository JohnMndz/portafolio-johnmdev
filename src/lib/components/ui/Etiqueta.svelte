<script lang="ts">
	import type { Tono } from '$lib/tipos';

	interface Props {
		label: string;
		tono?: Tono;
		class?: string;
	}

	let { label, tono = 'neutral', class: klass = '' }: Props = $props();

	const ESTILOS: Record<Tono, string> = {
		neutral: 'border-white/[0.07] bg-white/[0.03] text-tinta-suave',
		acento: 'border-acento-400/25 bg-acento-400/10 text-acento-300'
	};
</script>

<span
	class="inline-flex items-center rounded-md border px-2 py-1 font-mono text-[11px] leading-none whitespace-nowrap {ESTILOS[
		tono
	]} {klass}"
>
	{label}
</span>
