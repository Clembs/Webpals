<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		'min-width': minWidth,
		'max-width': maxWidth,
		children,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		'min-width'?: string;
		'max-width'?: string;
		children: Snippet;
	} = $props();
</script>

<div style:--min-width={minWidth} style:--max-width={maxWidth} {...props}>
	{@render children()}
</div>

<style lang="scss">
	@use '../../styles/mixins.scss';

	div {
		@include mixins.card;
	}
</style>
