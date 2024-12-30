<script lang="ts">
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<h3>Colors</h3>

	<ColorPicker
		label="Headings color"
		name="font.color_heading"
		bind:hex={theme.font.color_heading}
	/>
	<ColorPicker
		label="Paragraphs color"
		name="font.color_paragraph"
		bind:hex={theme.font.color_paragraph}
	/>
</section>
