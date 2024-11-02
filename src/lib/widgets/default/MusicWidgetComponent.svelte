<script lang="ts">
	import { MusicNote } from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { MusicWidget, WidgetComponentProps } from '../types';

	let { user, widget, editing }: WidgetComponentProps<MusicWidget> = $props();
</script>

{#snippet editMenu()}
	hi
{/snippet}

<BaseWidget {editMenu} {widget} {user} {editing}>
	<div class="music-widget">
		<div class="heading">
			<MusicNote />

			<h2>
				{widget.title}

				<span class="subtext">
					{widget.artist}
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
		{/if}
		{#if widget.content_type?.startsWith('audio/')}
			<audio controls>
				<source src={widget.content_url} type={widget.content_type} />
				Your browser does not support the audio element.
			</audio>
		{/if}
	</div>
</BaseWidget>

<style lang="scss">
	.music-widget {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);

		.heading {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;

			h2 {
				font-size: 1.25rem;
			}

			.subtext {
				align-self: baseline;
				margin-left: calc(var(--base-gap) * 0.25);
			}
		}

		.spotify-embed {
			border-radius: 12px;
			max-height: 80px;
		}
	}
</style>
