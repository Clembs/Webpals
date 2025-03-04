<script lang="ts">
	import { Pause, Play, SpeakerHigh, SpeakerNone } from 'phosphor-svelte';
	import { AudioPlayer } from './headless.svelte';

	let {
		src,
		type,
		metadata
	}: {
		src: string;
		type: string;
		metadata?: MediaMetadataInit;
	} = $props();

	let audioEl = $state<HTMLAudioElement>();
	let rangeValue = $state(0);
	let currentTime = $state(0);
	let duration = $state(0);
	let muted = $state(false);
	let paused = $state(true);

	let audioPlayer = $derived(audioEl ? new AudioPlayer(audioEl, metadata) : undefined);
</script>

<div class="audio-player">
	<div class="buttons">
		<button type="button" onclick={() => audioPlayer?.togglePlayback()} class="toggle-playback">
			{#if paused}
				<Play />
			{:else}
				<Pause />
			{/if}
		</button>

		<button type="button" onclick={() => audioPlayer?.toggleMute()} class="mute">
			{#if muted}
				<SpeakerNone />
			{:else}
				<SpeakerHigh />
			{/if}
		</button>
	</div>

	<input
		onchange={(ev) => {
			if (!audioPlayer?.audioEl) return;
			currentTime = (duration * rangeValue) / 100;
		}}
		onkeydown={(ev) => {
			if (ev.key === ' ') audioPlayer?.togglePlayback();
		}}
		bind:value={rangeValue}
		type="range"
		name="audio-track"
	/>
</div>

<audio
	bind:this={audioEl}
	controls
	bind:paused
	bind:muted
	bind:currentTime
	bind:duration
	ontimeupdate={() => (rangeValue = (currentTime / duration) * 100)}
>
	<source {src} {type} />
	Your browser does not support the audio element.
</audio>

<style lang="scss">
	.audio-player {
		background-color: var(--widgets-background-color-dim);
		padding: calc(var(--base-padding) * 0.25);
		// padding-left: calc(var(--base-padding) * 0.25);
		padding-right: calc(var(--base-padding) * 0.75);
		border-radius: var(--inputs-border-base-radius);
		border: var(--inputs-border-width) solid var(--inputs-border-color);

		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--base-gap);

		.buttons {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
		}

		button {
			padding: calc(var(--base-padding) * 0.5);
			border-radius: var(--inputs-border-base-radius);
			border: none;
			cursor: pointer;
			background-color: transparent;
			color: inherit;
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
