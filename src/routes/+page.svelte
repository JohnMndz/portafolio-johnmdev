<script lang="ts">
	import { PERFIL } from '$lib/data/perfil';
	import { SITIO_URL, URL_GITHUB, URL_LINKEDIN } from '$lib/data/enlaces';

	import Portada from '$lib/components/secciones/Portada.svelte';
	import Perfil from '$lib/components/secciones/Perfil.svelte';
	import Experiencia from '$lib/components/secciones/Experiencia.svelte';
	import Automatizaciones from '$lib/components/secciones/Automatizaciones.svelte';
	import Infraestructura from '$lib/components/secciones/Infraestructura.svelte';
	import Habilidades from '$lib/components/secciones/Habilidades.svelte';
	import Contacto from '$lib/components/secciones/Contacto.svelte';

	const titulo = `${PERFIL.nombre} — ${PERFIL.rol}`;
	const descripcion =
		'Desarrollador de software junior en Guayaquil. Frontend con Vue y SvelteKit, automatizaciones con n8n e IA, e infraestructura auto-hospedada en VPS con Dokploy.';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: PERFIL.nombre,
		jobTitle: PERFIL.rol,
		email: `mailto:${PERFIL.correo}`,
		url: SITIO_URL,
		address: { '@type': 'PostalAddress', addressLocality: 'Guayaquil', addressCountry: 'EC' },
		knowsAbout: ['JavaScript', 'Vue.js', 'SvelteKit', 'PHP', 'n8n', 'Docker', 'Supabase'],
		sameAs: [URL_GITHUB, URL_LINKEDIN]
	};
</script>

<svelte:head>
	<title>{titulo}</title>
	<meta name="description" content={descripcion} />
	<link rel="canonical" href={SITIO_URL} />

	<meta property="og:type" content="website" />
	<meta property="og:locale" content="es_EC" />
	<meta property="og:title" content={titulo} />
	<meta property="og:description" content={descripcion} />
	<meta property="og:url" content={SITIO_URL} />
	<meta property="og:image" content="{SITIO_URL}/og.png?v=2" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={titulo} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={titulo} />
	<meta name="twitter:description" content={descripcion} />
	<meta name="twitter:image" content="{SITIO_URL}/og.png?v=2" />

	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
</svelte:head>

<Portada />
<Perfil />
<Experiencia />
<Automatizaciones />
<Infraestructura />
<Habilidades />
<Contacto />
