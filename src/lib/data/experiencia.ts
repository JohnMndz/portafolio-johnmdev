import type { Educacion, Puesto } from '$lib/tipos';

export const EXPERIENCIA: Puesto[] = [
	{
		empresa: 'Agripac',
		cargo: 'Desarrollador de Software Jr.',
		periodo: '2025 — Presente',
		descripcion:
			'Dentro del equipo de desarrollo construyo interfaces de usuario y lógica de negocio en el backend con PHP, consumiendo y coordinando con los servicios core desarrollados en Java por mis compañeros.',
		proyectos: [
			{
				nombre: 'Sistema de Gestión de Gastos',
				descripcion:
					'Co-desarrollo de una plataforma a medida para reemplazar SAP Concur, adaptando el frontend a las reglas financieras y operativas específicas de la empresa.',
				tecnologias: ['Symfony', 'PHP', 'Twig', 'JavaScript', 'REST APIs']
			},
			{
				nombre: 'Aplicación Logística de Courier',
				descripcion:
					'Interfaces y lógica de negocio para la plataforma de control inter-agencias, que permite el rastreo eficiente de paquetería y correspondencia corporativa.',
				tecnologias: ['JavaScript', 'PHP', 'Java (servicios core)', 'REST APIs']
			},
			{
				nombre: 'Backoffice de E-commerce',
				descripcion:
					'Construcción de las vistas de administración para la gestión operativa, el control de inventario y el procesamiento de pedidos de los encargados de la tienda.',
				tecnologias: ['JavaScript', 'PHP', 'REST APIs']
			}
		]
	}
];

export const EDUCACION: Educacion = {
	titulo: 'Ingeniería de Software',
	institucion: 'Universidad Tecnológica ECOTEC',
	detalle: 'Últimos semestres'
};
