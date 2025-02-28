<script lang="ts">
	import Tabs from '$lib/components/Tabs.svelte';
	import { CheckCircle } from 'phosphor-svelte';
	import { fontStyles } from '../theme-structure';
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();

	let currentlyEditing = $state<'heading' | 'paragraph'>('heading');
</script>

<section>
	<Tabs
		name="currentlyEditing"
		bind:selectedTab={currentlyEditing}
		tabs={[
			{ value: 'paragraph', label: 'Content text' },
			{ value: 'heading', label: 'Titles and labels' }
		]}
	/>

	<h3>Style</h3>

	{#if currentlyEditing === 'heading'}
		<ul class="styles-picker">
			{#each fontStyles as { value, label }}
				<li>
					<input
						type="radio"
						id={value}
						name="font.style_heading"
						{value}
						bind:group={theme.font.style_heading}
					/>
					<label style="--font: {value}" for={value}>
						{label}
					</label>
					{#if value === theme.font.style_heading}
						<div class="selected-mark" aria-hidden="true">
							<CheckCircle size={20} />
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{:else if currentlyEditing === 'paragraph'}
		<ul class="styles-picker">
			{#each fontStyles as { value, label }}
				<li>
					<input
						type="radio"
						id={value}
						name="font.style_heading"
						{value}
						bind:group={theme.font.style_paragraph}
					/>
					<label style="--font: {value}" for={value}>
						{label}
					</label>
					{#if value === theme.font.style_paragraph}
						<div class="selected-mark" aria-hidden="true">
							<CheckCircle size={20} />
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	<h3>Color</h3>

	{#if currentlyEditing === 'heading'}
		<ColorPicker
			isDialog={false}
			label="Headings color"
			name="font.color_heading"
			bind:hex={theme.font.color_heading}
		/>
	{:else if currentlyEditing === 'paragraph'}
		<ColorPicker
			isDialog={false}
			label="Paragraphs color"
			name="font.color_paragraph"
			bind:hex={theme.font.color_paragraph}
		/>
	{/if}
</section>

<style lang="scss">
	.styles-picker {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
		gap: calc(var(--base-gap) * 0.5);
		list-style: none;

		li {
			position: relative;
			color: var(--inputs-on-background-color);

			input {
				position: absolute;
				top: -1000px;
				left: -1000px;

				&:checked + label {
					border: 2px solid var(--buttons-primary-border-color);
				}
			}

			label {
				display: grid;
				place-items: center;
				background-color: var(--widgets-background-color-dim);
				padding: var(--base-padding) calc(var(--base-padding) * 0.75);
				border-radius: calc(var(--widgets-border-base-radius) * 0.75);
				cursor: pointer;
				text-align: center;
				font-family: var(--font);
				width: 100%;
				border: 2px solid transparent;

				&:hover {
					filter: brightness(0.95);
				}
			}
			.selected-mark {
				position: absolute;
				bottom: calc(var(--base-gap) * 0.25);
				right: calc(var(--base-gap) * 0.25);
			}
		}
	}
</style>
