<script lang="ts">
	import { Globe } from 'phosphor-svelte';
	import BasePlaceholderWidget from './BasePlaceholderWidget.svelte';

	let { showPicker = $bindable(false) } = $props();
</script>

<BasePlaceholderWidget bind:showPicker widget-id="clock">
	<div class="clock">
		<time>
			<span class="time-string"> 2:34 </span>
			<span class="day-period">PM</span>
		</time>

		<div class="region">
			<Globe />

			<span class="city-country"> Toulouse, France </span>
		</div>
	</div>

	<!-- <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" /> -->
</BasePlaceholderWidget>

<style lang="scss">
	.clock {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);
		align-items: center;

		time {
			color: var(--color-heading);

			.time-string {
				font-size: 3.25rem;
				letter-spacing: -0.05em;
				font-family: 'JetBrains Mono', monospace;
				margin-right: 0.1em;
			}

			.day-period {
				font-weight: 700;
				font-size: 1.25rem;
			}
		}

		.region {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;
			color: var(--color-heading);
		}
	}
</style>
