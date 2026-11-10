import type { Enlace } from '$lib/tipos';

// TODO: reemplazar por los perfiles reales antes de publicar.
export const URL_GITHUB = 'https://github.com/JohnMndz';
export const URL_LINKEDIN = 'https://www.linkedin.com/in/john-mendoza-036731332';

export const SITIO_URL = 'https://johnmdev.daftcode.uk';

export const ENLACES: Enlace[] = [
	{
		etiqueta: 'Correo',
		valor: 'jmendoza.jjmj@gmail.com',
		href: 'mailto:jmendoza.jjmj@gmail.com',
		icono: 'correo',
		externo: false
	},
	{
		etiqueta: 'WhatsApp',
		valor: '+593 99 087 4003',
		href: 'https://wa.me/593990874003',
		icono: 'whatsapp',
		externo: true
	},
	{
		etiqueta: 'GitHub',
		valor: 'JohnMdz',
		href: URL_GITHUB,
		icono: 'github',
		externo: true
	},
	{
		etiqueta: 'LinkedIn',
		valor: 'John Mendoza',
		href: URL_LINKEDIN,
		icono: 'linkedin',
		externo: true
	}
];
