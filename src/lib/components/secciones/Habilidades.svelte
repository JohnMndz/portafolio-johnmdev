<script lang="ts">
	import { HABILIDADES } from '$lib/data/habilidades';
	import TituloSeccion from '$lib/components/ui/TituloSeccion.svelte';
	import Tarjeta from '$lib/components/ui/Tarjeta.svelte';
	import Revelar from '$lib/components/ui/Revelar.svelte';
	import IconoTec from '$lib/components/ui/IconoTec.svelte';

	const TODAS = HABILIDADES.flatMap((g) => g.items);
	const mitad = Math.ceil(TODAS.length / 2);
	const FILAS = [
		{ items: TODAS.slice(0, mitad), inversa: false, duracion: '45s' },
		{ items: TODAS.slice(mitad), inversa: true, duracion: '50s' }
	];
</script>

<!-- Sin <Seccion>: las marquesinas van a sangre, fuera del contenedor centrado. -->
<section id="habilidades" class="relative scroll-mt-24 py-24 sm:py-32">
	<div class="mx-auto w-full max-w-6xl px-6">
		<Revelar>
			<TituloSeccion
				indice="05"
				etiqueta="Stack"
				titulo="Herramientas con las que"
				destacado="construyo."
			/>
		</Revelar>
	</div>

	<!-- Decorativas: la lista accesible es la grilla de abajo. -->
	<div class="space-y-3" aria-hidden="true">
		{#each FILAS as fila, f (f)}
			<div class="marquesina overflow-hidden py-1">
				<div
					class="marquesina-pista {fila.inversa ? 'inversa' : ''}"
					style="--duracion: {fila.duracion}"
				>
					{#each [0, 1] as copia (copia)}
						<div class="flex shrink-0 gap-3 {copia === 1 ? 'copia' : ''}">
							{#each fila.items as item (item)}
								<span
									class="vidrio flex items-center gap-3 rounded-2xl border border-borde px-5 py-3 text-lg font-medium tracking-tight whitespace-nowrap text-tinta-suave sm:text-xl"
								>
									<IconoTec nombre={item} class="size-5 sm:size-6" />
									{item}
								</span>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<div class="mx-auto mt-14 w-full max-w-6xl px-6">
		<div class="grid gap-4 md:grid-cols-3">
			{#each HABILIDADES as grupo, i (grupo.titulo)}
				<Revelar retraso={i * 100} class="h-full">
					<Tarjeta class="h-full">
						<div class="flex items-center justify-between">
							<h3 class="text-base font-medium tracking-tight text-tinta">{grupo.titulo}</h3>
							<span class="font-mono text-xs text-tinta-tenue">
								{String(grupo.items.length).padStart(2, '0')}
							</span>
						</div>
						<ul class="mt-5 flex flex-wrap gap-1.5">
							{#each grupo.items as item (item)}
								<li
									class="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[13px] text-tinta-suave transition-colors duration-200 hover:border-acento-400/40 hover:text-tinta"
								>
									<IconoTec nombre={item} class="size-3.5" />
									{item}
								</li>
							{/each}
						</ul>
					</Tarjeta>
				</Revelar>
			{/each}
		</div>
	</div>
</section>
