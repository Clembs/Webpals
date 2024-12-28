<script lang="ts">
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<ColorPicker
		bind:hex={theme.primary_buttons.color_background}
		label="Primary buttons background"
	/>
	<!-- <ColorPicker bind:hex={theme.primary_buttons.color_on_background} label="Primary buttons text" /> -->
	<!-- {#if theme.primary_buttons.border}
		<ColorPicker
			bind:hex={theme.primary_buttons.border.color}
			label="Primary buttons border color"
		/>
		<input type="range" bind:value={theme.primary_buttons.border.width} min="0" max="10" />
	{/if} -->
</section>
