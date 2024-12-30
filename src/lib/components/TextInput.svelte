<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

	let {
		label,
		error,
		name,
		required = true,
		multiline = false,
		prefixIcon,
		suffixButton,
		value = $bindable(''),
		...restProps
	}: HTMLInputAttributes &
		HTMLTextareaAttributes & {
			name: string;
			label?: string;
			error?: string;
			value?: string;
			multiline?: boolean;
			prefixIcon?: Snippet<[number]>;
			suffixButton?: Snippet;
		} = $props();
</script>

<label class="text-input" for={name}>
	{#if label}
		<div class="label-text">
			{label}
		</div>
	{/if}

	<div class="input" class:error>
		{#if prefixIcon}
			<div class="prefix-icon">
				{@render prefixIcon(24)}
			</div>
		{/if}
		{#if !multiline}
			<input id={name} {name} {required} {...restProps} bind:value />
		{:else}
			<textarea id={name} {name} {required} {...restProps} bind:value></textarea>
		{/if}
		{#if suffixButton}
			<div class="suffix-button">
				{@render suffixButton()}
			</div>
		{/if}
	</div>

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
		display: flex;
		flex-direction: column;
		width: 100%;
		position: relative;

		.label-text,
		.error {
			font-weight: 600;
			font-size: 0.815rem;
			margin-left: calc(var(--base-padding) * 0.25);
			margin-bottom: calc(var(--base-gap) * 0.5);
		}

		.input {
			display: flex;
			align-items: center;
			border: var(--inputs-border-width) solid var(--inputs-border-color);
			border-radius: var(--inputs-border-base-radius);

			&.error {
				border-color: var(--color-urgent);
				outline: var(--inputs-border-width) solid var(--color-urgent);
			}

			.prefix-icon {
				display: grid;
				place-items: center;
				padding: calc(var(--base-padding) * 0.5);
				border-radius: var(--inputs-border-base-radius) 0 0 var(--inputs-border-base-radius);
				border-right: var(--inputs-border-width) solid var(--inputs-border-color);
				background-color: var(--widgets-background-color-dim);
				color: var(--inputs-on-background-color);
				height: calc(var(--base-padding) * 3);
				width: calc(var(--base-padding) * 3);
			}

			.suffix-button {
				position: absolute;
				right: 0;
			}

			input,
			textarea {
				padding: calc(var(--base-padding) * 0.75) var(--base-padding);
				border-radius: var(--inputs-border-base-radius);
				width: 100%;
				border: transparent;
				background-color: var(--color-input);
				font-weight: 400;
			}

			.prefix-icon + input {
				border-radius: 0 var(--inputs-border-base-radius) var(--inputs-border-base-radius) 0;
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
