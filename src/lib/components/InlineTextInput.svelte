<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

	let {
		ref = $bindable(),
		type,
		error,
		name,
		required = true,
		multiline = false,
		'font-size': fontSize,
		value = $bindable(''),
		...restProps
	}: HTMLInputAttributes &
		HTMLTextareaAttributes & {
			ref?: HTMLInputElement | HTMLTextAreaElement;
			name: string;
			error?: string;
			value?: string;
			'font-size'?: string;
			multiline?: boolean;
		} = $props();
</script>

<div class="text-input" class:error>
	{#if !multiline}
		<input
			bind:this={ref}
			style:--font-size={fontSize}
			{type}
			id={name}
			{name}
			{required}
			{...restProps}
			bind:value
		/>
	{:else}
		<textarea
			style:--font-size={fontSize}
			bind:this={ref}
			id={name}
			{name}
			{required}
			{...restProps}
			bind:value
		></textarea>
	{/if}

	{#if error || restProps.maxlength}
		<div class="bottom">
			{#if error}
				<p class="error">{error}</p>
			{/if}

			<!-- Whitespace char to always align the max length to the right -->
			&nbsp;

			{#if restProps.maxlength}
				<p>
					{value.length}/{restProps.maxlength.toLocaleString()}
				</p>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.text-input {
		display: inline-flex;
		flex-direction: column;
		max-width: fit-content;

		.label-text,
		.error {
			font-weight: 600;
			font-size: 0.815rem;
		}

		input,
		textarea {
			border: none;
			// border-bottom: var(--inputs-border-width) solid var(--inputs-border-color);
			text-decoration: underline var(--inputs-border-color) var(--inputs-border-width);
			outline: none;
			font-size: var(--font-size, inherit);
			font-weight: 500;
			color: inherit;
			width: 100%;
			background-color: transparent;

			&.error {
				border-bottom-color: var(--color-urgent);
			}

			&:focus-visible {
				border-bottom-color: var(--buttons-primary-border-color);
			}
		}

		.bottom {
			display: flex;
			justify-content: space-between;
		}

		.error {
			color: var(--color-urgent);
		}
	}
</style>
