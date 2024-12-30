<script lang="ts">
	import type { Theme } from '../types';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<label for="spacing.padding">
		Base padding

		<input
			name="spacing.padding"
			type="range"
			bind:value={theme.spacing.padding}
			min="0.25"
			max="2"
			step="0.125"
		/>
	</label>

	<label for="spacing.gap">
		Base spacing between elements

		<input
			name="spacing.gap"
			type="range"
			bind:value={theme.spacing.gap}
			min="0.25"
			max="2"
			step="0.125"
		/>
	</label>
</section>
