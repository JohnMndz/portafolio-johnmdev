<script lang="ts">
	import { PERFIL } from '$lib/data/perfil';
	import { ENLACES } from '$lib/data/enlaces';
	import Icono from '$lib/components/ui/Icono.svelte';

	const anio = new Date().getFullYear();
</script>

<footer class="relative overflow-hidden border-t border-borde/70">
	<div class="mx-auto w-full max-w-6xl px-6 pt-14 pb-8">
		<div class="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
			<div>
				<p class="text-sm text-tinta-suave">
					Diseñado y construido por {PERFIL.nombre}.
				</p>
				<p class="mt-1 font-mono text-xs text-tinta-tenue">
					SvelteKit · Tailwind · desplegado en VPS propio
				</p>
			</div>

			<div class="flex items-center gap-2">
				{#each ENLACES as enlace (enlace.etiqueta)}
					<a
						href={enlace.href}
						target={enlace.externo ? '_blank' : undefined}
						rel={enlace.externo ? 'noreferrer noopener' : undefined}
						aria-label={enlace.etiqueta}
						class="grid size-10 place-items-center rounded-full border border-borde text-tinta-suave transition-all duration-300 hover:-translate-y-0.5 hover:border-acento-600 hover:text-acento-300"
					>
						<Icono nombre={enlace.icono} class="size-4" />
					</a>
				{/each}
				<a
					href="#portada"
					aria-label="Volver arriba"
					class="ml-2 grid size-10 place-items-center rounded-full bg-tinta text-fondo transition-all duration-300 hover:-translate-y-0.5 hover:bg-acento-300"
				>
					<Icono nombre="flecha" class="size-4 -rotate-90" />
				</a>
			</div>
		</div>

		<!-- Firma gigante recortada contra el borde inferior. -->
		<p
			aria-hidden="true"
			class="pointer-events-none mt-12 -mb-[0.22em] text-center text-[19vw] leading-none font-semibold tracking-[-0.06em] select-none lg:text-[13.5rem]"
		>
			<span class="firma">johnmdev</span>
		</p>

		<p class="relative mt-6 font-mono text-[11px] text-tinta-tenue">
			© {anio}
			{PERFIL.nombre} — {PERFIL.ubicacion}
		</p>
	</div>
</footer>

<style>
	.firma {
		background-image: linear-gradient(
			180deg,
			color-mix(in oklab, var(--color-tinta) 14%, transparent) 0%,
			transparent 85%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
</style>
