<script lang="ts">
	import { enhance } from '$app/forms';
	import Spinner from '$icons/Spinner.svelte';
	import { AudioPlayer } from '$lib/components/AudioPlayer/headless.svelte';
	import Button from '$lib/components/Button.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { musicProviders, type MusicProvider, type Track } from '$lib/helpers/music';
	import { MagnifyingGlass, ArrowSquareOut, Pause, Play, MusicNote } from 'phosphor-svelte';
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';

	let {
		selectedProvider,
		modalOpened = $bindable(false)
	}: {
		selectedProvider: MusicProvider;
		modalOpened: boolean;
	} = $props();

	let isLoading = $state(false);
	let tracks = $state<Track[]>();
	let currentlyPlaying = $state<AudioPlayer>();
	let selectedProviderData = $derived(musicProviders.find((p) => p.value === selectedProvider)!);

	onDestroy(() => {
		if (currentlyPlaying) {
			currentlyPlaying.destroy();
		}
	});
</script>

<div id="stream-provider-search">
	<form
		class="button-wrapper"
		use:enhance={() => {
			isLoading = true;
			return ({ result, update }) => {
				isLoading = false;
				if (result.type === 'success' && result.data) {
					tracks = result.data as any;
				}
				update({ reset: false });
			};
		}}
		action="/api/search/{selectedProvider}?"
		method="post"
	>
		<TextInput name="query" placeholder="Search {selectedProviderData.label}">
			{#snippet suffixButton()}
				<Button disabled={isLoading} type="submit" icon aria-label="Search">
					{#if isLoading}
						<Spinner />
					{:else}
						<MagnifyingGlass weight="regular" />
					{/if}
				</Button>
			{/snippet}
		</TextInput>
	</form>

	{#if tracks}
		<ul id="results" transition:slide>
			{#each tracks as track (track.id)}
				{@const albumCoverArt = track.album.images?.[0]?.url}
				<li>
					<form
						use:enhance={() =>
							({ update }) => {
								update({ reset: false });
								modalOpened = false;
							}}
						action="/api/profile?/setExternalMusic&provider={selectedProvider}&track-id={track.id}"
						method="post"
					>
						<button type="submit">
							<div class="text-image">
								{#if albumCoverArt}
									<img
										height={48}
										width={48}
										src={albumCoverArt}
										alt="Cover art for {track.album.name}"
										draggable="false"
									/>
								{:else}
									<MusicNote />
								{/if}

								<div class="text">
									<h3>
										{track.name}
									</h3>
									<p>{track.artists.map(({ name }) => name).join(', ')}</p>
								</div>
							</div>

							{#snippet externalIcon()}
								<ArrowSquareOut />
							{/snippet}
							{#snippet playbackIcon()}
								{#if currentlyPlaying && currentlyPlaying?.metadata?.title === track.name && currentlyPlaying?.metadata?.album === track.album.name && !currentlyPlaying.paused}
									<Pause />
								{:else}
									<Play />
								{/if}
							{/snippet}

							<ButtonGroup
								buttons={[
									{
										icon: externalIcon,
										href: track.external_urls.spotify
									},
									{
										icon: playbackIcon,
										onclick: () => {
											if (currentlyPlaying) {
												if (
													currentlyPlaying?.metadata?.title === track.name &&
													currentlyPlaying?.metadata?.album === track.album.name
												) {
													currentlyPlaying.togglePlayback();
													return;
												} else {
													currentlyPlaying.destroy();
												}
											}

											currentlyPlaying = new AudioPlayer(track.preview_url, {
												title: track.name,
												artist: track.artists.map(({ name }) => name).join(', '),
												album: track.album.name,
												artwork: albumCoverArt
													? [
															{
																src: albumCoverArt,
																type: 'image/jpeg'
															}
														]
													: []
											});

											currentlyPlaying.togglePlayback();
										}
									}
								]}
							/>
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	@use '../../../../styles/mixins.scss';

	#stream-provider-search {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
		height: 100%;

		#results {
			@include mixins.fancy-list;
			max-height: 400px;
			overflow-y: scroll;

			li {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.75);

				button {
					width: 100%;
					background-color: transparent;
					border: none;
					text-align: left;
					padding: var(--base-padding);
					cursor: pointer;

					display: flex;
					justify-content: space-between;
					gap: calc(var(--base-gap) * 0.5);
					align-items: center;

					.text-image {
						display: flex;
						gap: calc(var(--base-gap) * 0.5);
						align-items: center;

						img {
							border-radius: var(--inputs-border-base-radius);
						}

						.text {
							display: flex;
							flex-direction: column;
							gap: calc(var(--base-gap) * 0.125);

							& > * {
								display: -webkit-box;
								-webkit-line-clamp: 1;
								line-clamp: 1;
								-webkit-box-orient: vertical;
								overflow: hidden;
							}
						}
					}
				}
			}
		}
	}
</style>
