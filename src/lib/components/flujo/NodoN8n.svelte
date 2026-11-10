<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { categoriaDeNodo, HANDLES } from '$lib/n8n/mapearFlujo';
	import type { DatosNodoN8n } from '$lib/n8n/mapearFlujo';

	let { data }: NodeProps = $props();
	const datos = $derived(data as DatosNodoN8n);
	const info = $derived(categoriaDeNodo(datos.tipo));

	const CLASE_HANDLE = '!size-1.5 !border-borde-fuerte !bg-elevado';
</script>

<div
	class="flex h-full w-full flex-col justify-center overflow-hidden rounded-lg border bg-superficie px-3 font-mono text-[11px] leading-tight shadow-sm {info.clase}"
	title={datos.nombre}
>
	<!-- Los handles se declaran solo cuando existen aristas que los usan: un sub-nodo
	     de IA no tiene flujo principal, así que no muestra conectores laterales. -->
	{#if !datos.esSubNodo}
		<Handle
			type="target"
			position={Position.Left}
			id={HANDLES.entradaPrincipal}
			class={CLASE_HANDLE}
		/>
		<Handle
			type="source"
			position={Position.Right}
			id={HANDLES.salidaPrincipal}
			class={CLASE_HANDLE}
		/>
	{/if}
	{#if datos.tieneSalidaIa}
		<Handle type="source" position={Position.Top} id={HANDLES.salidaIa} class={CLASE_HANDLE} />
	{/if}
	{#if datos.tieneEntradaIa}
		<Handle type="target" position={Position.Bottom} id={HANDLES.entradaIa} class={CLASE_HANDLE} />
	{/if}

	<p class="truncate text-tinta">{datos.nombre}</p>
	<p class="mt-0.5 truncate text-[10px] tracking-wide text-tinta-tenue uppercase">
		{info.etiqueta}
	</p>
</div>
