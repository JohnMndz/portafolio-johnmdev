<script lang="ts">
	import { PERFIL } from '$lib/data/perfil';
	import { EDUCACION } from '$lib/data/experiencia';
	import Seccion from '$lib/components/ui/Seccion.svelte';
	import TituloSeccion from '$lib/components/ui/TituloSeccion.svelte';
	import Tarjeta from '$lib/components/ui/Tarjeta.svelte';
	import Revelar from '$lib/components/ui/Revelar.svelte';

	const [primero, ...resto] = PERFIL.resumen;
</script>

<Seccion id="perfil">
	<Revelar>
		<TituloSeccion
			indice="01"
			etiqueta="Perfil"
			titulo="Pragmático, resolutivo y"
			destacado="obsesionado con automatizar."
		/>
	</Revelar>

	<div class="grid gap-5 md:grid-cols-[1.55fr_1fr]">
		<Revelar>
			<Tarjeta class="h-full sm:p-10">
				<p class="text-xl leading-relaxed tracking-tight text-pretty text-tinta sm:text-2xl">
					{primero}
				</p>
				<div class="mt-8 space-y-4 border-t border-borde pt-8">
					{#each resto as parrafo (parrafo)}
						<p class="text-base leading-relaxed text-pretty text-tinta-suave">{parrafo}</p>
					{/each}
				</div>
			</Tarjeta>
		</Revelar>

		<Revelar retraso={120}>
			<Tarjeta class="h-full sm:p-8">
				<dl class="divide-y divide-borde">
					{#each PERFIL.hechos as hecho (hecho.etiqueta)}
						<div class="flex flex-col gap-1 py-4 first:pt-0">
							<dt class="font-mono text-[11px] tracking-[0.14em] text-tinta-tenue uppercase">
								{hecho.etiqueta}
							</dt>
							<dd class="text-[15px] text-tinta">{hecho.valor}</dd>
						</div>
					{/each}
					<div class="flex flex-col gap-1 pt-4">
						<dt class="font-mono text-[11px] tracking-[0.14em] text-tinta-tenue uppercase">
							Educación
						</dt>
						<dd class="text-[15px] text-tinta">
							{EDUCACION.titulo}
							<span class="block text-sm text-tinta-suave">{EDUCACION.institucion}</span>
							<span
								class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-acento-400/10 px-2 py-0.5 font-mono text-[11px] text-acento-300"
							>
								{EDUCACION.detalle}
							</span>
						</dd>
					</div>
				</dl>
			</Tarjeta>
		</Revelar>
	</div>
</Seccion>
