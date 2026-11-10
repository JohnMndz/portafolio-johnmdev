<script lang="ts">
	import { INFRAESTRUCTURA } from '$lib/data/infraestructura';
	import Seccion from '$lib/components/ui/Seccion.svelte';
	import TituloSeccion from '$lib/components/ui/TituloSeccion.svelte';
	import Tarjeta from '$lib/components/ui/Tarjeta.svelte';
	import Icono from '$lib/components/ui/Icono.svelte';
	import Revelar from '$lib/components/ui/Revelar.svelte';
</script>

<Seccion id="infraestructura">
	<Revelar>
		<TituloSeccion
			indice="04"
			etiqueta="Infraestructura"
			titulo="Mi propio"
			destacado="servidor."
			bajada="Todo lo anterior corre sobre un servidor que administro yo: despliegues, dominios, respaldos y servicios auto-hospedados."
		/>
	</Revelar>

	<div class="grid gap-4 sm:grid-cols-2">
		{#each INFRAESTRUCTURA as servicio, i (servicio.nombre)}
			<Revelar retraso={(i % 2) * 110} class="h-full">
				<Tarjeta interactiva class="group flex h-full flex-col sm:p-8">
					<div class="flex items-center justify-between">
						<span
							class="relative grid size-12 place-items-center rounded-2xl border border-borde-fuerte bg-elevado text-acento-400 transition-all duration-500 ease-salida group-hover:border-acento-400/40 group-hover:shadow-[0_0_32px_-6px_var(--color-acento-500)]"
						>
							<Icono nombre={servicio.icono} class="size-5" />
						</span>
						<span
							class="inline-flex items-center gap-1.5 rounded-full border border-borde px-2.5 py-1 font-mono text-[10px] tracking-wider text-tinta-tenue uppercase"
						>
							<span class="latido relative size-1.5 rounded-full bg-acento-400"></span>
							self-hosted
						</span>
					</div>
					<h3 class="mt-8 text-xl font-medium tracking-tight text-tinta">{servicio.nombre}</h3>
					<p class="mt-2 text-[15px] leading-relaxed text-pretty text-tinta-suave">
						{servicio.descripcion}
					</p>
				</Tarjeta>
			</Revelar>
		{/each}
	</div>
</Seccion>
