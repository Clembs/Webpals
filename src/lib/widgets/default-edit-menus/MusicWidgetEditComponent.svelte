<script lang="ts">
	import { MagnifyingGlass, MusicNote, SpotifyLogo } from 'phosphor-svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';

	let selectedProvider = $state('spotify');

	let songUrl = $state('');
	let results = $state<
		{
			id: string;
			name: string;
			artists: { name: string; id: string }[];
			album: { name: string; images: { url: string }[]; href: string };
			external_urls: { spotify: string };
			preview_url: string;
		}[]
	>();
</script>

<div class="music-widget">
	<div class="header">
		<MusicNote />

		<h2>Edit Music</h2>
	</div>

	{#if selectedProvider === 'spotify'}
		<div id="edit-music-widget-form">
			{#snippet searchBtn()}
				<Button type="button" icon aria-label="Search">
					<MagnifyingGlass weight="regular" />
				</Button>
			{/snippet}

			<form
				class="button-wrapper"
				use:enhance={() =>
					({ result, update }) => {
						if (result.type === 'success' && result.data) {
							results = result.data as any;
						}
						update({ reset: false });
					}}
				action="/api/search/spotify?"
				method="post"
			>
				<TextInput
					bind:value={songUrl}
					name="query"
					label="Search Spotify"
					suffixButton={searchBtn}
				/>
			</form>

			{#if results}
				<form action="" method="post">
					<ul id="results">
						{#each results as result (result.id)}
							<li>
								<div class="header">
									<div class="text-image">
										<img
											height={52}
											width={52}
											src={result.album.images[0].url}
											alt="Cover art for {result.album.name}"
											draggable="false"
										/>

										<div class="text">
											<h3>
												{result.name}
											</h3>
											<p>{result.artists.map(({ name }) => name).join(', ')}</p>
										</div>
									</div>

									<div class="buttons">
										<Button inline size="small">Use</Button>
										<Button
											inline
											size="small"
											variant="secondary"
											icon
											href={result.external_urls.spotify}
										>
											<SpotifyLogo />
										</Button>
									</div>
								</div>
								<AudioPlayer
									src={result.preview_url}
									type="audio/mp3"
									metadata={{
										title: result.name,
										artist: result.artists.map(({ name }) => name).join(', '),
										album: result.album.name,
										artwork: [
											{
												src: result.album.images[0].url,
												type: 'image/jpeg'
											}
										]
									}}
								/>
							</li>
						{/each}
					</ul>
				</form>
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
