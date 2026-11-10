<script lang="ts">
	import { SECCIONES } from '$lib/data/navegacion';
	import { PERFIL } from '$lib/data/perfil';
	import Icono from '$lib/components/ui/Icono.svelte';

	let desplazado = $state(false);
	let abierto = $state(false);
	let activa = $state<string>('');

	let lista = $state<HTMLUListElement | null>(null);
	let indicador = $state({ x: 0, ancho: 0, visible: false });

	// La píldora se compacta y gana vidrio tras salir de la portada.
	$effect(() => {
		const alScroll = () => (desplazado = window.scrollY > 40);
		alScroll();
		window.addEventListener('scroll', alScroll, { passive: true });
		return () => window.removeEventListener('scroll', alScroll);
	});

	// Scroll-spy: un único observador sobre todas las secciones.
	$effect(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const nodos = SECCIONES.map(({ id }) => document.getElementById(id)).filter(
			(n): n is HTMLElement => n !== null
		);
		if (nodos.length === 0) return;

		const visibles = new Map<string, number>();
		const observador = new IntersectionObserver(
			(entradas) => {
				for (const e of entradas) {
					visibles.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
				}
				let mejor = '';
				let ratio = 0;
				for (const [id, r] of visibles) {
					if (r > ratio) {
						ratio = r;
						mejor = id;
					}
				}
				activa = mejor;
			},
			{ rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
		);

		nodos.forEach((n) => observador.observe(n));
		return () => observador.disconnect();
	});

	// Indicador deslizante bajo el enlace activo.
	$effect(() => {
		const id = activa;
		if (!lista) return;

		function medir() {
			const enlace = lista?.querySelector<HTMLAnchorElement>(`a[data-id="${id}"]`);
			// Sin leer `indicador`: leerlo aquí haría que el efecto dependa de lo que escribe.
			if (!enlace) {
				indicador = { x: 0, ancho: 0, visible: false };
				return;
			}
			indicador = { x: enlace.offsetLeft, ancho: enlace.offsetWidth, visible: true };
		}

		medir();
		window.addEventListener('resize', medir);
		return () => window.removeEventListener('resize', medir);
	});

	// Con el menú móvil abierto el documento no debe desplazarse por debajo.
	$effect(() => {
		if (!abierto) return;
		const previo = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		const alTecla = (e: KeyboardEvent) => e.key === 'Escape' && (abierto = false);
		window.addEventListener('keydown', alTecla);
		return () => {
			document.body.style.overflow = previo;
			window.removeEventListener('keydown', alTecla);
		};
	});
</script>

<header class="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:pt-5">
	<nav
		aria-label="Navegación principal"
		class="mx-auto flex w-full items-center justify-between gap-4 rounded-full border px-2 py-2 transition-all duration-500 ease-salida motion-reduce:transition-none {desplazado ||
		abierto
			? 'vidrio-desenfoque brillo-superior max-w-4xl border-borde'
			: 'max-w-6xl border-transparent'}"
	>
		<a
			href="#portada"
			class="group flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1"
			aria-label="{PERFIL.nombre}, ir al inicio"
		>
			<span
				class="grid size-8 place-items-center rounded-full bg-acento-400 font-mono text-[11px] font-bold text-fondo transition-transform duration-500 ease-salida group-hover:rotate-[360deg]"
			>
				JM
			</span>
			<span class="hidden text-sm font-medium tracking-tight whitespace-nowrap text-tinta sm:block">
				John Mendoza
			</span>
		</a>

		<ul bind:this={lista} class="relative hidden items-center lg:flex">
			<span
				aria-hidden="true"
				class="absolute inset-y-0 rounded-full bg-white/[0.07] transition-all duration-500 ease-salida motion-reduce:transition-none"
				style="left: {indicador.x}px; width: {indicador.ancho}px; opacity: {indicador.visible
					? 1
					: 0}"
			></span>
			{#each SECCIONES as item (item.id)}
				<li>
					<a
						href="#{item.id}"
						data-id={item.id}
						aria-current={activa === item.id ? 'true' : undefined}
						class="block rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-200 motion-reduce:transition-none {activa ===
						item.id
							? 'text-tinta'
							: 'text-tinta-suave hover:text-tinta'}"
					>
						{item.etiqueta}
					</a>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-2">
			<a
				href="#contacto"
				class="hidden items-center gap-2 rounded-full bg-tinta px-4 py-2 text-[13px] font-medium text-fondo transition-colors duration-200 hover:bg-acento-300 sm:inline-flex"
			>
				<span class="relative flex size-1.5">
					<span class="latido relative size-1.5 rounded-full bg-acento-600"></span>
				</span>
				Contactar
			</a>

			<button
				type="button"
				onclick={() => (abierto = !abierto)}
				aria-expanded={abierto}
				aria-controls="menu-movil"
				aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
				class="grid size-9 place-items-center rounded-full border border-borde bg-superficie/60 text-tinta-suave transition-colors hover:text-tinta lg:hidden"
			>
				<Icono nombre={abierto ? 'cerrar' : 'menu'} class="size-4" />
			</button>
		</div>
	</nav>

	{#if abierto}
		<div
			id="menu-movil"
			class="vidrio-desenfoque brillo-superior entrar mx-auto mt-2 max-w-3xl overflow-hidden rounded-3xl border border-borde p-2 lg:hidden"
			style="--d: 0ms"
		>
			<ul>
				{#each SECCIONES as item, i (item.id)}
					<li class="entrar" style="--d: {60 + i * 45}ms">
						<a
							href="#{item.id}"
							onclick={() => (abierto = false)}
							class="flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg tracking-tight transition-colors hover:bg-white/[0.05] {activa ===
							item.id
								? 'text-acento-300'
								: 'text-tinta'}"
						>
							{item.etiqueta}
							<span class="font-mono text-xs text-tinta-tenue">0{i + 1}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</header>
