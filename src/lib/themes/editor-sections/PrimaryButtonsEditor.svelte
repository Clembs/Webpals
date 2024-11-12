<script lang="ts">
	import { CaretDown, Rectangle } from 'phosphor-svelte';
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<details name="theming">
		<summary>
			<h2>
				<Rectangle />
				Primary buttons
			</h2>

			<CaretDown class="arrow-icon" weight="regular" />
		</summary>

		<ColorPicker
			bind:hex={theme.primary_buttons.color_background}
			label="Primary buttons background"
		/>
		<ColorPicker
			bind:hex={theme.primary_buttons.color_on_background}
			label="Primary buttons text"
		/>
		{#if theme.primary_buttons.border}
			<ColorPicker
				bind:hex={theme.primary_buttons.border.color}
				label="Primary buttons border color"
			/>
			<input type="range" bind:value={theme.primary_buttons.border.width} min="0" max="10" />
		{/if}
	</details>
</section>
