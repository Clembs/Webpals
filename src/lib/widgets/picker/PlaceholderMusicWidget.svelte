<script lang="ts">
	import { MusicNote } from 'phosphor-svelte';
	import BasePlaceholderWidget from './BasePlaceholderWidget.svelte';

	let { showPicker = $bindable(false) } = $props();
</script>

<BasePlaceholderWidget bind:showPicker widget-id="music">
	<div class="music-widget-heading">
		<MusicNote />
		<h3>Music <span class="subtext"> Artist </span></h3>
	</div>

	<!-- <AudioPlayer
  file="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  type="audio/mpeg"
/> -->
</BasePlaceholderWidget>

<style lang="scss">
	.music-widget-heading {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
		align-items: center;

		.subtext {
			margin-left: calc(var(--base-gap) * 0.25);
		}
	}
</style>
