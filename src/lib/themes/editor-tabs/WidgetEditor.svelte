<script lang="ts">
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<h3>Colors</h3>

	<ColorPicker
		label="Background color"
		name="widgets.color_background"
		bind:hex={theme.widgets.color_background}
	/>

	<ColorPicker
		label="Background color (dimmed)"
		name="widgets.color_background_dim"
		bind:hex={theme.widgets.color_background_dim}
	/>

	<label for="widgets.border.radius">
		Background blur

		<input
			name="widgets.background_blur"
			type="range"
			bind:value={theme.widgets.background_blur}
			min="0"
			max="10"
			step="0.5"
		/>

		<span class="subtext">
			Pro tip: Lower the widget's background opacity to make the blur effect more visible.
		</span>
	</label>

	<h3>Border</h3>

	<ColorPicker
		name="widgets.border.color"
		label="Border color"
		bind:hex={theme.widgets.border.color}
	/>

	<label for="widgets.border.radius">
		Corner radius

		<input
			name="widgets.border.radius"
			type="range"
			bind:value={theme.widgets.border.radius}
			min="0"
			max="3"
			step="0.125"
		/>
	</label>

	<label for="widgets.border.width">
		Border width
		<input
			name="widgets.border.width"
			type="range"
			bind:value={theme.widgets.border.width}
			min="0"
			max="10"
		/>
	</label>
</section>
