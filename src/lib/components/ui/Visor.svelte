<script lang="ts">
	import type { Flujo } from '$lib/tipos';
	import Etiqueta from './Etiqueta.svelte';
	import Icono from './Icono.svelte';
	import Marcador from './Marcador.svelte';
	import CanvasFlujo from '$lib/components/flujo/CanvasFlujo.svelte';

	interface Props {
		flujos: Flujo[];
		/** Índice del flujo abierto, o `null` cuando el visor está cerrado. */
		indice: number | null;
		alCerrar: () => void;
		alNavegar: (i: number) => void;
	}

	let { flujos, indice, alCerrar, alNavegar }: Props = $props();

	let dialogo = $state<HTMLDialogElement | null>(null);
	let contenedorScroll = $state<HTMLDivElement | null>(null);
	const activo = $derived(indice === null ? null : (flujos[indice] ?? null));

	// Al cambiar de flujo, reiniciar el scroll arriba para ver el nuevo canvas y descripción.
	$effect(() => {
		if (indice !== null && contenedorScroll) {
			contenedorScroll.scrollTop = 0;
		}
	});

	// `showModal()` aporta focus trap, backdrop y cierre con Escape de forma nativa,
	// y devuelve el foco al botón que lo abrió al cerrarse.
	$effect(() => {
		const d = dialogo;
		if (!d) return;

		if (indice !== null && !d.open) d.showModal();
		if (indice === null && d.open) d.close();

		if (indice === null) return;

		const previo = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previo;
		};
	});

	function alTeclado(e: KeyboardEvent) {
		if (indice === null || flujos.length < 2) return;
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			alNavegar((indice + 1) % flujos.length);
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			alNavegar((indice - 1 + flujos.length) % flujos.length);
		}
	}

	// Clic sobre el ::backdrop: el target es el propio <dialog>, no su contenido.
	function alClicFondo(e: MouseEvent) {
		if (e.target === dialogo) alCerrar();
	}
</script>

<svelte:window onkeydown={alTeclado} />

<dialog
	bind:this={dialogo}
	onclose={alCerrar}
	onclick={alClicFondo}
	aria-labelledby="visor-titulo"
	class="brillo-superior m-auto flex max-h-[92dvh] w-[min(94vw,76rem)] max-w-none flex-col overflow-hidden rounded-3xl border border-borde-fuerte bg-superficie p-0 text-tinta shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] backdrop:bg-transparent"
>
	{#if activo}
		<div class="flex shrink-0 items-start justify-between gap-4 border-b border-borde px-5 py-4 sm:px-6 sm:py-5">
			<div class="min-w-0">
				<h2 id="visor-titulo" class="text-xl font-semibold tracking-tight sm:text-2xl">
					{activo.titulo}
				</h2>
				<p class="mt-1 text-xs text-acento-300/90 sm:text-sm">{activo.gancho}</p>
			</div>
			<button
				type="button"
				onclick={alCerrar}
				aria-label="Cerrar visor"
				class="grid size-9 shrink-0 place-items-center rounded-full border border-borde text-tinta-suave transition-all duration-300 hover:rotate-90 hover:border-borde-fuerte hover:text-tinta motion-reduce:transition-none"
			>
				<Icono nombre="cerrar" class="size-4" />
			</button>
		</div>

		<div bind:this={contenedorScroll} class="scroll-fino flex-1 overflow-y-auto overscroll-contain">
			{#if activo.flujoJson}
				<div class="h-[38vh] min-h-[220px] bg-fondo sm:h-[48vh] lg:h-[58vh]">
					<CanvasFlujo flujoJson={activo.flujoJson} titulo={activo.titulo} />
				</div>
			{:else}
				<div class="min-h-[220px] bg-fondo">
					<Marcador titulo={activo.titulo} class="mx-auto max-w-3xl" />
				</div>
			{/if}

			<div class="border-t border-borde px-5 py-5 sm:px-6">
				<p class="text-sm leading-relaxed text-tinta-suave sm:text-base">{activo.descripcion}</p>
				<div class="mt-4 flex flex-wrap gap-1.5">
					{#each activo.tecnologias as tec (tec)}
						<Etiqueta label={tec} />
					{/each}
				</div>
			</div>
		</div>

		{#if flujos.length > 1 && indice !== null}
			<div class="flex shrink-0 items-center justify-between border-t border-borde bg-superficie px-5 py-3">
				<button
					type="button"
					onclick={() => alNavegar((indice + flujos.length - 1) % flujos.length)}
					class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-tinta-suave transition-colors hover:bg-white/[0.05] hover:text-tinta motion-reduce:transition-none"
				>
					<Icono nombre="anterior" class="size-4" />
					Anterior
				</button>
				<span class="font-mono text-xs text-tinta-tenue">
					{indice + 1} / {flujos.length}
				</span>
				<button
					type="button"
					onclick={() => alNavegar((indice + 1) % flujos.length)}
					class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-tinta-suave transition-colors hover:bg-white/[0.05] hover:text-tinta motion-reduce:transition-none"
				>
					Siguiente
					<Icono nombre="siguiente" class="size-4" />
				</button>
			</div>
		{/if}
	{/if}
</dialog>
