<script lang="ts">
	interface Props {
		indice: string;
		/** Rótulo corto sobre el titular (nombre de la sección). */
		etiqueta: string;
		titulo: string;
		/** Remate del titular, en serif cursiva y con degradado. */
		destacado?: string;
		bajada?: string;
		centrado?: boolean;
		class?: string;
	}

	let {
		indice,
		etiqueta,
		titulo,
		destacado,
		bajada,
		centrado = false,
		class: klass = ''
	}: Props = $props();
</script>

<header class="mb-14 sm:mb-16 {centrado ? 'text-center' : ''} {klass}">
	<p
		class="inline-flex items-center gap-2 rounded-full border border-borde bg-superficie/60 py-1 pr-3 pl-1 font-mono text-[11px] tracking-[0.14em] text-tinta-suave uppercase"
	>
		<span class="rounded-full bg-acento-400/12 px-2 py-0.5 text-acento-300">{indice}</span>
		{etiqueta}
	</p>
	<h2
		class="mt-6 max-w-3xl text-4xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-tinta sm:text-6xl {centrado
			? 'mx-auto'
			: ''}"
	>
		{titulo}
		{#if destacado}
			<span class="serif-acento texto-degradado pr-1">{destacado}</span>
		{/if}
	</h2>
	{#if bajada}
		<p
			class="mt-5 max-w-2xl text-base leading-relaxed text-pretty text-tinta-suave sm:text-lg {centrado
				? 'mx-auto'
				: ''}"
		>
			{bajada}
		</p>
	{/if}
</header>
