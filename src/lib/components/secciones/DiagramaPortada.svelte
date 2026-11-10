<script lang="ts">
	import { inclinar } from '$lib/acciones/interaccion';

	/*
	 * Ilustración del asistente de Telegram: un disparador, un agente con sus
	 * herramientas colgando y una salida. Los pulsos viajan por las aristas con SMIL
	 * (`animateMotion`), así que se mueven sin JavaScript desde el primer pintado.
	 */
	interface Nodo {
		id: string;
		x: number;
		y: number;
		w: number;
		h: number;
		titulo: string;
		sub: string;
		tono: 'acento' | 'neutro' | 'ia';
	}

	const NODOS: Nodo[] = [
		{
			id: 'ws',
			x: 14,
			y: 128,
			w: 132,
			h: 60,
			titulo: 'Workspace',
			sub: 'Webhook Gasto',
			tono: 'acento'
		},
		{
			id: 'ag',
			x: 186,
			y: 116,
			w: 148,
			h: 84,
			titulo: 'RPA Bancario',
			sub: 'n8n · Estado',
			tono: 'ia'
		},
		{
			id: 'rs',
			x: 374,
			y: 128,
			w: 132,
			h: 60,
			titulo: 'Google Sheets',
			sub: 'Conciliación',
			tono: 'acento'
		},
		{ id: 'md', x: 84, y: 286, w: 108, h: 48, titulo: 'Gemini 3.5', sub: 'Agente IA', tono: 'neutro' },
		{
			id: 'me',
			x: 206,
			y: 304,
			w: 108,
			h: 48,
			titulo: 'Evolution API',
			sub: 'WhatsApp',
			tono: 'neutro'
		},
		{ id: 'ca', x: 328, y: 286, w: 108, h: 48, titulo: 'Gmail API', sub: 'OTP Regex', tono: 'neutro' }
	];

	// Aristas principales (datos) y de configuración IA (discontinuas).
	const PRINCIPALES = [
		{ id: 'a1', d: 'M146 158 C 166 158, 166 158, 186 158', dur: '1.6s', retraso: '0s' },
		{ id: 'a2', d: 'M334 158 C 354 158, 354 158, 374 158', dur: '1.6s', retraso: '0.8s' }
	];
	const IA = [
		{ id: 'b1', d: 'M138 286 C 138 240, 230 240, 230 200' },
		{ id: 'b2', d: 'M260 304 C 260 260, 260 240, 260 200' },
		{ id: 'b3', d: 'M382 286 C 382 240, 290 240, 290 200' }
	];
</script>

<div
	use:inclinar={5}
	class="relative w-full [transform-style:preserve-3d]"
	role="img"
	aria-label="Ilustración del flujo de conciliación bancaria: un webhook desde Google Workspace Studio activa el agente RPA en n8n con Gemini, Evolution API y Gmail OTP, y actualiza el saldo en Google Sheets."
