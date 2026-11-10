<script lang="ts">
	import './layout.css';
	// Solo el eje de peso y, en la serif, solo el subconjunto latino: el sitio es en
	// español. Las variables traen sus subsets con `unicode-range`, así que el navegador
	// nunca descarga cirílico ni griego.
	import '@fontsource-variable/geist/wght.css';
	import '@fontsource-variable/geist-mono/wght.css';
	import '@fontsource/instrument-serif/latin-400.css';
	import '@fontsource/instrument-serif/latin-400-italic.css';

	import Fondo from '$lib/components/layout/Fondo.svelte';
	import BarraProgreso from '$lib/components/layout/BarraProgreso.svelte';
	import Navegacion from '$lib/components/layout/Navegacion.svelte';
	import PieDePagina from '$lib/components/layout/PieDePagina.svelte';

	let { children } = $props();

	// Las animaciones infinitas (diagrama de la portada, marquesina, pulsos) siguen
	// corriendo aunque su sección no se vea, y le quitan cuadros al scroll y al fondo.
	// Se pausan las secciones que están fuera de pantalla (ver `.pausado` en layout.css).
	$effect(() => {
		const secciones = document.querySelectorAll('main section');
		const observador = new IntersectionObserver(
			(entradas) => {
				for (const e of entradas) e.target.classList.toggle('pausado', !e.isIntersecting);
			},
			{ rootMargin: '100px 0px' }
		);
		secciones.forEach((s) => observador.observe(s));
		return () => observador.disconnect();
	});
</script>

<a
	href="#perfil"
	class="sr-only z-50 rounded-full bg-acento-400 px-4 py-2 text-sm font-medium text-fondo focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
>
	Saltar al contenido
</a>

<Fondo />
<BarraProgreso />
<Navegacion />
<main>
	{@render children()}
</main>
<PieDePagina />
