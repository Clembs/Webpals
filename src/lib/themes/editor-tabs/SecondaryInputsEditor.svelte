<script lang="ts">
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<h3>Colors</h3>

	<ColorPicker
		label="Background color"
		name="secondary_inputs.color_background"
		bind:hex={theme.secondary_inputs.color_background}
	/>
	<ColorPicker
		label="Text & icons color"
		name="secondary_inputs.color_on_background"
		bind:hex={theme.secondary_inputs.color_on_background}
	/>

	<h3>Border</h3>

	<ColorPicker
		label="Border color"
		name="secondary_inputs.border.color"
		bind:hex={theme.secondary_inputs.border.color}
	/>

	<label for="secondary_inputs.border.width">
		Corner radius (synced with all controls)

		<input
			type="range"
			name="secondary_inputs.border.radius"
			bind:value={theme.secondary_inputs.border.radius}
			min="0"
			max="3"
			step="0.125"
		/>
	</label>

	<label for="secondary_inputs.border.width">
		Border width (synced with all controls)

		<input
			type="range"
			name="secondary_inputs.border.width"
			bind:value={theme.secondary_inputs.border.width}
			min="0"
			max="10"
		/>
	</label>
</section>
