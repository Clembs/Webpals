<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		required = true,
		name,
		checked = $bindable(false),
		onchange,
		children,
		...restProps
	}: {
		checked?: boolean;
		required?: boolean;
		name: string;
		onchange?: (
			event: Event & {
				currentTarget: HTMLInputElement;
			}
		) => void;
		children?: Snippet;
	} & HTMLInputAttributes = $props();
</script>

<input
	bind:checked
	{onchange}
	{required}
	id={name}
	{name}
	type="checkbox"
	role="switch"
	{...restProps}
/>

<style lang="scss">
	input {
		--thumb-size: 1.75rem;
		--thumb-color: var(--inputs-on-background-color);
		--track-size: calc(var(--thumb-size) * 1.75);
		--track-padding: calc(var(--base-padding) * 0.25);
		--thumb-position: 0%;
		cursor: pointer;

		appearance: none;
		touch-action: pan-y;
		box-sizing: content-box;

		inline-size: var(--track-size);
		block-size: var(--thumb-size);
		border-radius: var(--track-size);

		background: var(--inputs-background-color);
		border: var(--inputs-border-width) solid var(--buttons-primary-border-color);
		padding: var(--track-padding);
		border-radius: calc(var(--inputs-border-base-radius) + var(--track-padding));

		flex-shrink: 0;
		display: grid;
		align-items: center;
		grid: [track] 1fr / [track] 1fr;

		// the thumb
		&::before {
			content: '';
			cursor: inherit;
			pointer-events: auto;
			grid-area: track;
			inline-size: var(--thumb-size);
			block-size: var(--thumb-size);
			border-radius: var(--inputs-border-base-radius);
			background-color: var(--thumb-color);
			outline: 1px solid var(--color-outline);

			transform: translateX(var(--thumb-position));
			scale: 0.75;

			transition:
				transform 200ms ease,
				scale 200ms ease;
		}

		&:disabled {
			opacity: 0.315;
			cursor: not-allowed;
		}

		&:checked {
			--thumb-position: calc(var(--track-size) - 100%);
			--thumb-color: var(--inputs-background-color);
			background: var(--buttons-primary-background-color);

			&::before {
				scale: 1;
			}
		}
	}
</style>
