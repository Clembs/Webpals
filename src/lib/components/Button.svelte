<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

	let {
		type,
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
		variant?: 'primary' | 'secondary' | 'success' | 'urgent';
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
		target={href.startsWith('http') ? '_blank' : undefined}
		rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
			flex-shrink: 0;
		}

		&.primary {
			background-color: var(--buttons-primary-background-color);
			color: var(--buttons-primary-on-background-color);
			border: var(--inputs-border-width) solid var(--buttons-primary-background-color);

			&:hover {
				filter: brightness(0.95);
				// opacity: 0.815;
			}
		}

		&.secondary {
			background-color: transparent;
			// background-color: var(--inputs-background-color);
			color: var(--inputs-on-background-color);
			border: var(--inputs-border-width) solid var(--inputs-border-color);

			&:hover {
				backdrop-filter: brightness(0.9);
				// background-color: var(--widgets-background-color-dim);
			}
		}

		&.success {
			background-color: var(--color-success);
			color: var(--background);
			border: var(--inputs-border-width) solid var(--color-success);

			&:hover {
				opacity: 0.75;
			}
		}

		&.urgent {
			background-color: var(--color-urgent);
			color: var(--widgets-background-color);
			border: var(--inputs-border-width) solid var(--color-urgent);

			&:hover {
				opacity: 0.75;
			}
		}

		&.small {
			font-size: 15px;
			border-radius: calc(var(--inputs-border-base-radius) * 3);
			padding: calc(var(--base-padding) * 0.5) calc(var(--base-padding) * 0.75);

			&.icon {
				padding: calc(var(--base-padding) * 0.5);
			}
		}

		&:disabled,
		&[aria-disabled='true'] {
			opacity: 0.5;
			cursor: not-allowed;

			&:hover {
				opacity: 0.5;
			}
		}
	}
</style>
