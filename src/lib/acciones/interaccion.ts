import type { Action } from 'svelte/action';

const movimientoReducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const punteroFino = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Agrupa los `pointermove` en un solo cálculo por fotograma. Los ratones de alta
 * frecuencia disparan cientos de eventos por segundo: medir el nodo
 * (`getBoundingClientRect`) y escribir estilos en cada uno traba la página al mover
 * el cursor rápido.
 */
function porFotograma(pintar: (x: number, y: number, caja: DOMRect) => void, nodo: HTMLElement) {
	let fotograma = 0;
	let x = 0;
	let y = 0;

	function alMover(e: PointerEvent) {
		x = e.clientX;
		y = e.clientY;
		if (!fotograma)
			fotograma = requestAnimationFrame(() => {
				fotograma = 0;
				pintar(x, y, nodo.getBoundingClientRect());
			});
	}

	return {
		alMover,
		cancelar() {
			if (fotograma) cancelAnimationFrame(fotograma);
			fotograma = 0;
		}
	};
}

/**
 * Escribe la posición del cursor relativa al nodo en `--mx`/`--my`, que consume la
 * clase `.foco` para dibujar el borde y el halo que siguen al puntero.
 */
export const foco: Action<HTMLElement> = (nodo) => {
	if (!punteroFino()) return;

	const { alMover, cancelar } = porFotograma((x, y, caja) => {
		nodo.style.setProperty('--mx', `${Math.round(x - caja.left)}px`);
		nodo.style.setProperty('--my', `${Math.round(y - caja.top)}px`);
	}, nodo);

	nodo.addEventListener('pointermove', alMover, { passive: true });
	return {
		destroy() {
			nodo.removeEventListener('pointermove', alMover);
			cancelar();
		}
	};
};

/**
 * Botón magnético: el elemento se desplaza levemente hacia el cursor mientras está
 * encima, y vuelve con resorte al salir. Solo con ratón y sin movimiento reducido.
 */
export const magnetico: Action<HTMLElement, number | undefined> = (nodo, fuerza = 0.28) => {
	if (!punteroFino() || movimientoReducido()) return;

	let intensidad = fuerza;

	const { alMover, cancelar } = porFotograma((x, y, caja) => {
		const dx = x - (caja.left + caja.width / 2);
		const dy = y - (caja.top + caja.height / 2);
		nodo.style.transition = 'transform 150ms ease-out';
		nodo.style.transform = `translate3d(${(dx * intensidad).toFixed(1)}px, ${(dy * intensidad * 1.2).toFixed(1)}px, 0)`;
	}, nodo);

	function alSalir() {
		cancelar();
		nodo.style.transition = 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)';
		nodo.style.transform = '';
	}

	nodo.addEventListener('pointermove', alMover, { passive: true });
	nodo.addEventListener('pointerleave', alSalir);
	return {
		update(nueva = 0.28) {
			intensidad = nueva;
		},
		destroy() {
			nodo.removeEventListener('pointermove', alMover);
			nodo.removeEventListener('pointerleave', alSalir);
			cancelar();
		}
	};
};

/**
 * Inclinación 3D sutil que sigue al cursor. Pensada para piezas protagonistas
 * (el diagrama de la portada), no para grillas: en masa marea.
 */
export const inclinar: Action<HTMLElement, number | undefined> = (nodo, grados = 6) => {
	if (!punteroFino() || movimientoReducido()) return;

	const maximo = grados;

	const { alMover, cancelar } = porFotograma((x, y, caja) => {
		const px = (x - caja.left) / caja.width - 0.5;
		const py = (y - caja.top) / caja.height - 0.5;
		nodo.style.transition = 'transform 200ms ease-out';
		nodo.style.transform = `perspective(1200px) rotateX(${(-py * maximo).toFixed(2)}deg) rotateY(${(px * maximo).toFixed(2)}deg)`;
	}, nodo);

	function alSalir() {
		cancelar();
		nodo.style.transition = 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)';
		nodo.style.transform = '';
	}

	nodo.addEventListener('pointermove', alMover, { passive: true });
	nodo.addEventListener('pointerleave', alSalir);
	return {
		destroy() {
			nodo.removeEventListener('pointermove', alMover);
			nodo.removeEventListener('pointerleave', alSalir);
			cancelar();
		}
	};
};
