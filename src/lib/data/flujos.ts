import type { Flujo } from '$lib/tipos';

/**
 * Para publicar el canvas real de un flujo: exporta el workflow de n8n como JSON,
 * quita cualquier credencial/cookie/token de sus nodos (headers, `credentials`, etc.),
 * guárdalo en `static/flujos/<id>.json` y descomenta su línea `flujoJson`.
 * Mientras falte, el visor dibuja un marcador en vez de un canvas roto.
 */
export const FLUJOS: Flujo[] = [
	{
		id: 'rpa-bancario',
		titulo: 'Conciliación Bancaria Autónoma y RPA en WhatsApp',
		gancho: 'De un correo de compra al saldo conciliado en Google Sheets, sin intervención humana',
		descripcion:
			'Sistema financiero event-driven que une Google Workspace Studio y n8n. Al llegar un correo de consumo bancario, Workspace Studio extrae con Gemini el monto, comercio, quincena y categoría, registra el gasto en mi hoja de Presupuesto Mensual Desglosado y dispara un webhook a n8n. Con un guard anti-colisión de sesiones, el flujo conversa por WhatsApp (Evolution API) con el bot del Banco Guayaquil usando Gemini como clasificador semántico de estados, extrae el código OTP de 6 dígitos desde Gmail y escribe el saldo real y timestamp en el tablero de Google Sheets para calcular el descuadre contable al instante.',
		tecnologias: [
			'n8n',
			'Google Workspace Studio',
			'Evolution API',
			'Gemini',
			'Google Sheets API',
			'Gmail OTP',
			'Máquina de estados'
		],
		flujoJson: '/flujos/rpa-bancario.json'
	},
	{
		id: 'triage-email-ia',
		titulo: 'Triage de Correo con IA y Gateway de Alertas',
		gancho: 'Clasificación por etiquetas en Workspace Studio y despacho centralizado por prioridad',
		descripcion:
			'Arquitectura combinada entre Google Workspace Studio y n8n sobre dos bandejas de Gmail. Clasifica correos entrantes por etiquetas y relevancia con IA, y despacha solo las alertas críticas hacia un Gateway centralizado en n8n (Webhook + Sub-workflow) que normaliza payloads, da formato HTML por prioridad y notifica en Telegram o Google Chat sin fatiga de alertas.',
		tecnologias: [
			'n8n',
			'Google Workspace Studio',
			'Gmail API',
			'LangChain Text Classifier',
			'Telegram API',
			'Google Chat'
		],
		flujoJson: '/flujos/triage-email-ia.json'
	},
	{
		id: 'bot-devops-pr',
		titulo: 'Bot DevOps: De Google Chat a Pull Request',
		gancho: 'Del comando en el chat al PR redactado, etiquetado y asignado en GitHub',
		descripcion:
			'Integración entre Google Chat, GitHub y Gemini. Al indicar el repositorio y la rama en el chat, el flujo lee los commits contra develop, usa un LLM para redactar automáticamente el título y el cuerpo del PR en Markdown, lo publica en GitHub con el label del prefijo de la rama, asigna al autor y responde en el mismo hilo con el enlace.',
		tecnologias: ['n8n', 'GitHub API', 'Gemini', 'Google Chat', 'Google Tasks', 'Markdown'],
		flujoJson: '/flujos/bot-devops-pr.json'
	},
	{
		id: 'reporte-ejecutivo-pdf',
		titulo: 'Reportería Ejecutiva con Gotenberg y QuickChart',
		gancho: 'Métricas operativas convertidas en gráficos inline y un informe PDF A4 mensual',
		descripcion:
			'Pipeline de 25 nodos que consulta una API interna de métricas de uso, calcula KPIs, rankings y varianza intermensual, y genera gráficos dinámicos con QuickChart. Maqueta un reporte HTML en doble formato (correo con imágenes inline por CID y hoja A4), lo convierte a PDF mediante mi contenedor auto-hospedado de Gotenberg y arma un mensaje MIME multipart/mixed en base64url enviado a directivos vía Gmail API, con rama de alerta automática ante cualquier fallo.',
		tecnologias: [
			'n8n',
			'Gotenberg',
			'QuickChart',
			'Gmail API (MIME)',
			'REST APIs',
			'HTML / PDF A4'
		],
		flujoJson: '/flujos/reporte-ejecutivo-pdf.json'
	},
	{
		id: 'backup-workflows-drive',
		titulo: 'Backup Incremental de Workflows con SHA-256',
		gancho: 'Sincronización diaria hacia Google Drive que solo respalda los flujos que cambiaron',
		descripcion:
			'Pipeline DevOps de 22 nodos que consulta la API REST de mi instancia de n8n, limpia metadatos volátiles y calcula una huella criptográfica SHA-256 por cada flujo. Compara el hash contra una Data Table de estado para subir o rotar en Google Drive únicamente los workflows modificados, y elimina automáticamente los respaldos de flujos dados de baja.',
		tecnologias: [
			'n8n REST API',
			'SHA-256 Crypto',
			'Google Drive API',
			'Data Tables',
			'GitOps / Backup'
		],
		flujoJson: '/flujos/backup-workflows-drive.json'
	},
	{
		id: 'watcher-hetzner-cx33',
		titulo: 'Vigilante de Capacidad Cloud con Aprobación Humana',
		gancho:
			'Detecta cupo disponible en el datacenter y pide luz verde antes de tocar la infraestructura',
		descripcion:
			'Sondea cada 5 minutos el historial de disponibilidad de instancias CX33 en una ubicación de Hetzner Cloud (NBG1). Al detectar la transición a "disponible", genera un token de aprobación con expiración de 30 minutos y lo envía a Telegram con botones inline; solo si se aprueba dentro de esa ventana se dispara el rescale del servidor contra la API de Hetzner.',
		tecnologias: [
			'n8n',
			'Hetzner Cloud API',
			'Telegram Bot API',
			'Human-in-the-loop',
			'Máquina de estados'
		],
		flujoJson: '/flujos/watcher-hetzner-cx33.json'
	}
];
