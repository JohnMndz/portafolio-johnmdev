<script lang="ts">
	import type { NombreIcono } from '$lib/tipos';

	interface Props {
		nombre: NombreIcono;
		class?: string;
	}

	let { nombre, class: klass = 'size-5' }: Props = $props();

	// Sprite propio: evita arrastrar una libreria de iconos entera por 15 trazos.
	const RUTAS: Record<NombreIcono, string> = {
		correo:
			'M3 7.5 12 13l9-5.5M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17V7a1.5 1.5 0 0 1 1.5-1.5Z',
		whatsapp:
			'M3.5 20.5l1.3-4.6A8.2 8.2 0 1 1 8.2 19l-4.7 1.5Zm5.3-5.9c1.2 2 3 3.1 4.6 3.3.9.1 1.9-.4 2.2-1.2.1-.4.1-.8 0-1l-1.8-.9-.9 1a5.6 5.6 0 0 1-2.3-2.3l1-.9-.9-1.8c-.3-.1-.7-.1-1 0-.8.3-1.3 1.3-1.2 2.2.1.5.2 1 .3 1.6Z',
		github:
			'M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.6-.2.6-.5v-1.7c-2.6.6-3.2-1.2-3.2-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6.9.1 1.4 1 1.4 1 .9 1.5 2.3 1.1 2.8.8.1-.6.3-1.1.6-1.3-2.1-.2-4.3-1-4.3-4.6 0-1 .4-1.9 1-2.5-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.6a3.6 3.6 0 0 1 1 2.5c0 3.6-2.2 4.4-4.3 4.6.3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z',
		linkedin:
			'M4.5 9.5h3v10h-3v-10Zm1.5-5a1.8 1.8 0 1 1 0 3.5 1.8 1.8 0 0 1 0-3.5ZM10 9.5h2.9v1.4c.5-.9 1.6-1.6 3.1-1.6 2.6 0 3.5 1.6 3.5 4.2v6h-3v-5.4c0-1.4-.5-2.2-1.7-2.2-1.1 0-1.8.7-1.8 2.2v5.4h-3v-10Z',
		ubicacion:
			'M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
		flecha: 'M5 12h14m-6-6 6 6-6 6',
		expandir: 'M9 4H4v5m11-5h5v5M9 20H4v-5m11 5h5v-5',
		cerrar: 'M6 6l12 12M18 6 6 18',
		anterior: 'M15 5l-7 7 7 7',
		siguiente: 'M9 5l7 7-7 7',
		servidor: 'M4 5.5h16v5H4v-5Zm0 8h16v5H4v-5ZM7.5 8h.01M7.5 16h.01',
		escudo: 'M12 3l7 3v5.5c0 4.3-2.9 7.7-7 9.5-4.1-1.8-7-5.2-7-9.5V6l7-3Zm-2.5 9 2 2 3.5-4',
		notas: 'M6 3.5h9L19 8v12.5H6V3.5Zm8.5.5V8H19M9 12h6M9 16h6',
		flujo: 'M6 5.5h4v4H6v-4Zm8 9h4v4h-4v-4Zm-8 0h4v4H6v-4Zm4-2h4v2m0-2v-2H10',
		mensaje:
			'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5v-7Zm4 3.5h8m-8 3h5',
		documento: 'M7 3.5h7l4 4V20.5H7V3.5Zm6.5.5v4h4M10 13h5M10 16.5h3.5',
		menu: 'M4 7h16M4 12h16M4 17h16'
	};

	const RELLENOS: NombreIcono[] = ['github', 'linkedin', 'whatsapp', 'ubicacion'];
	const esRelleno = $derived(RELLENOS.includes(nombre));
</script>

<svg
	class={klass}
	viewBox="0 0 24 24"
	fill={esRelleno ? 'currentColor' : 'none'}
	stroke={esRelleno ? 'none' : 'currentColor'}
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	<path d={RUTAS[nombre]} />
</svg>
