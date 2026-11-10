<script lang="ts">
	import { ENLACES } from '$lib/data/enlaces';
	import { PERFIL } from '$lib/data/perfil';
	import Seccion from '$lib/components/ui/Seccion.svelte';
	import Boton from '$lib/components/ui/Boton.svelte';
	import Icono from '$lib/components/ui/Icono.svelte';
	import Revelar from '$lib/components/ui/Revelar.svelte';
	import { foco } from '$lib/acciones/interaccion';

	let copiado = $state(false);
	let temporizador: ReturnType<typeof setTimeout> | undefined;

	async function copiarCorreo() {
		try {
			await navigator.clipboard.writeText(PERFIL.correo);
			copiado = true;
			clearTimeout(temporizador);
			temporizador = setTimeout(() => (copiado = false), 2200);
		} catch {
			// Sin permiso de portapapeles: el enlace mailto sigue disponible al lado.
			window.location.href = `mailto:${PERFIL.correo}`;
		}
	}

	$effect(() => () => clearTimeout(temporizador));

	const SOCIALES = ENLACES.filter((e) => e.icono !== 'correo');
</script>

<Seccion id="contacto">
	<Revelar>
		<div
			use:foco
			class="foco brillo-superior relative overflow-hidden rounded-[2rem] border border-borde bg-superficie/70 px-6 py-16 text-center sm:px-12 sm:py-24"
		>
			<!-- Halo de color detrás del titular -->
			<div aria-hidden="true" class="halo pointer-events-none absolute inset-0 -z-10"></div>
			<div
				aria-hidden="true"
				class="reticula pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)] opacity-40"
			></div>

			<p
				class="mx-auto inline-flex items-center gap-2 rounded-full border border-borde bg-fondo/60 py-1 pr-3 pl-1 font-mono text-[11px] tracking-[0.14em] text-tinta-suave uppercase"
			>
				<span class="rounded-full bg-acento-400/12 px-2 py-0.5 text-acento-300">06</span>
				Contacto
			</p>

			<h2
				class="mx-auto mt-8 max-w-3xl text-5xl leading-[0.95] font-semibold tracking-[-0.045em] text-balance text-tinta sm:text-7xl"
			>
				¿Tienes un proyecto?
				<span class="serif-acento texto-degradado block pr-2">Hablemos.</span>
			</h2>

			<p
				class="mx-auto mt-6 max-w-lg text-base leading-relaxed text-balance text-tinta-suave sm:text-lg"
			>
				Estoy abierto a oportunidades de desarrollo frontend y automatización. Escríbeme por el
				medio que prefieras.
			</p>

			<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
				<Boton href="mailto:{PERFIL.correo}" variante="solido" icono="flecha">
					Enviar un correo
				</Boton>
				<button
					type="button"
					onclick={copiarCorreo}
					class="vidrio group inline-flex items-center gap-2.5 rounded-full border border-borde-fuerte px-5 py-3 font-mono text-[13px] text-tinta-suave transition-colors hover:border-tinta-tenue hover:text-tinta"
				>
					<span class="relative grid size-4 place-items-center">
						<svg
							viewBox="0 0 24 24"
							class="absolute size-4 transition-all duration-300 {copiado
								? 'scale-50 opacity-0'
								: 'scale-100 opacity-100'}"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
							<path
								d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"
							/>
						</svg>
						<svg
							viewBox="0 0 24 24"
							class="absolute size-4 text-acento-400 transition-all duration-300 {copiado
								? 'scale-100 opacity-100'
								: 'scale-50 opacity-0'}"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M5 12.5 10 17l9-10" />
						</svg>
					</span>
					<span>{PERFIL.correo}</span>
					<span class="sr-only" aria-live="polite">{copiado ? 'Correo copiado' : ''}</span>
				</button>
			</div>

			<ul class="mt-12 flex flex-wrap items-center justify-center gap-2">
				{#each SOCIALES as enlace (enlace.etiqueta)}
					<li>
						<a
							href={enlace.href}
							target={enlace.externo ? '_blank' : undefined}
							rel={enlace.externo ? 'noreferrer noopener' : undefined}
							class="group inline-flex items-center gap-2.5 rounded-full border border-borde bg-fondo/40 py-2 pr-4 pl-2 text-sm text-tinta-suave transition-all duration-300 hover:-translate-y-0.5 hover:border-acento-400/40 hover:text-tinta"
						>
							<span
								class="grid size-7 place-items-center rounded-full bg-white/[0.05] transition-colors group-hover:bg-acento-400 group-hover:text-fondo"
							>
								<Icono nombre={enlace.icono} class="size-3.5" />
							</span>
							<span>{enlace.etiqueta}</span>
							<span class="font-mono text-xs text-tinta-tenue">{enlace.valor}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</Revelar>
</Seccion>

<style>
	.halo {
		background:
			radial-gradient(
				60% 50% at 50% 0%,
				color-mix(in oklab, var(--color-acento-400) 16%, transparent),
				transparent 70%
			),
			radial-gradient(
				40% 40% at 85% 100%,
				color-mix(in oklab, var(--color-cian-400) 12%, transparent),
				transparent 70%
			);
	}
</style>
