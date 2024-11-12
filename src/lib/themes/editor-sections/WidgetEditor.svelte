<script lang="ts">
	import { CardsThree, CaretDown } from 'phosphor-svelte';
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<details name="theming">
		<summary>
			<h2>
				<CardsThree />
				Widgets
			</h2>

			<CaretDown class="arrow-icon" weight="regular" />
		</summary>

		<ColorPicker bind:hex={theme.widgets.color_background} label="Widgets background color" />

		<ColorPicker bind:hex={theme.widgets.border.color} label="Border color" />
		<label for="widgets-border-width">
			Border width
			<input type="range" bind:value={theme.widgets.border.width} min="0" max="10" />
		</label>
		<label for="border-radius">
			Border radius
			<input type="range" bind:value={theme.widgets.border.radius} min="0" max="5" />
		</label>
	</details>
</section>
