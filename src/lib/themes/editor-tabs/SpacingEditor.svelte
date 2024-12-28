<script lang="ts">
	import type { Theme } from '../types';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<label for="padding">
		Base padding

		<input type="range" bind:value={theme.spacing.padding} min="0.125" max="2" step="0.125" />
	</label>

	<label for="padding">
		Base spacing between elements

		<input type="range" bind:value={theme.spacing.gap} min="0.125" max="2" step="0.125" />
	</label>
</section>
