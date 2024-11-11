<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	let {
		type = 'button',
		variant = 'primary',
		href,
		disabled = false,
		inline = false,
		icon = false,
		size = 'medium',
		children,
		onclick,
		...restProps
	}: (HTMLButtonAttributes | HTMLAnchorAttributes) & {
		type?: 'submit' | 'button';
		variant?: 'primary' | 'secondary';
		href?: string;
		disabled?: boolean;
		icon?: boolean;
		inline?: boolean;
		size?: 'small' | 'medium';
		children: Snippet;
		onclick?: () => void;
	} = $props();
</script>

{#if href}
	<a
		class:inline
		class:icon
		class="{variant} {size}"
		{href}
		aria-disabled={disabled}
		{...restProps as HTMLAnchorAttributes}
	>
		{@render children()}
	</a>
{:else}
	<button
		class:inline
		class:icon
		class="{variant} {size}"
		{onclick}
		{type}
		{disabled}
		{...restProps as HTMLButtonAttributes}
	>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	a,
	button {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);

		padding: calc(var(--base-padding) * 0.75) var(--base-padding);
		border-radius: var(--inputs-border-base-radius);

		text-align: center;
		justify-content: center;
		width: 100%;
		height: max-content;

		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		user-select: none;

		&.icon {
			display: grid;
			place-items: center;
			padding: calc(var(--base-padding) * 0.75);
		}

		&.inline {
			display: inline-flex;
			width: max-content;
		}

		&.primary {
			background-color: var(--buttons-primary-background-color);
			color: var(--buttons-primary-on-background-color);
			border: var(--inputs-border-width) solid var(--buttons-primary-background-color);

			&:hover {
				opacity: 0.815;
			}
		}

		&.secondary {
			background-color: var(--inputs-background-color);
			color: var(--inputs-on-background-color);
			border: var(--inputs-border-width) solid var(--inputs-border-color);

			&:hover {
				background-color: var(--widgets-background-color-dim);
			}
		}

		&.small {
			font-size: 15px;
			border-radius: calc(var(--inputs-border-base-radius) * 3);
			padding: calc(var(--base-padding) * 0.5) calc(var(--base-padding) * 0.75);
		}

		&:disabled,
		&[aria-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
