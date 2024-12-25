<script lang="ts">
	import { Pause, Play } from 'phosphor-svelte';
	import { Tween } from 'svelte/motion';

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
	let paused = $state<boolean>();
	let rangeValue = $state(0);
	let currentTime = $state(0);
	let duration = $state(0);
	let tween = new Tween(currentTime);

	$effect(() => {
		tween.target = currentTime;
	});

	function togglePlayback() {
		if (paused) {
			audioEl?.play();
			createMediaSession();
			// stop audio from all other players
			document.querySelectorAll('audio').forEach((el) => {
				if (el !== audioEl) el.pause();
			});
		} else {
			audioEl?.pause();
		}
	}

	function createMediaSession() {
		if (!navigator.mediaSession || !metadata) return;
		navigator.mediaSession.metadata = new MediaMetadata(metadata);

		navigator.mediaSession.setActionHandler('play', () => audioEl?.play());
		navigator.mediaSession.setActionHandler('pause', () => audioEl?.pause());
		navigator.mediaSession.setActionHandler('seekbackward', () => {
			currentTime -= 10;
		});
		navigator.mediaSession.setActionHandler('seekforward', () => {
			currentTime += 10;
		});
		navigator.mediaSession.setActionHandler('previoustrack', () => {
			currentTime = 0;
		});
		navigator.mediaSession.setActionHandler('nexttrack', () => {
			currentTime = audioEl!.duration;
		});
		navigator.mediaSession.setActionHandler('stop', () => {
			if (!audioEl) return;
			audioEl.pause();
			currentTime = 0;
		});
	}
</script>

<!-- TODO: link this to the actual audio player -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="audio-player">
	<button type="button" onclick={togglePlayback} class="toggle-playback">
		{#if paused}
			<Play />
		{:else}
			<Pause />
		{/if}
	</button>

	<input
		onchange={(ev) => {
			if (!audioEl) return;
			currentTime = (duration * rangeValue) / 100;
		}}
		onkeydown={(ev) => {
			if (ev.key === ' ') togglePlayback();
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
