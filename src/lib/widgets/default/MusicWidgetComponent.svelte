<script lang="ts">
	import { MusicNote, PencilSimple, Warning } from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { MusicWidget, WidgetComponentProps } from '../types';
	import MusicEditWidgetComponent from '../default-edit-menus/MusicWidgetEdit/MusicWidgetEditComponent.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer/AudioPlayer.svelte';
	import type { Profile } from '$lib/db/types';

	let { profile, widget, editing }: WidgetComponentProps<MusicWidget> = $props();

	let modalOpened = $state(false);
</script>

<BaseWidget bind:isWidgetEditing={modalOpened} {widget} {profile} editingMode={editing}>
	{#snippet editMenu()}
		<MusicEditWidgetComponent {widget} {profile} {editing} bind:modalOpened />
	{/snippet}
	<div class="music-widget">
		<div class="heading">
			{#if widget.album_art_url}
				<img
					draggable={false}
					src={widget.album_art_url}
					alt="{widget.title} Cover art"
					height={48}
					width={48}
					class="album-art"
				/>
			{:else}
				<MusicNote />
			{/if}

			<div class="text">
				<h2>
					{widget.title || 'Music'}
				</h2>

				<span class="subtext">
					{widget.artist || 'Artist'}
				</span>
			</div>
		</div>

		{#if widget.content_url}
			<!-- {#if widget.provider === 'spotify' && widget.album_art_url && widget.artist} -->
			<AudioPlayer
				src={widget.content_url}
				type="audio/mp3"
				metadata={{
					title: widget.title || '',
					artist: widget.artist || '',
					...(widget.album_art_url
						? {
								artwork: [
									{
										src: widget.album_art_url,
										type: 'image/jpeg'
									}
								]
							}
						: {})
				}}
			/>

			<!-- <a
					class="external-url-cta subtext"
					href={widget.external_url}
					target="_blank"
					rel="noopener noreferrer"
				>
					<SpotifyLogo size={20} /> Listen on Spotify
				</a> -->
			<!-- {/if} -->
		{:else}
			<div class="error">
				<p>
					<Warning /> No content provided. The widget will not be visible.
				</p>

				<p>
					Click <PencilSimple /> to setup.
				</p>
			</div>
		{/if}
	</div>
</BaseWidget>

<style lang="scss">
	.music-widget {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
		color: var(--color-heading);

		.heading {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;

			.album-art {
				border-radius: var(--inputs-border-base-radius);
			}

			.text {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.125);
			}

			h2 {
				font-size: 1.25rem;
				flex: 1;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.subtext {
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}

		.error p {
			color: var(--color-urgent);
			display: flex;
			align-items: center;
			gap: calc(var(--base-gap) * 0.25);
		}

		// .external-url-cta {
		// 	display: flex;
		// 	align-items: center;
		// 	align-self: flex-end;
		// 	gap: calc(var(--base-gap) * 0.5);
		// 	max-width: fit-content;
		// 	padding: 1rem;
		// 	margin: -1rem;
		// 	text-decoration: none;

		// 	&:hover {
		// 		text-decoration: underline;
		// 	}
		// }
	}
</style>
