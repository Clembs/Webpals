<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	let {
		buttons
	}: {
		buttons: ({
			icon: Snippet;
		} & (HTMLAnchorAttributes | HTMLButtonAttributes))[];
	} = $props();
</script>

<div class="button-group">
	{#each buttons as { icon, ...attributes }}
		{#if 'href' in attributes}
			<a href={attributes.href} target="_blank" rel="noopener noreferrer" {...attributes}>
				{@render icon()}
			</a>
		{:else}
			{@const buttonAttributes = attributes as HTMLButtonAttributes}
			<button type="button" {...buttonAttributes}>
				{@render icon()}
			</button>
		{/if}
	{/each}
</div>

<style lang="scss">
	.button-group {
		display: flex;
		border-radius: var(--inputs-border-base-radius);
		background-color: var(--widgets-background-color-dim);
		border: var(--inputs-border-width) solid var(--inputs-border-color);
		height: fit-content;
		flex-shrink: 0;

		a,
		button {
			--border-radius: calc(var(--inputs-border-base-radius) + var(--inputs-border-width));

			display: grid;
			place-items: center;
			padding: calc(var(--base-padding) * 0.5);
			border: none;
			background-color: transparent;
			color: var(--widgets-text-color);
			cursor: pointer;

			&:hover {
				filter: brightness(0.9);
			}

			&:not(:last-child) {
				border-right: var(--inputs-border-width) solid var(--inputs-border-color);
			}

			&:first-child {
				border-radius: var(--border-radius) 0 0 var(--border-radius);
			}

			&:last-child {
				border-radius: 0 var(--border-radius) var(--border-radius) 0;
			}
		}
	}
</style>