>
	<!-- Halo detrás de la ventana -->
	<div
		aria-hidden="true"
		class="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-acento-400)_22%,transparent),transparent)] blur-2xl"
	></div>

	<div class="vidrio brillo-superior overflow-hidden rounded-3xl border border-borde-fuerte/80">
		<!-- Barra de ventana -->
		<div class="flex items-center justify-between border-b border-borde px-4 py-3">
			<div class="flex items-center gap-1.5">
				<span class="size-2.5 rounded-full bg-[#ff5f57]/80"></span>
				<span class="size-2.5 rounded-full bg-[#febc2e]/80"></span>
				<span class="size-2.5 rounded-full bg-[#28c840]/80"></span>
			</div>
			<span class="font-mono text-[11px] text-tinta-tenue">rpa-bancario.json</span>
			<span
				class="inline-flex items-center gap-1.5 rounded-full bg-acento-400/10 px-2 py-0.5 font-mono text-[10px] text-acento-300"
			>
				<span class="latido relative size-1.5 rounded-full bg-acento-400"></span>
				activo
			</span>
		</div>

		<div class="reticula relative">
			<svg viewBox="0 0 520 380" class="block h-auto w-full" aria-hidden="true">
				<defs>
					<linearGradient id="dp-arista" x1="0" x2="1">
						<stop offset="0" stop-color="var(--color-acento-400)" />
						<stop offset="1" stop-color="var(--color-cian-400)" />
					</linearGradient>
					<radialGradient id="dp-pulso">
						<stop offset="0" stop-color="#fff" />
						<stop offset="0.35" stop-color="var(--color-acento-300)" />
						<stop offset="1" stop-color="var(--color-acento-400)" stop-opacity="0" />
					</radialGradient>
				</defs>

				{#each IA as arista (arista.id)}
					<path
						id="dp-{arista.id}"
						d={arista.d}
						fill="none"
						stroke="var(--color-borde-fuerte)"
						stroke-width="1.5"
						stroke-dasharray="4 5"
						class="flujo-ia"
					/>
				{/each}

				{#each PRINCIPALES as arista (arista.id)}
					<path
						id="dp-{arista.id}"
						d={arista.d}
						fill="none"
						stroke="url(#dp-arista)"
						stroke-width="2"
					/>
					<circle r="7" fill="url(#dp-pulso)" class="pulso">
						<animateMotion
							dur={arista.dur}
							begin={arista.retraso}
							repeatCount="indefinite"
							keyPoints="0;1"
							keyTimes="0;1"
							calcMode="spline"
							keySplines="0.4 0 0.2 1"
						>
							<mpath href="#dp-{arista.id}" />
						</animateMotion>
					</circle>
				{/each}

				{#each NODOS as n, i (n.id)}
					<g class="nodo" style="--d: {300 + i * 90}ms">
						<rect
							x={n.x}
							y={n.y}
							width={n.w}
							height={n.h}
							rx="12"
							fill="var(--color-superficie)"
							stroke={n.tono === 'neutro'
								? 'var(--color-borde-fuerte)'
								: n.tono === 'ia'
									? 'url(#dp-arista)'
									: 'color-mix(in oklab, var(--color-acento-400) 55%, transparent)'}
							stroke-width={n.tono === 'ia' ? 1.6 : 1}
						/>
						{#if n.tono === 'ia'}
							<rect
								x={n.x + 12}
								y={n.y + 14}
								width="26"
								height="26"
								rx="7"
								fill="color-mix(in oklab, var(--color-acento-400) 14%, transparent)"
							/>
							<path
								d="M{n.x + 25} {n.y +
									19} l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z"
								fill="var(--color-acento-300)"
								class="chispa"
							/>
						{/if}
						<text
							x={n.tono === 'ia' ? n.x + 46 : n.x + 14}
							y={n.tono === 'ia' ? n.y + 27 : n.y + (n.h > 50 ? 26 : 21)}
							fill="var(--color-tinta)"
							font-family="var(--font-sans)"
							font-size={n.tono === 'neutro' ? 12 : 14}
							font-weight="500">{n.titulo}</text
						>
						<text
							x={n.tono === 'ia' ? n.x + 46 : n.x + 14}
							y={n.tono === 'ia' ? n.y + 43 : n.y + (n.h > 50 ? 43 : 36)}
							fill="var(--color-tinta-tenue)"
							font-family="var(--font-mono)"
							font-size="9.5"
							letter-spacing="0.08em">{n.sub.toUpperCase()}</text
						>
						{#if n.tono === 'ia'}
							<rect
								x={n.x + 12}
								y={n.y + 58}
								width={n.w - 24}
								height="4"
								rx="2"
								fill="var(--color-borde)"
							/>
							<rect
								x={n.x + 12}
								y={n.y + 58}
								width={n.w - 24}
								height="4"
								rx="2"
								fill="url(#dp-arista)"
								class="carga"
							/>
						{/if}
					</g>
				{/each}
			</svg>

			<!-- Toast de ejecución -->
			<div
				class="toast absolute top-4 left-4 flex items-center gap-2 rounded-xl border border-borde bg-fondo/95 px-3 py-2 font-mono text-[11px] text-tinta-suave shadow-2xl"
			>
				<span class="grid size-4 place-items-center rounded-full bg-acento-400 text-fondo">
					<svg viewBox="0 0 12 12" class="size-2.5" aria-hidden="true"
						><path
							d="M2.5 6.2 5 8.5l4.5-5"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/></svg
					>
				</span>
				Saldo conciliado
				<span class="text-tinta-tenue">· Tablero!B10</span>
			</div>
		</div>
	</div>
</div>

<style>
	.nodo {
		animation: aparecer-nodo 900ms cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: var(--d);
		transform-box: fill-box;
		transform-origin: center;
	}

	@keyframes aparecer-nodo {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.92);
		}
	}

	.flujo-ia {
		animation: correr 1.2s linear infinite;
	}

	@keyframes correr {
		to {
			stroke-dashoffset: -18;
		}
	}

	.carga {
		transform-box: fill-box;
		transform-origin: left;
		animation: cargar 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
	}

	@keyframes cargar {
		0% {
			transform: scaleX(0);
		}
		60%,
		100% {
			transform: scaleX(1);
			opacity: 0;
		}
		55% {
			opacity: 1;
		}
	}

	.chispa {
		transform-box: fill-box;
		transform-origin: center;
		animation: girar 6s linear infinite;
	}

	@keyframes girar {
		to {
			transform: rotate(360deg);
		}
	}

	.toast {
		animation: toast 4.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
		animation-delay: 1.2s;
	}

	@keyframes toast {
		0%,
		8% {
			opacity: 0;
			transform: translateY(10px) scale(0.96);
		}
		16%,
		80% {
			opacity: 1;
			transform: none;
		}
		92%,
		100% {
			opacity: 0;
			transform: translateY(-4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pulso {
			display: none;
		}
		.toast {
			animation: none;
		}
	}
</style>
