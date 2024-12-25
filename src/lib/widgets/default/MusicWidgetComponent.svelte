<script lang="ts">
	import { MusicNote, PencilSimple, Warning } from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { MusicWidget, WidgetComponentProps } from '../types';
	import MusicEditWidgetComponent from '../default-edit-menus/MusicWidgetEditComponent.svelte';

	let { user, widget, editing }: WidgetComponentProps<MusicWidget> = $props();
</script>

{#snippet editMenu()}
	<MusicEditWidgetComponent />
{/snippet}

<BaseWidget {editMenu} {widget} {user} editingMode={editing}>
	<div class="music-widget">
		<div class="header">
			<MusicNote />

			<h2>
				{widget.title || 'Music'}

				<span class="subtext">
					{widget.artist || 'Artist'}
				</span>
			</h2>
		</div>

		{#if widget.content_type === 'spotify'}
			<iframe
				title="Spotify embed"
				src="https://open.spotify.com/embed/track/{widget.content_url}?utm_source=generator"
				width="100%"
				height="80"
				frameBorder="0"
				allowfullscreen
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="eager"
				class="spotify-embed"
			></iframe>
		{:else if widget.content_type?.startsWith('audio/')}
			<audio controls>
				<source src={widget.content_url} type={widget.content_type} />
				Your browser does not support the audio element.
			</audio>
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

		.header {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;

			h2 {
				font-size: 1.25rem;
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

		.spotify-embed {
			border-radius: 12px;
			max-height: 80px;
		}
	}
</style>
