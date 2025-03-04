<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { validateFileSignatures, type MimeTypes } from '$lib/helpers/files';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import type { MusicWidget, WidgetComponentProps } from '$lib/widgets/types';
	import { parseWebStream } from 'music-metadata';

	let {
		modalOpened = $bindable(),
		profile,
		widget
	}: WidgetComponentProps<MusicWidget> & {
		modalOpened: boolean;
	} = $props();

	let widgetTitle = $state(widget.title || '');
	let widgetArtist = $state(widget.artist || '');
	let widgetContentUrl = $state(widget.content_url);
	let widgetProvider = $state(widget.provider);

	let isNewMusic = $state(widget.provider !== 'local');
	let isLoading = $state(false);
	let error = $state('');

	const mimeTypes: MimeTypes[] = [
		'audio/mpeg',
		'audio/wav',
		'audio/flac',
		// 'audio/ogg',
		'audio/x-wav'
	];
</script>

<form
	use:enhance={() => {
		isLoading = true;
		return async ({ result, update }) => {
			await update({ reset: false, invalidateAll: true });
			isLoading = false;

			if (result.type === 'success') {
				modalOpened = false;
			} else if (result.type === 'failure' && typeof result.data?.message === 'string') {
				error = result.data.message;
			}
		};
	}}
	action="/api/profile?/setLocalMusic"
	method="post"
	enctype="multipart/form-data"
>
	<input
		type="file"
		accept={mimeTypes.join(', ')}
		id="audio-file-upload"
		name="audio-file"
		onchange={async (e) => {
			e.preventDefault();
			const file = e.currentTarget?.files?.[0];

			// When the file is loaded, check its MIME type
			if (!file || !file.type.startsWith('audio/')) {
				error = 'Invalid file type.';
				return;
			}

			// check the file signature to be extra sure
			const isValidMimeSignature = await validateFileSignatures(file, mimeTypes);

			if (!isValidMimeSignature) {
				error = 'Invalid file type.';
				return;
			}

			// check if the file is too large (>3MB)
			if (file.size > 3 * 1024 * 1024) {
				error = 'File must be less than 3 MB in size.';
				return;
			}

			// check if the music's duration is above 10 minutes
			const metadata = await parseWebStream(file.stream());

			if (metadata.format?.duration && metadata.format.duration > 600) {
				error = 'Music must be less than 10 minutes in duration.';
				return;
			}

			widgetContentUrl = URL.createObjectURL(file);
			widgetProvider = 'local';

			widgetTitle = metadata.common?.title || file.name;
			widgetArtist = metadata.common?.artist || 'Unknown';
		}}
	/>

	<!-- If the user hasn't set anything, show the "drag file to upload" menu -->
	{#if widgetProvider !== 'local' || !widgetContentUrl}
		<!-- TODO: support drag n' drop -->
		<label for="audio-file-upload">
			<span class="heading">Drop a music file or click the area to upload</span>
			<span class="subtext">Any MP3, FLAC or WAV file under 3 MB or 10 minutes.</span>
			{#if error}
				<span class="error">
					{error}
				</span>
			{/if}
		</label>

		<!-- Otherwise, show the edit screen -->
	{:else}
		<div class="form">
			<TextInput
				name="title"
				label="Song title"
				placeholder="Name of the song"
				maxlength={80}
				bind:value={widgetTitle}
			/>
			<TextInput
				name="artist"
				label="Artist(s)"
				placeholder="Names of the contributing artists"
				maxlength={50}
				bind:value={widgetArtist}
			/>

			<h3>Preview</h3>

			<MusicWidgetComponent
				{profile}
				widget={{
					id: 'music',
					album_art_url: null,
					title: widgetTitle,
					artist: widgetArtist,
					content_url: widgetContentUrl,
					provider: 'local',
					external_url: null
				}}
				editing={false}
			/>

			<div class="buttons">
				<Button
					type="button"
					variant="secondary"
					onclick={() => {
						widgetContentUrl = null;
						widgetTitle = '';
						widgetArtist = '';
						widgetProvider = null;
						isNewMusic = true;
					}}
					disabled={isLoading}
				>
					{#if isNewMusic}
						Go back
					{:else}
						Replace music
					{/if}
				</Button>
				<Button
					type="submit"
					disabled={!widgetTitle ||
						!widgetArtist ||
						!widgetContentUrl ||
						isLoading ||
						(widgetTitle === widget.title && widgetArtist === widget.artist)}
				>
					{#if isLoading}
						Loading...
					{:else if isNewMusic}
						Upload music
					{:else}
						Save changes
					{/if}
				</Button>
			</div>
		</div>
	{/if}
</form>

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
		display: contents;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);

		.buttons {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			margin-top: var(--base-gap);
		}
	}
</style>
