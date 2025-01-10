<script lang="ts">
	import { MagnifyingGlass, MusicNote, SpotifyLogo } from 'phosphor-svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import type { SpotifyTrack } from '$lib/helpers/music';
	import Spinner from '$icons/Spinner.svelte';

	let {
		modalOpened = $bindable(false)
	}: {
		modalOpened: boolean;
	} = $props();

	let isLoading = $state(false);
	let selectedProvider = $state('spotify');
	let tracks = $state<SpotifyTrack[]>();
</script>

<div class="music-widget">
	<div class="header">
		<MusicNote />

		<h2>Edit Music</h2>
	</div>

	{#if selectedProvider === 'spotify'}
		<div id="edit-music-widget-form">
			{#snippet searchBtn()}
				<Button disabled={isLoading} type="button" icon aria-label="Search">
					{#if isLoading}
						<Spinner />
					{:else}
						<MagnifyingGlass weight="regular" />
					{/if}
				</Button>
			{/snippet}

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
				action="/api/search/spotify?"
				method="post"
			>
				<TextInput name="query" label="Search Spotify" suffixButton={searchBtn} />
			</form>

			{#if tracks}
				<ul id="results">
					{#each tracks as track (track.id)}
						<li>
							<div class="header">
								<div class="text-image">
									<img
										height={48}
										width={48}
										src={track.album.images[0].url}
										alt="Cover art for {track.album.name}"
										draggable="false"
									/>

									<div class="text">
										<h3>
											{track.name}
										</h3>
										<p>{track.artists.map(({ name }) => name).join(', ')}</p>
									</div>
								</div>

								<div class="buttons">
									<form
										use:enhance={() =>
											({ update }) => {
												update({ reset: false });
												modalOpened = false;
											}}
										action="/api/profile?/editMusic&content-type={selectedProvider}&track-id={track.id}"
										method="post"
									>
										<Button inline size="small">Use</Button>
									</form>
									<Button
										inline
										size="small"
										variant="secondary"
										icon
										href={track.external_urls.spotify}
									>
										<SpotifyLogo />
									</Button>
								</div>
							</div>
							<AudioPlayer
								src={track.preview_url}
								type="audio/mp3"
								metadata={{
									title: track.name,
									artist: track.artists.map(({ name }) => name).join(', '),
									album: track.album.name,
									artwork: [
										{
											src: track.album.images[0].url,
											type: 'image/jpeg'
										}
									]
								}}
							/>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.music-widget {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 1.25);
	}

	.header {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
		align-items: center;

		h2 {
			font-size: 1.25rem;
		}
	}

	#edit-music-widget-form {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
		height: 100%;

		#results {
			@include mixins.fancy-list;

			li {
				display: flex;
				flex-direction: column;
				padding: var(--base-padding);
				gap: calc(var(--base-gap) * 0.75);

				.header {
					display: flex;
					justify-content: space-between;
					gap: calc(var(--base-gap) * 0.5);

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
						}
					}

					.buttons {
						display: flex;
						gap: calc(var(--base-gap) * 0.5);
					}
				}
			}
		}
	}
</style>
