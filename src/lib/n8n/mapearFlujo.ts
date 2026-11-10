import type { Edge, Node } from '@xyflow/svelte';
import { ALTO_NODO, ANCHO_NODO, distribuirNodos, type Ubicacion } from './distribuirNodos';

/** Subconjunto del export de n8n que necesitamos para dibujar el canvas. */
export interface ExportN8n {
	nodes: NodoN8nCrudo[];
	connections: Record<string, ConexionesSalida>;
}

export interface NodoN8nCrudo {
	name: string;
	type: string;
	position: [number, number];
}

/** n8n agrupa las salidas por tipo: `main` para el flujo de datos y tipos `ai_*` para conexiones de IA (modelo, tools, etc). */
type ConexionesSalida = Record<string, (ConexionDestino[] | null)[]>;

interface ConexionDestino {
	node: string;
	index: number;
}

export interface DatosNodoN8n {
	nombre: string;
	tipo: string;
	/** Nodo que solo cuelga de otro por una conexión `ai_*` (modelo, tool, parser…). */
	esSubNodo: boolean;
	/** Tiene alguna salida `ai_*`: necesita el conector superior. */
	tieneSalidaIa: boolean;
	/** Recibe sub-nodos: necesita el conector inferior. */
	tieneEntradaIa: boolean;
	[key: string]: unknown;
}

/** Ids de los handles; deben coincidir con los que declara `NodoN8n.svelte`. */
export const HANDLES = {
	entradaPrincipal: 'principal-entrada',
	salidaPrincipal: 'principal-salida',
	entradaIa: 'ia-entrada',
	salidaIa: 'ia-salida'
} as const;

interface ConexionCruda {
	origen: string;
	destino: string;
	tipo: string;
	salidaIndice: number;
	entradaIndice: number;
}

/** Convierte el export crudo de un workflow de n8n en nodos/edges de Svelte Flow. */
export function mapearFlujo(flujo: ExportN8n): { nodes: Node[]; edges: Edge[] } {
	const existe = new Set(flujo.nodes.map((nodo) => nodo.name));
	const conexiones = aplanarConexiones(flujo, existe);

	// n8n modela los sub-nodos al revés que el flujo de datos: la conexión sale
	// del sub-nodo (`OpenRouter Chat Model`) y entra en el nodo padre (`AI Agent`).
	const conMain = new Set<string>();
	for (const c of conexiones) {
		if (c.tipo !== 'main') continue;
		conMain.add(c.origen);
		conMain.add(c.destino);
	}

	const tieneSalidaIa = new Set<string>();
	const tieneEntradaIa = new Set<string>();
	for (const c of conexiones) {
		if (c.tipo === 'main') continue;
		tieneSalidaIa.add(c.origen);
		tieneEntradaIa.add(c.destino);
	}

	// Solo se trata como sub-nodo lo que no participa del flujo principal, para no
	// arrancar de la cadena un nodo que además alimente a un agente.
	const subNodos = new Set([...tieneSalidaIa].filter((id) => !conMain.has(id)));
	const subNodosPorPadre = new Map<string, string[]>();
	const yaAsignado = new Set<string>();
	for (const c of conexiones) {
		if (c.tipo === 'main' || !subNodos.has(c.origen) || yaAsignado.has(c.origen)) continue;
		yaAsignado.add(c.origen);
		const hermanos = subNodosPorPadre.get(c.destino) ?? [];
		hermanos.push(c.origen);
		subNodosPorPadre.set(c.destino, hermanos);
	}

	const crudas = new Map<string, Ubicacion>(
		flujo.nodes.map((nodo) => [nodo.name, { x: nodo.position[0], y: nodo.position[1] }])
	);
	const ubicaciones = distribuirNodos(crudas, subNodosPorPadre);

	const nodes: Node[] = flujo.nodes.map((nodo) => ({
		id: nodo.name,
		type: 'n8n',
		position: ubicaciones.get(nodo.name) ?? { x: nodo.position[0], y: nodo.position[1] },
		// Tamaño fijo declarado: es el que asume el reparto anti-solapes.
		width: ANCHO_NODO,
		height: ALTO_NODO,
		data: {
			nombre: nodo.name,
			tipo: nodo.type,
			esSubNodo: subNodos.has(nodo.name),
			tieneSalidaIa: tieneSalidaIa.has(nodo.name),
			tieneEntradaIa: tieneEntradaIa.has(nodo.name)
		} satisfies DatosNodoN8n
	}));

	const edges: Edge[] = conexiones.map((c) => {
		const esIa = c.tipo !== 'main';
		return {
			id: `${c.origen}-${c.tipo}-${c.salidaIndice}->${c.destino}-${c.entradaIndice}`,
			source: c.origen,
			target: c.destino,
			sourceHandle: esIa ? HANDLES.salidaIa : HANDLES.salidaPrincipal,
			targetHandle: esIa ? HANDLES.entradaIa : HANDLES.entradaPrincipal,
			class: esIa ? 'arista-ia' : 'arista-principal'
		};
	});

	return { nodes, edges };
}

