export interface ItemNav {
	id: string;
	etiqueta: string;
}

/** Fuente única del orden de secciones: la usan la barra de navegación y el scroll-spy. */
export const SECCIONES: ItemNav[] = [
	{ id: 'perfil', etiqueta: 'Perfil' },
	{ id: 'experiencia', etiqueta: 'Experiencia' },
	{ id: 'automatizaciones', etiqueta: 'Automatizaciones' },
	{ id: 'infraestructura', etiqueta: 'Infraestructura' },
	{ id: 'habilidades', etiqueta: 'Stack' },
	{ id: 'contacto', etiqueta: 'Contacto' }
];
