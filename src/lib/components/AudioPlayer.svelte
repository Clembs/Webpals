<script lang="ts">
	import { Pause } from 'phosphor-svelte';

	let {
		file,
		type
	}: {
		file: string;
		type: string;
	} = $props();

	let audioEl: HTMLAudioElement | undefined = $state();
</script>

<!-- TODO: link this to the actual audio player -->
<div class="audio-player">
	<button class="toggle-playback">
		<Pause />
	</button>

	<input type="range" name="audio-track" />
</div>

<audio bind:this={audioEl} controls>
	<source src={file} {type} />
	Your browser does not support the audio element.
</audio>

<style lang="scss">
	.audio-player {
		background-color: var(--widgets-background-color-dim);
		padding: calc(var(--base-padding) * 0.25);
		// padding-left: calc(var(--base-padding) * 0.25);
		padding-right: calc(var(--base-padding) * 0.75);
		border-radius: var(--inputs-border-base-radius);

		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--base-gap);

		.toggle-playback {
			padding: calc(var(--base-padding) * 0.5);
			border: none;
			cursor: pointer;
			background: transparent;
		}

		[name='audio-track'] {
			--track-height: calc(var(--base-padding) * 0.25);
			--thumb-size: var(--base-padding);

			cursor: pointer;
			flex-grow: 1;
			background-color: var(--widgets-border-color);
			border-radius: 99px;
			height: var(--track-height);
			accent-color: black;

			&::-webkit-slider-thumb {
				appearance: none;
				height: var(--thumb-size);
				width: var(--thumb-size);
				border-radius: 99px;
				background-color: var(--widgets-background-color);
				border: 3px solid var(--buttons-primary-background-color);
				margin-top: calc(var(--track-height) * 0.5 - max(var(--thumb-size) * 0.5, 3px));
			}
			&::-webkit-slider-runnable-track {
				// background-color: var(--buttons-primary-background-color);
				border: none;
				height: var(--track-height);
				border-radius: 99px;
			}
			&::-moz-range-thumb {
				background-color: var(--widgets-background-color);
				border: 3px solid var(--buttons-primary-background-color);
				border-radius: 99px;
			}
			&::-moz-range-progress {
				background-color: var(--buttons-primary-background-color);
				border: none;
				height: calc(var(--track-height) * 1.25);
				border-radius: 99px;
			}
		}
	}

	// TODO: don't forget to remove this
	audio {
		display: none;
	}
</style>
