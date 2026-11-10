export type Tono = 'neutral' | 'acento';

export interface Perfil {
	nombre: string;
	rol: string;
	titular: string;
	resumen: string[];
	ubicacion: string;
	correo: string;
	hechos: Hecho[];
}

export interface Hecho {
	etiqueta: string;
	valor: string;
}

export interface Puesto {
	empresa: string;
	cargo: string;
	periodo: string;
	descripcion: string;
	proyectos: ProyectoInterno[];
}

export interface ProyectoInterno {
	nombre: string;
	descripcion: string;
	tecnologias: string[];
}

export interface Flujo {
	id: string;
	titulo: string;
	gancho: string;
	descripcion: string;
	tecnologias: string[];
	/** Ruta al export del canvas de n8n en `static/flujos/`. Si falta, se dibuja un marcador. */
	flujoJson?: string;
}

export interface ServicioInfra {
	nombre: string;
	icono: NombreIcono;
	descripcion: string;
}

export interface GrupoHabilidades {
	titulo: string;
	items: string[];
}

export interface Enlace {
	etiqueta: string;
	valor: string;
	href: string;
	icono: NombreIcono;
	externo: boolean;
}

export interface Educacion {
	titulo: string;
	institucion: string;
	detalle: string;
}

export type NombreIcono =
	| 'correo'
	| 'whatsapp'
	| 'github'
	| 'linkedin'
	| 'ubicacion'
	| 'flecha'
	| 'expandir'
	| 'cerrar'
	| 'anterior'
	| 'siguiente'
	| 'servidor'
	| 'escudo'
	| 'notas'
	| 'flujo'
	| 'mensaje'
	| 'documento'
	| 'menu';
