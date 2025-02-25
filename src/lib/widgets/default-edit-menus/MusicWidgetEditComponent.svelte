<script lang="ts">
	import { ArrowSquareOut, MagnifyingGlass, MusicNote, Pause, Play } from 'phosphor-svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import { type MusicProvider, musicProviders, type Track } from '$lib/helpers/music';
	import Spinner from '$icons/Spinner.svelte';
	import { slide } from 'svelte/transition';
	import type { MusicWidget } from '../types';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import { AudioPlayer } from '$lib/components/AudioPlayer/headless.svelte';

	let {
		widget,
		modalOpened = $bindable(false)
	}: {
		widget: MusicWidget;
		modalOpened: boolean;
	} = $props();

	let isLoading = $state(false);
	let selectedProvider = $state<MusicProvider>(widget.provider || musicProviders[0].value);
	let selectedProviderData = $derived(musicProviders.find((p) => p.value === selectedProvider));
	let tracks = $state<Track[]>();

	let currentlyPlaying = $state<AudioPlayer>();
</script>

<div class="music-widget">
	<aside>
		<div class="header">
			<MusicNote />

			<h2>Edit Music</h2>
		</div>
		<ul id="music-providers">
			{#each musicProviders.toSorted( (p) => (widget.provider ? (widget.provider === p.value ? 0 : -1) : 0) ) as provider}
				<li>
					<input
						id="provider-{provider.value}"
						type="radio"
						name="music-provider"
						value={provider.value}
						checked={selectedProvider === provider.value}
						onchange={() => (selectedProvider = provider.value)}
					/>
					<label class="music-provider" for="provider-{provider.value}">
						<provider.icon />
						{provider.label}
					</label>
				</li>
			{/each}
		</ul>
	</aside>

	<div class="content">
		{#if selectedProvider !== 'local' && selectedProviderData}
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
							<li>
								<form
									use:enhance={() =>
										({ update }) => {
											update({ reset: false });
											modalOpened = false;
										}}
									action="/api/profile?/editMusic&content-type={selectedProvider}&track-id={track.id}"
									method="post"
								>
									<button type="submit">
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

										{#snippet externalIcon()}
											<ArrowSquareOut />
										{/snippet}
										{#snippet playbackIcon()}
											{#if currentlyPlaying && currentlyPlaying?.metadata?.title === track.name && !currentlyPlaying.paused}
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
															if (currentlyPlaying?.metadata?.title === track.name) {
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
															artwork: [
																{
																	src: track.album.images[0].url,
																	type: 'image/jpeg'
																}
															]
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
		{:else}
			<p>Unknown provider.</p>
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.music-widget {
		display: flex;
		margin: calc(0px - var(--base-padding));
	}

	aside {
		flex-shrink: 0;
		padding: var(--base-padding);
		border-right: var(--inputs-border-width) solid var(--inputs-border-color);

		.header {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;
			color: var(--color-heading);
			margin-bottom: var(--base-gap);

			h2 {
				font-size: 1.25rem;
			}
		}

		#music-providers {
			display: flex;
			flex-direction: column;
			gap: calc(var(--base-gap) * 0.25);
			list-style: none;
			min-width: 200px;

			[type='radio'] {
				height: 1px;
				width: 1px;
				position: fixed;
				top: -1px;
				left: -1px;

				&:checked + .music-provider {
					background-color: var(--buttons-primary-background-color);
					color: var(--buttons-primary-on-background-color);
				}
			}

			.music-provider {
				display: flex;
				gap: calc(var(--base-gap) * 0.75);
				padding: calc(var(--base-padding) * 0.75) calc(var(--base-padding) * 1);
				color: var(--inputs-on-background-color);
				border-radius: var(--inputs-border-base-radius);
				cursor: pointer;
			}
		}
	}

	.content {
		flex: 1;
		padding: var(--base-padding);
	}

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
