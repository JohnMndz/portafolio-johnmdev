<script lang="ts">
	interface Props {
		titulo: string;
		class?: string;
	}

	let { titulo, class: klass = '' }: Props = $props();
</script>

<!--
	Placeholder mientras no exista la captura real del canvas: simula la retícula y
	los nodos de n8n para que la tarjeta nunca se vea rota ni vacía.
-->
<div
	class="reticula relative flex aspect-video w-full items-center justify-center bg-elevado {klass}"
	role="img"
	aria-label="Captura pendiente del flujo {titulo}"
>
	<div class="flex items-center gap-2 opacity-60 sm:gap-3">
		<span class="h-7 w-14 rounded-md border border-borde-fuerte bg-superficie sm:h-9 sm:w-20"
		></span>
		<span class="h-px w-4 bg-borde-fuerte sm:w-6"></span>
		<span class="h-7 w-14 rounded-md border border-acento-600/60 bg-superficie sm:h-9 sm:w-20"
		></span>
		<span class="h-px w-4 bg-borde-fuerte sm:w-6"></span>
		<span class="h-7 w-14 rounded-md border border-borde-fuerte bg-superficie sm:h-9 sm:w-20"
		></span>
	</div>
	<span class="absolute bottom-3 font-mono text-[10px] tracking-[0.2em] text-tinta-tenue uppercase">
		Captura pendiente
	</span>
</div>
