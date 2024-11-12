<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	let {
		'widget-id': widgetId,
		children,
		showPicker = $bindable(false)
	}: {
		'widget-id': string;
		children: Snippet;
		showPicker: boolean;
	} = $props();
</script>

<li class="placeholder-widget">
	<form
		use:enhance={() =>
			({ update }) => {
				showPicker = false;
				update();
			}}
		action="/api/profile?/addWidget&id={widgetId}"
		method="post"
	>
		<button class="widget-contents" type="submit">
			{@render children()}
		</button>
	</form>
</li>

<style lang="scss">
	.placeholder-widget {
		margin-bottom: var(--base-gap);
	}

	.widget-contents {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
		cursor: pointer;
		background: var(--widgets-background-color);
		border: var(--widgets-border-width) solid var(--widgets-border-color);
		border-radius: var(--widgets-border-base-radius);
		padding: var(--base-padding);
		text-align: left;
		width: 100%;
		user-select: none;

		& :global(> *) {
			pointer-events: none;
			// no focus
			outline: none;
		}

		&:hover {
			filter: brightness(0.9);
		}
	}
</style>
