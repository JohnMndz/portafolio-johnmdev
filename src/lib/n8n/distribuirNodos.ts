/**
 * Reubica los nodos de un flujo de n8n para que nunca se solapen.
 *
 * Las posiciones que exporta n8n asumen sus propias tarjetas (~100x100 px) y su
 * rejilla de 224 px, además de colocar los sub-nodos de IA muy juntos (128 px).
 * Nuestras tarjetas son más anchas y más bajas, así que esas coordenadas crudas
 * producen solapes. En vez de inventar un layout nuevo (que perdería la
 * intención del autor: ramas paralelas, orden de lectura), se conserva la
 * disposición original y se normaliza en tres pasos deterministas:
 *
 *   1. Los sub-nodos de IA pasan a una rejilla compacta centrada bajo su padre.
 *   2. Los nodos se agrupan en filas (n8n desalinea verticalmente cadenas que
 *      en realidad son la misma banda) y dentro de cada fila se separan en X.
 *   3. Las filas que se cruzan en X se separan en Y.
 *
 * Tras el paso 3 no puede quedar ningún par solapado: dos nodos de la misma fila
 * están a >= PASO_X y dos nodos de filas distintas o están a >= PASO_Y o sus
 * filas no comparten franja horizontal.
 */

/** Tamaño fijo de las tarjetas; se pasa también a Svelte Flow como `width`/`height`. */
export const ANCHO_NODO = 200;
export const ALTO_NODO = 56;

const SEPARACION_X = 24;
const SEPARACION_Y = 40;

/** Distancia mínima entre centros. `PASO_X` coincide con la rejilla de n8n (224 px). */
const PASO_X = ANCHO_NODO + SEPARACION_X;
const PASO_Y = ALTO_NODO + SEPARACION_Y;

/** Dos nodos con menos de esta diferencia en Y se consideran de la misma fila. */
const TOLERANCIA_FILA = 48;

/** Los sub-nodos se reparten en una rejilla de como máximo esta anchura. */
const MAX_SUB_POR_FILA = 4;

/** Hueco entre un padre y su primera fila de sub-nodos. */
const SALTO_SUBNODOS = 2 * PASO_Y;

export interface Ubicacion {
	x: number;
	y: number;
}

interface Fila {
	y: number;
	ids: string[];
}

export function distribuirNodos(
	posiciones: Map<string, Ubicacion>,
	subNodosPorPadre: Map<string, string[]>
): Map<string, Ubicacion> {
	const finales = new Map<string, Ubicacion>(
		[...posiciones].map(([id, p]) => [id, { x: p.x, y: p.y }])
	);

	colocarSubNodos(finales, subNodosPorPadre);

	const filas = agruparEnFilas(finales);
	separarEnX(finales, filas);
	separarEnY(finales, filas);

	return finales;
}

/** Rejilla compacta de sub-nodos (modelo, tools, parser…) centrada bajo su padre. */
function colocarSubNodos(finales: Map<string, Ubicacion>, subNodosPorPadre: Map<string, string[]>) {
	for (const [padre, hijos] of subNodosPorPadre) {
		const posPadre = finales.get(padre);
		if (!posPadre || hijos.length === 0) continue;

		// Se respeta el orden izquierda-derecha que tenían en n8n.
		const ordenados = [...hijos].sort(
			(a, b) => finales.get(a)!.x - finales.get(b)!.x || a.localeCompare(b)
		);

		// Filas equilibradas: 11 sub-nodos -> 4 + 4 + 3, no 4 + 4 + 2 + 1.
		const totalFilas = Math.ceil(ordenados.length / MAX_SUB_POR_FILA);
		const porFila = Math.ceil(ordenados.length / totalFilas);
		const centro = posPadre.x + ANCHO_NODO / 2;

		ordenados.forEach((hijo, i) => {
			const fila = Math.floor(i / porFila);
			const columna = i % porFila;
			const enEstaFila = Math.min(porFila, ordenados.length - fila * porFila);
			const anchoFila = enEstaFila * PASO_X - SEPARACION_X;

			finales.set(hijo, {
				x: Math.round(centro - anchoFila / 2 + columna * PASO_X),
				y: posPadre.y + SALTO_SUBNODOS + fila * PASO_Y
			});
		});
	}
}

/**
 * Agrupa por proximidad vertical encadenada y alinea cada grupo a su Y media:
 * las cadenas que n8n dibuja con saltitos de 32 px quedan en una única fila recta.
 */
function agruparEnFilas(finales: Map<string, Ubicacion>): Fila[] {
	const ids = [...finales.keys()].sort(
		(a, b) =>
			finales.get(a)!.y - finales.get(b)!.y ||
			finales.get(a)!.x - finales.get(b)!.x ||
			a.localeCompare(b)
	);

	const filas: Fila[] = [];
	let actual: string[] = [];
	let yPrevio = 0;

	for (const id of ids) {
		const y = finales.get(id)!.y;
		if (actual.length > 0 && y - yPrevio > TOLERANCIA_FILA) {
			filas.push(cerrarFila(actual, finales));
			actual = [];
		}
		actual.push(id);
		yPrevio = y;
	}
	if (actual.length > 0) filas.push(cerrarFila(actual, finales));

	return filas;
}

function cerrarFila(ids: string[], finales: Map<string, Ubicacion>): Fila {
	const suma = ids.reduce((total, id) => total + finales.get(id)!.y, 0);
	return { y: Math.round(suma / ids.length), ids };
}

/** Empuja hacia la derecha, sin mover el nodo más a la izquierda de cada fila. */
function separarEnX(finales: Map<string, Ubicacion>, filas: Fila[]) {
	for (const fila of filas) {
		fila.ids.sort((a, b) => finales.get(a)!.x - finales.get(b)!.x || a.localeCompare(b));

		let limite = -Infinity;
		for (const id of fila.ids) {
			const pos = finales.get(id)!;
			const x = Math.max(pos.x, limite);
			finales.set(id, { x, y: pos.y });
			limite = x + PASO_X;
		}
	}
}

/**
 * Baja cada fila hasta despegarla de todas las anteriores con las que comparta
 * franja horizontal. Las filas que no se cruzan en X se quedan donde estaban,
 * así el flujo no se estira más de lo necesario.
 */
function separarEnY(finales: Map<string, Ubicacion>, filas: Fila[]) {
	filas.sort((a, b) => a.y - b.y);
	const colocadas: { y: number; inicio: number; fin: number }[] = [];

	for (const fila of filas) {
		const xs = fila.ids.map((id) => finales.get(id)!.x);
		const inicio = Math.min(...xs);
		const fin = Math.max(...xs) + ANCHO_NODO;

		let y = fila.y;
		for (const previa of colocadas) {
			const seCruzan = inicio < previa.fin + SEPARACION_X && previa.inicio < fin + SEPARACION_X;
			if (seCruzan) y = Math.max(y, previa.y + PASO_Y);
		}

		fila.y = y;
		colocadas.push({ y, inicio, fin });
		for (const id of fila.ids) finales.set(id, { x: finales.get(id)!.x, y });
	}
}
