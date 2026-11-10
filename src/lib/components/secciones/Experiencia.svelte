<script lang="ts">
	import { EXPERIENCIA } from '$lib/data/experiencia';
	import Seccion from '$lib/components/ui/Seccion.svelte';
	import TituloSeccion from '$lib/components/ui/TituloSeccion.svelte';
	import Tarjeta from '$lib/components/ui/Tarjeta.svelte';
	import Etiqueta from '$lib/components/ui/Etiqueta.svelte';
	import Revelar from '$lib/components/ui/Revelar.svelte';
</script>

<Seccion id="experiencia">
	<Revelar>
		<TituloSeccion
			indice="02"
			etiqueta="Experiencia"
			titulo="Software corporativo"
			destacado="en producción."
			bajada="Desarrollo de aplicaciones corporativas en producción, dentro de un equipo multidisciplinario."
		/>
	</Revelar>

	{#each EXPERIENCIA as puesto (puesto.empresa)}
		<div class="grid gap-10 lg:grid-cols-[0.9fr_2fr] lg:gap-14">
			<!-- Columna fija con el puesto mientras se recorren los proyectos -->
			<div>
				<Revelar class="lg:sticky lg:top-28">
					<span
						class="inline-flex items-center gap-2 rounded-full border border-acento-400/25 bg-acento-400/10 px-3 py-1 font-mono text-[11px] text-acento-300"
					>
						<span class="latido relative size-1.5 rounded-full bg-acento-400"></span>
						{puesto.periodo}
					</span>
					<h3 class="mt-5 text-3xl font-semibold tracking-tight text-tinta">{puesto.empresa}</h3>
					<p class="mt-1 text-tinta-suave">{puesto.cargo}</p>
					<p class="mt-5 text-[15px] leading-relaxed text-pretty text-tinta-suave">
						{puesto.descripcion}
					</p>
				</Revelar>
			</div>

			<ol class="space-y-4">
				{#each puesto.proyectos as proyecto, i (proyecto.nombre)}
					<li>
						<Revelar retraso={i * 100}>
							<Tarjeta interactiva class="group">
								<div class="flex items-start gap-5">
									<span
										class="font-mono text-sm text-tinta-tenue transition-colors duration-300 group-hover:text-acento-400"
									>
										{String(i + 1).padStart(2, '0')}
									</span>
									<div class="min-w-0 flex-1">
										<h4 class="text-lg font-medium tracking-tight text-tinta">
											{proyecto.nombre}
										</h4>
										<p class="mt-2 text-[15px] leading-relaxed text-pretty text-tinta-suave">
											{proyecto.descripcion}
										</p>
										<div class="mt-5 flex flex-wrap gap-1.5">
											{#each proyecto.tecnologias as tec (tec)}
												<Etiqueta label={tec} />
											{/each}
										</div>
									</div>
								</div>
							</Tarjeta>
						</Revelar>
					</li>
				{/each}
			</ol>
		</div>
	{/each}
</Seccion>
