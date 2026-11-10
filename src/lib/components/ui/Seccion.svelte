<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		children: Snippet;
		class?: string;
	}

	let { id, children, class: klass = '' }: Props = $props();
</script>

<section {id} class="relative scroll-mt-24 py-24 sm:py-32 {klass}">
	<div class="mx-auto w-full max-w-6xl px-6">
		{@render children()}
	</div>
</section>
