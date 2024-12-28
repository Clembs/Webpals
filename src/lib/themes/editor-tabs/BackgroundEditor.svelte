<script lang="ts">
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<!-- <div>
		<label for="color">
			<input
				type="radio"
				id="color"
				name="background-type"
				value="color"
				bind:group={theme.background.type}
			/>
			Color
		</label>

		<label for="gradient">
			<input
				type="radio"
				id="gradient"
				name="background-type"
				value="gradient"
				bind:group={theme.background.type}
			/>
			Gradient
		</label>

		<label for="image">
			<input
				type="radio"
				id="image"
				name="background-type"
				value="image"
				bind:group={theme.background.type}
			/>

			Image</label
		>
	</div> -->

	{#if theme.background.type === 'color'}
		<ColorPicker bind:hex={theme.background.color} label="Background color" />
	{/if}
</section>
