<script lang="ts">
	import type { Theme } from './types';
	import { slide } from 'svelte/transition';
	import { Palette } from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import BackgroundEditor from './editor-sections/BackgroundEditor.svelte';
	import WidgetEditor from './editor-sections/WidgetEditor.svelte';
	import SpacingEditor from './editor-sections/SpacingEditor.svelte';
	import './theme-editor.scss';
	import PrimaryButtonsEditor from './editor-sections/PrimaryButtonsEditor.svelte';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<aside id="theme-editor" transition:slide={{ axis: 'x' }}>
	<div class="header">
		<Palette size={30} />

		<h1>Theme</h1>
	</div>

	<BackgroundEditor bind:theme />

	<WidgetEditor bind:theme />

	<SpacingEditor bind:theme />

	<PrimaryButtonsEditor bind:theme />
</aside>

<style lang="scss">
	#theme-editor {
		background-color: white;
		width: 400px;
		display: flex;
		flex-direction: column;
		overflow-y: auto;

		.header {
			display: flex;
			align-items: center;
			padding: var(--base-padding);
			gap: calc(var(--base-gap) * 0.5);
		}
	}
</style>
