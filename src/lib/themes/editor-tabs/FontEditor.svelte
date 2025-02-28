<script lang="ts">
	import Tabs from '$lib/components/Tabs.svelte';
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
			{ value: 'heading', label: 'Titles and labels' },
			{ value: 'paragraph', label: 'Content text' }
		]}
	/>

	<h3>Style</h3>

	<!-- TODO: use a clean radio menu instead of a select menu -->
	{#if currentlyEditing === 'heading'}
		<select bind:value={theme.font.style_heading}>
			{#each fontStyles as { value, label }}
				<option {value}>{label}</option>
			{/each}
		</select>
	{:else if currentlyEditing === 'paragraph'}
		<select bind:value={theme.font.style_paragraph}>
			{#each fontStyles as { value, label }}
				<option {value}>{label}</option>
			{/each}
		</select>
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
