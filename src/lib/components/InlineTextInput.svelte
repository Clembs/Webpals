<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

	let {
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
			name: string;
			error?: string;
			value?: string;
			'font-size'?: string;
			multiline?: boolean;
		} = $props();
</script>

<label class="text-input" class:error for={name}>
	{#if !multiline}
		<input
			style:--font-size={fontSize}
			{type}
			id={name}
			{name}
			{required}
			{...restProps}
			bind:value
		/>
	{:else}
		<textarea style:--font-size={fontSize} id={name} {name} {required} {...restProps} bind:value
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
</label>

<style lang="scss">
	.text-input {
		display: inline-flex;
		flex-direction: column;

		.label-text,
		.error {
			font-weight: 600;
			font-size: 0.815rem;
		}

		input,
		textarea {
			border: none;
			border-bottom: 1px solid var(--inputs-border-color);
			outline: none;
			font-size: var(--font-size, inherit);
			font-weight: 500;
			color: inherit;
			width: 100%;

			&.error {
				border-bottom-color: #e90000;
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
			color: #e90000;
		}
	}
</style>
