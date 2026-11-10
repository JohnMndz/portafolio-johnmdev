<script lang="ts">
	import { browser } from '$app/environment';
	import {
		SvelteFlow,
		SvelteFlowProvider,
		Background,
		BackgroundVariant,
		Controls
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import Marcador from '$lib/components/ui/Marcador.svelte';
	import NodoN8n from './NodoN8n.svelte';
	import { mapearFlujo, type ExportN8n } from '$lib/n8n/mapearFlujo';

	interface Props {
		flujoJson: string;
		titulo: string;
		/** false = miniatura de tarjeta: sin controles ni pan/zoom, solo vista fija. */
		interactivo?: boolean;
	}

	let { flujoJson, titulo, interactivo = true }: Props = $props();

	let estado = $state<'cargando' | 'error' | 'listo'>('cargando');
	let datos = $state.raw<ReturnType<typeof mapearFlujo> | null>(null);

	const nodeTypes = { n8n: NodoN8n };

	$effect(() => {
		if (!browser) return;

		estado = 'cargando';
		datos = null;
		const controlador = new AbortController();

		fetch(flujoJson, { signal: controlador.signal })
			.then((r) => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json() as Promise<ExportN8n>;
			})
			.then((exportado) => {
				if (!Array.isArray(exportado?.nodes)) throw new Error('JSON sin `nodes`');
				datos = mapearFlujo(exportado);
				estado = 'listo';
			})
			.catch((err: unknown) => {
				if ((err as { name?: string }).name === 'AbortError') return;
				console.error('No se pudo cargar el flujo', flujoJson, err);
				estado = 'error';
			});

		return () => controlador.abort();
	});
</script>

{#if estado === 'listo' && datos}
	<div class="canvas-n8n h-full w-full bg-elevado" class:pointer-events-none={!interactivo}>
		<SvelteFlowProvider>
			<SvelteFlow
				nodes={datos.nodes}
				edges={datos.edges}
				{nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.12 }}
				colorMode="dark"
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				panOnScroll={interactivo}
				panOnDrag={interactivo}
				zoomOnScroll={interactivo}
				zoomOnPinch={interactivo}
				zoomOnDoubleClick={interactivo}
				preventScrolling={false}
				minZoom={0.15}
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={22}
					patternColor="var(--color-borde-fuerte)"
				/>
				{#if interactivo}
					<Controls showLock={false} />
				{/if}
			</SvelteFlow>
		</SvelteFlowProvider>
	</div>
{:else if estado === 'error'}
	<Marcador {titulo} class="h-full" />
{:else}
	<div class="flex h-full items-center justify-center bg-elevado">
		<p class="font-mono text-xs tracking-wide text-tinta-tenue uppercase">Cargando canvas…</p>
	</div>
{/if}

<style>
	.canvas-n8n :global(.svelte-flow) {
		background-color: var(--color-elevado);
	}

	.canvas-n8n :global(.arista-principal .svelte-flow__edge-path) {
		stroke: var(--color-acento-500);
		stroke-width: 1.5;
	}

	/* Las conexiones `ai_*` (modelo, tools, parser) son de configuración, no de datos:
	   se dibujan discontinuas y apagadas para que no compitan con la cadena principal. */
	.canvas-n8n :global(.arista-ia .svelte-flow__edge-path) {
		stroke: var(--color-borde-fuerte);
		stroke-width: 1.25;
		stroke-dasharray: 4 4;
	}

	.canvas-n8n :global(.svelte-flow__controls) {
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-borde);
		box-shadow: none;
	}

	.canvas-n8n :global(.svelte-flow__controls-button) {
		background: var(--color-superficie);
		border-bottom: 1px solid var(--color-borde);
		fill: var(--color-tinta-suave);
	}

	.canvas-n8n :global(.svelte-flow__controls-button:hover) {
		background: var(--color-elevado);
	}

	.canvas-n8n :global(.svelte-flow__attribution) {
		background: transparent;
	}

	.canvas-n8n :global(.svelte-flow__attribution a) {
		color: var(--color-tinta-tenue);
	}
</style>
