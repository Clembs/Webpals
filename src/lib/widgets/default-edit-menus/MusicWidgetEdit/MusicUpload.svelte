<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { Profile } from '$lib/db/types';
	import { validateFileSignatures, type MimeTypes } from '$lib/helpers/files';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import type { MusicWidget } from '$lib/widgets/types';
	import { parseWebStream } from 'music-metadata';

	let {
		modalOpened = $bindable(),
		profile
	}: {
		modalOpened: boolean;
		profile: Profile;
	} = $props();

	let widget = $state<MusicWidget>({
		id: 'music',
		title: null,
		artist: null,
		album_art_url: null,
		content_url: null,
		content_type: null,
		external_url: null,
		provider: null
	});

	let isNewMusic = $state(widget.provider !== 'local');
	let isLoading = $state(false);
	let error = $state('');

	const mimeTypes: MimeTypes[] = [
		'audio/mpeg',
		'audio/wav',
		'audio/flac',
		'audio/ogg',
		'audio/x-wav'
	];
</script>

<input
	type="file"
	accept={mimeTypes.join(', ')}
	id="audio-file-upload"
	name="audio-file"
	onchange={async (e) => {
		e.preventDefault();
		const file = e.currentTarget?.files?.[0];

		// When the file is loaded, check its MIME type
		if (file && file.type.startsWith('audio/')) {
			// and check the file signature to be extra sure
			const isValidMimeSignature = await validateFileSignatures(file, mimeTypes);

			if (!isValidMimeSignature) {
				error = 'Invalid file type';
			} else {
				error = '';

				widget.content_url = URL.createObjectURL(file);
				widget.provider = 'local';
				widget.album_art_url = null;

				try {
					const metadata = await parseWebStream(file.stream());

					widget.title = metadata.common?.title || file.name;
					widget.artist = metadata.common?.artist || 'Unknown';
				} catch (e) {
					console.error(e);
					widget.title = file.name;
					widget.artist = 'Unknown';
				}
			}
		} else {
			error = 'Invalid file type';
		}
	}}
/>

<!-- If the user hasn't set anything, show the "drag file to upload" menu -->
{#if widget.provider !== 'local' || (!widget.content_url && !error)}
	<!-- TODO: support drag n' drop -->
	<label for="audio-file-upload">
		<span class="heading">Drop a music file or click the area to upload</span>
		<span class="subtext">Any MP3, FLAC or WAV file under 3MB.</span>
		{#if error}
			<span class="error">
				{error}
			</span>
		{/if}
	</label>

	<!-- Otherwise, show the edit screen -->
{:else}
	<form
		use:enhance={() => {
			isLoading = true;
			return async ({ result, update }) => {
				isLoading = false;
				await update({ reset: false, invalidateAll: true });
			};
		}}
		action="/api/profile?/setExternalMusic"
		method="post"
	>
		<TextInput
			name="title"
			label="Song title"
			placeholder="Name of the song"
			bind:value={widget.title!}
		/>
		<TextInput
			name="artist"
			label="Artist(s)"
			placeholder="Names of the contributing artists"
			bind:value={widget.artist!}
		/>

		<h3>Preview</h3>

		<MusicWidgetComponent {profile} {widget} editing={false} />

		<div class="buttons">
			<Button
				type="button"
				variant="secondary"
				onclick={() => {
					widget.content_url = null;
					widget.title = null;
					widget.artist = null;
					widget.provider = null;
					isNewMusic = true;
				}}
			>
				{#if isNewMusic}
					Go back
				{:else}
					Replace music
				{/if}
			</Button>
			<Button type="submit">Save changes</Button>
		</div>
	</form>
{/if}

<style lang="scss">
	#audio-file-upload {
		display: none;
	}

	[for='audio-file-upload'] {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
		width: 100%;
		height: 100%;
		min-height: 250px;
		border: 2px dashed var(--widgets-background-color-dim);
		border-radius: var(--inputs-border-base-radius);
		align-items: center;
		justify-content: center;
		cursor: pointer;

		.heading {
			font-size: 1.125rem;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		.buttons {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
		}
	}
</style>
