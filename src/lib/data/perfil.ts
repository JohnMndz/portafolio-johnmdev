import type { Perfil } from '$lib/tipos';

export const PERFIL: Perfil = {
	nombre: 'John Mendoza',
	rol: 'Desarrollador de Software.',
	titular: 'Frontend y automatización con n8n e IA.',
	resumen: [
		'Estudiante de últimos semestres de Ingeniería de Software con experiencia práctica desarrollando aplicaciones web corporativas en equipos multidisciplinarios. Me especializo en frontend con JavaScript, Vue y SvelteKit.',
		'Soy un desarrollador pragmático y ágil: me apoyo en inteligencia artificial supervisada para acelerar la entrega de valor, sin descuidar la calidad de lo entregado.',
		'Además administro mi propia infraestructura sobre un VPS con Dokploy y orquesto flujos de automatización complejos e IA con n8n.'
	],
	ubicacion: 'Guayaquil, Ecuador',
	correo: 'jmendoza.jjmj@gmail.com',
	hechos: [
		{ etiqueta: 'Ubicación', valor: 'Guayaquil, Ecuador' },
		{ etiqueta: 'Enfoque', valor: 'Frontend y automatización' },
		{ etiqueta: 'Stack diario', valor: 'SvelteKit · Vue · PHP · n8n' },
		{ etiqueta: 'Infraestructura', valor: 'VPS propio con Dokploy' }
	]
};
