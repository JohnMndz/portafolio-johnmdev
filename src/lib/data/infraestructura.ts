import type { ServicioInfra } from '$lib/tipos';

export const INFRAESTRUCTURA: ServicioInfra[] = [
	{
		nombre: 'VPS con Dokploy y Cloudflare Tunnel',
		icono: 'servidor',
		descripcion:
			'Administración de un servidor VPS propio (4 vCPUs, 8 GB RAM) con Dokploy, Traefik y túneles Zero Trust de Cloudflare para desplegar proyectos en SvelteKit y Vue sin exponer puertos.'
	},
	{
		nombre: 'Motor de n8n + PostgreSQL & Redis',
		icono: 'flujo',
		descripcion:
			'Instancia auto-hospedada de n8n respaldada por PostgreSQL, Redis y Data Tables propias, con un flujo diario de backup incremental con hash SHA-256 hacia Google Drive.'
	},
	{
		nombre: 'Evolution API (Gateway de WhatsApp)',
		icono: 'mensaje',
		descripcion:
			'Pasarela multi-dispositivo auto-hospedada con persistencia en PostgreSQL y caché en Redis que conecta mis agentes de IA y el RPA bancario directamente con WhatsApp.'
	},
	{
		nombre: 'Gotenberg (Renderizado PDF Headless)',
		icono: 'documento',
		descripcion:
			'Microservicio Chromium y LibreOffice en contenedor aislado para transformar plantillas HTML y gráficos en reportes ejecutivos PDF A4 de alta fidelidad.'
	},
	{
		nombre: 'Seguridad Zero Trust y Red Privada',
		icono: 'escudo',
		descripcion:
			'Arquitectura sin puertos expuestos mediante túneles cifrados, aislamiento por redes de contenedores, políticas de acceso y respaldos automatizados.'
	},
	{
		nombre: 'Obsidian LiveSync (CouchDB)',
		icono: 'notas',
		descripcion:
			'Clúster propio de CouchDB para sincronizar mi base de conocimiento y notas técnicas en tiempo real entre dispositivos, sin depender de nubes de pago.'
	}
];
