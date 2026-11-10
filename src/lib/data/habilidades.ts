import type { GrupoHabilidades } from '$lib/tipos';

export const HABILIDADES: GrupoHabilidades[] = [
	{
		titulo: 'Desarrollo Web',
		items: [
			'JavaScript',
			'PHP',
			'Symfony',
			'Twig',
			'Vue.js',
			'SvelteKit',
			'REST APIs',
			'HTML5',
			'CSS3',
			'Tailwind'
		]
	},
	{
		titulo: 'Automatización e Integraciones',
		items: [
			'n8n',
			'Workspace Studio',
			'Webhooks',
			'Evolution API',
			'Gotenberg',
			'Google Workspace APIs',
			'Prompt Engineering',
			'Claude',
			'Gemini'
		]
	},
	{
		titulo: 'Infraestructura y Versionado',
		items: ['Dokploy', 'VPS Linux', 'Docker', 'Git', 'GitHub', 'Supabase']
	}
];
