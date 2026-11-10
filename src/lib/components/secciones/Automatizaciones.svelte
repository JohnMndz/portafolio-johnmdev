<script lang="ts">
	import { FLUJOS } from '$lib/data/flujos';
	import Seccion from '$lib/components/ui/Seccion.svelte';
	import TituloSeccion from '$lib/components/ui/TituloSeccion.svelte';
	import Etiqueta from '$lib/components/ui/Etiqueta.svelte';
	import Icono from '$lib/components/ui/Icono.svelte';
	import Marcador from '$lib/components/ui/Marcador.svelte';
	import Revelar from '$lib/components/ui/Revelar.svelte';
	import Visor from '$lib/components/ui/Visor.svelte';
	import CanvasFlujo from '$lib/components/flujo/CanvasFlujo.svelte';
	import { foco } from '$lib/acciones/interaccion';

	let abierto = $state<number | null>(null);

	// Bento sobre 6 columnas: ancha + estrecha, estrecha + ancha, y luego mitades.
	const SPANS = ['lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-4'];
	const span = (i: number) => SPANS[i] ?? 'lg:col-span-3';
	const ancho = (i: number) => i === 0 || i === 3;
</script>

<Seccion id="automatizaciones">
	<Revelar>
		<TituloSeccion
			indice="03"
			etiqueta="Automatizaciones"
			titulo="Procesos que"
			destacado="trabajan solos."
			bajada="Orquestaciones construidas en n8n y Google Workspace Studio que integran APIs, bases de datos, microservicios y modelos de lenguaje. Abre cualquiera para explorar el canvas completo."
		/>
	</Revelar>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
		{#each FLUJOS as flujo, i (flujo.id)}
			<Revelar retraso={(i % 2) * 110} class="h-full {span(i)}">
				<button
					type="button"
					use:foco
					onclick={() => (abierto = i)}
					aria-haspopup="dialog"
					class="foco brillo-superior group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-borde bg-superficie/70 text-left transition-[border-color,transform] duration-500 ease-salida hover:-translate-y-1 hover:border-borde-fuerte motion-reduce:transition-none motion-reduce:hover:translate-y-0"
				>
					<div
						class="relative overflow-hidden border-b border-borde {ancho(i)
							? 'aspect-video lg:aspect-[2/1]'
							: 'aspect-video'}"
					>
						<div
							class="miniatura-flujo h-full w-full transition-transform duration-700 ease-salida group-hover:scale-[1.04]"
						>
							{#if flujo.flujoJson}
								<CanvasFlujo
									flujoJson={flujo.flujoJson}
									titulo={flujo.titulo}
									interactivo={false}
								/>
							{:else}
								<Marcador titulo={flujo.titulo} />
							{/if}
						</div>

						<span
							class="pointer-events-none absolute inset-0 bg-gradient-to-t from-superficie/90 via-transparent to-transparent"
						></span>
						<span
							class="absolute top-4 left-4 rounded-full border border-borde bg-fondo/85 px-2.5 py-1 font-mono text-[10px] tracking-wider text-tinta-suave"
						>
							{String(i + 1).padStart(2, '0')} / {String(FLUJOS.length).padStart(2, '0')}
						</span>
						<span
							class="absolute top-4 right-4 inline-flex translate-y-1 items-center gap-1.5 rounded-full bg-acento-400 px-3 py-1.5 text-xs font-medium text-fondo opacity-0 shadow-lg transition-all duration-500 ease-salida group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
						>
							<Icono nombre="expandir" class="size-3.5" />
							Abrir canvas
						</span>
					</div>

					<div class="flex flex-1 flex-col p-6 sm:p-7">
						<h3 class="text-xl font-medium tracking-tight text-balance text-tinta">
							{flujo.titulo}
						</h3>
						<p class="mt-1.5 text-sm text-acento-300/90">{flujo.gancho}</p>
						<p
							class="mt-4 flex-1 text-sm leading-relaxed text-pretty text-tinta-suave {ancho(i)
								? 'line-clamp-3'
								: 'line-clamp-4'}"
						>
							{flujo.descripcion}
						</p>
						<div class="mt-6 flex items-end justify-between gap-4">
							<div class="flex flex-wrap gap-1.5">
								{#each flujo.tecnologias.slice(0, 4) as tec (tec)}
									<Etiqueta label={tec} />
								{/each}
								{#if flujo.tecnologias.length > 4}
									<Etiqueta label="+{flujo.tecnologias.length - 4}" tono="acento" />
								{/if}
							</div>
							<span
								class="grid size-9 shrink-0 place-items-center rounded-full border border-borde text-tinta-suave transition-all duration-500 ease-salida group-hover:-rotate-45 group-hover:border-acento-400 group-hover:bg-acento-400 group-hover:text-fondo"
							>
								<Icono nombre="flecha" class="size-4" />
							</span>
						</div>
					</div>
				</button>
			</Revelar>
		{/each}
	</div>
</Seccion>

<Visor
	flujos={FLUJOS}
	indice={abierto}
	alCerrar={() => (abierto = null)}
	alNavegar={(i) => (abierto = i)}
/>