/** Aplana `connections` a una lista plana, descartando destinos que no existan. */
function aplanarConexiones(flujo: ExportN8n, existe: Set<string>): ConexionCruda[] {
	const conexiones: ConexionCruda[] = [];

	for (const [origen, salidas] of Object.entries(flujo.connections ?? {})) {
		if (!existe.has(origen)) continue;

		for (const [tipo, salidasPorTipo] of Object.entries(salidas)) {
			salidasPorTipo.forEach((destinos, salidaIndice) => {
				for (const destino of destinos ?? []) {
					if (!existe.has(destino.node)) continue;
					conexiones.push({
						origen,
						destino: destino.node,
						tipo,
						salidaIndice,
						entradaIndice: destino.index
					});
				}
			});
		}
	}

	return conexiones;
}

export type CategoriaNodo =
	'disparador' | 'http' | 'codigo' | 'respuesta' | 'datos' | 'ia' | 'logica' | 'otro';

/*
 * El orden importa: se evalúa de arriba a abajo y gana la primera coincidencia.
 * Las categorías más específicas van primero para que, por ejemplo,
 * "respondToWebhook" (contiene "webhook") no caiga en "disparador".
 */
const PALABRAS_POR_CATEGORIA: Record<Exclude<CategoriaNodo, 'otro'>, string[]> = {
	respuesta: ['respondtowebhook'],
	http: ['httprequest'],
	codigo: ['code', 'function', 'crypto'],
	datos: ['googlesheets', 'googledrive', 'postgres', 'supabase', 'datatable', 'mysql', 'airtable'],
	ia: ['langchain', 'openrouter', 'lmchat', 'agent', 'openai', 'gemini', 'classifier'],
	logica: ['if', 'switch', 'merge', 'filter'],
	disparador: ['trigger', 'webhook', 'cron', 'poll']
};

const ETIQUETAS_CATEGORIA: Record<CategoriaNodo, string> = {
	disparador: 'Disparador',
	http: 'HTTP',
	codigo: 'Código',
	respuesta: 'Respuesta',
	datos: 'Datos',
	ia: 'IA',
	logica: 'Lógica',
	otro: 'Nodo'
};

const CLASES_CATEGORIA: Record<CategoriaNodo, string> = {
	disparador: 'border-acento-600/60 text-acento-300',
	http: 'border-borde-fuerte text-tinta-suave',
	codigo: 'border-borde-fuerte text-tinta-suave',
	respuesta: 'border-acento-600/60 text-acento-300',
	datos: 'border-borde-fuerte text-tinta-suave',
	ia: 'border-acento-600/60 text-acento-300',
	logica: 'border-borde-fuerte text-tinta-suave',
	otro: 'border-borde-fuerte text-tinta-suave'
};

/** Deriva nombre corto, etiqueta de categoría y clase de color a partir del `type` crudo de n8n. */
export function categoriaDeNodo(tipo: string): {
	categoria: CategoriaNodo;
	etiqueta: string;
	nombreCorto: string;
	clase: string;
} {
	const nombreCorto = tipo.replace(/^(n8n-nodes-base\.|@n8n\/n8n-nodes-langchain\.)/, '');
	const buscado = nombreCorto.toLowerCase();

	const categoria =
		(Object.entries(PALABRAS_POR_CATEGORIA).find(([, palabras]) =>
			palabras.some((palabra) => buscado.includes(palabra))
		)?.[0] as CategoriaNodo | undefined) ?? 'otro';

	return {
		categoria,
		etiqueta: ETIQUETAS_CATEGORIA[categoria],
		nombreCorto,
		clase: CLASES_CATEGORIA[categoria]
	};
}
