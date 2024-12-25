<script lang="ts">
	import { MusicNote, PencilSimple, SpotifyLogo, Warning } from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { MusicWidget, WidgetComponentProps } from '../types';
	import MusicEditWidgetComponent from '../default-edit-menus/MusicWidgetEditComponent.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';

	let { user, widget, editing }: WidgetComponentProps<Required<MusicWidget>> = $props();

	let modalOpened = $state(false);
</script>

{#snippet editMenu()}
	<MusicEditWidgetComponent bind:modalOpened />
{/snippet}

<BaseWidget bind:isWidgetEditing={modalOpened} {editMenu} {widget} {user} editingMode={editing}>
	<div class="music-widget">
		<div class="heading">
			<MusicNote />

			<h2>
				{#if widget.title}
					{widget.title.length > 40 ? widget.title.slice(0, 40) + '...' : widget.title}
				{:else}
					Music
				{/if}

				<span class="subtext">
					{widget.artist || 'Artist'}
				</span>
			</h2>
		</div>

		{#if widget.content_type === 'spotify'}
			<AudioPlayer
				src={widget.content_url}
				type="audio/mp3"
				metadata={{
					title: widget.title,
					artist: widget.artist,
					artwork: [
						{
							src: widget.album_art_url,
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<a
				class="external-url-cta subtext"
				href={widget.external_url}
				target="_blank"
				rel="noopener noreferrer"
			>
				<SpotifyLogo size={20} /> Listen on Spotify
			</a>
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

			h2 {
				font-size: 1.25rem;
				flex: 1;
			}

			.subtext {
				margin-left: calc(var(--base-gap) * 0.25);
			}
		}

		.error p {
			color: var(--color-urgent);
			display: flex;
			align-items: center;
			gap: calc(var(--base-gap) * 0.25);
		}

		.external-url-cta {
			display: flex;
			align-items: center;
			align-self: flex-end;
			gap: calc(var(--base-gap) * 0.25);
			max-width: fit-content;
			padding: 1rem;
			margin: -1rem;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
