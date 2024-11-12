<script lang="ts">
	import { ArrowsOutLineHorizontal, CaretDown } from 'phosphor-svelte';
	import type { Theme } from '../types';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<details name="theming">
		<summary>
			<h2>
				<ArrowsOutLineHorizontal />
				Spacing
			</h2>

			<CaretDown class="arrow-icon" weight="regular" />
		</summary>

		<label for="padding">
			Base padding

			<input type="range" bind:value={theme.spacing.padding} min="0.25" max="3" step="0.125" />
		</label>

		<label for="padding">
			Base spacing between elements

			<input type="range" bind:value={theme.spacing.gap} min="0.25" max="3" step="0.125" />
		</label>
	</details>
</section>
