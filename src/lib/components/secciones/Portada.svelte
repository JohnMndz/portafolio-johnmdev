<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { PERFIL } from '$lib/data/perfil';
	import { FLUJOS } from '$lib/data/flujos';
	import { INFRAESTRUCTURA } from '$lib/data/infraestructura';
	import { EXPERIENCIA } from '$lib/data/experiencia';
	import Boton from '$lib/components/ui/Boton.svelte';
	import Icono from '$lib/components/ui/Icono.svelte';
	import Contador from '$lib/components/ui/Contador.svelte';
	import DiagramaPortada from './DiagramaPortada.svelte';

	const ROTATIVAS = ['interfaces web', 'flujos con n8n', 'agentes de IA', 'infraestructura propia'];
	let indice = $state(0);

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const id = setInterval(() => (indice = (indice + 1) % ROTATIVAS.length), 2600);
		return () => clearInterval(id);
	});

	const CIFRAS = [
		{ valor: FLUJOS.length, sufijo: '', etiqueta: 'flujos de n8n publicados' },
		{ valor: INFRAESTRUCTURA.length, sufijo: '', etiqueta: 'servicios auto-hospedados' },
		{
			valor: EXPERIENCIA.reduce((n, p) => n + p.proyectos.length, 0),
			sufijo: '',
			etiqueta: 'sistemas corporativos en producción'
		}
	];
</script>

<section id="portada" class="relative flex min-h-svh items-center overflow-hidden pt-28 pb-16">
	<div
		class="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-10"
	>
		<div>
			<p
				class="entrar inline-flex items-center gap-2.5 rounded-full border border-borde bg-superficie/80 py-1.5 pr-4 pl-2 text-[13px] text-tinta-suave"
				style="--d: 0ms"
			>
				<span class="relative flex size-2">
					<span class="latido relative size-2 rounded-full bg-acento-400"></span>
				</span>
				Abierto a nuevas oportunidades
			</p>

			<h1
				class="mt-7 text-[clamp(3.2rem,9vw,6.4rem)] leading-[0.92] font-semibold tracking-[-0.055em]"
			>
				<span class="entrar tinta-degradada block pb-1" style="--d: 120ms">John</span>
				<span class="entrar block pb-3" style="--d: 220ms">
					<span class="tinta-degradada">Mendoza</span><span class="text-acento-400">.</span>
				</span>
			</h1>

			<p
				class="entrar mt-6 max-w-xl text-xl leading-snug tracking-tight text-tinta-suave sm:text-2xl"
				style="--d: 360ms"
			>
				Desarrollo
				<span class="relative inline-grid align-baseline">
					{#key indice}
						<span
							class="serif-acento texto-degradado col-start-1 row-start-1 pr-1 text-[1.15em] whitespace-nowrap"
							in:fly={{ y: 18, duration: 600, easing: cubicOut, opacity: 0 }}
							out:fly={{ y: -18, duration: 400, easing: cubicOut, opacity: 0 }}
						>
							{ROTATIVAS[indice]}
						</span>
					{/key}
				</span>
				<br class="hidden sm:block" />
				y orquesto procesos que corren solos.
			</p>

			<div class="entrar mt-10 flex flex-wrap items-center gap-3" style="--d: 480ms">
				<Boton href="#automatizaciones" variante="solido" icono="flecha">Ver automatizaciones</Boton
				>
				<Boton href="#contacto" variante="contorno">Hablemos</Boton>
			</div>

			<dl class="entrar mt-14 grid max-w-lg grid-cols-3 gap-6" style="--d: 620ms">
				{#each CIFRAS as cifra (cifra.etiqueta)}
					<div class="flex flex-col-reverse justify-end border-l border-borde-fuerte pl-4">
						<dt class="mt-1 text-xs leading-snug text-tinta-tenue">{cifra.etiqueta}</dt>
						<dd class="text-3xl font-semibold tracking-tight text-tinta">
							<Contador valor={cifra.valor} sufijo={cifra.sufijo} />
						</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="entrar relative" style="--d: 300ms">
			<DiagramaPortada />
			<p
				class="mt-5 flex items-center justify-center gap-2 font-mono text-xs text-tinta-tenue lg:justify-end"
			>
				<Icono nombre="ubicacion" class="size-3.5" />
				{PERFIL.ubicacion}
			</p>
		</div>
	</div>

	<!-- Indicador de scroll -->
	<a
		href="#perfil"
		aria-label="Bajar al perfil"
		class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
	>
		<span class="flex h-10 w-6 justify-center rounded-full border border-borde-fuerte pt-2">
			<span class="rueda h-2 w-0.5 rounded-full bg-tinta-suave"></span>
		</span>
	</a>
</section>

<style>
	.rueda {
		animation: rueda 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
	}

	@keyframes rueda {
		0% {
			transform: translateY(0);
			opacity: 1;
		}
		70% {
			transform: translateY(12px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 0;
		}
	}
</style>
