<script lang="ts">
	import { ICONOS_TEC } from '$lib/data/iconosTecnologias';

	interface Props {
		/** Nombre tal como aparece en `HABILIDADES`. */
		nombre: string;
		/** Pinta el icono con el color de la marca; si no, hereda `currentColor`. */
		color?: boolean;
		class?: string;
	}

	let { nombre, color = true, class: klass = 'size-4' }: Props = $props();
	const icono = $derived(ICONOS_TEC[nombre]);
</script>

{#if icono}
	<svg
		class="shrink-0 {klass}"
		viewBox="0 0 24 24"
		fill={icono.relleno ? 'currentColor' : 'none'}
		stroke={icono.relleno ? 'none' : 'currentColor'}
		stroke-width="1.7"
		stroke-linecap="round"
		stroke-linejoin="round"
		style:color={color ? icono.color : undefined}
		aria-hidden="true"
		focusable="false"
	>
		<path d={icono.ruta} />
	</svg>
{/if}
