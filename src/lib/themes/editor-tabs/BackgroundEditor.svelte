<script lang="ts">
	import { Image } from 'phosphor-svelte';
	import type { Theme } from '../types';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { PUBLIC_STORAGE_BASE_URL } from '$env/static/public';
	import Tabs from '$lib/components/Tabs.svelte';

	let { theme = $bindable() }: { theme: Theme } = $props();
</script>

<section>
	<Tabs
		name="background.type"
		bind:selectedTab={theme.background.type}
		tabs={[
			{ value: 'color', label: 'Color' },
			{ value: 'image', label: 'Image' }
		]}
	/>

	{#if theme.background.type === 'image'}
		<label for="background.image">
			<div class="cover-text">
				<Image />
				{#if theme.background.image_url}
					Replace image
				{:else}
					Upload image
				{/if}
			</div>

			{#if theme.background.image_url}
				<img
					class="current-background"
					src={theme.background.image_url?.startsWith('blob:')
						? theme.background.image_url
						: `${PUBLIC_STORAGE_BASE_URL}/${theme.background.image_url}`}
					alt="Background"
				/>
			{:else}
				<div class="no-background"></div>
			{/if}
		</label>

		<div id="file-recommendations">
			Recommended dimensions: 1920x1080 pixels. <br />
			Maximum size of 5MB.
		</div>

		<label for="background.image_position">
			Align image to

			<select bind:value={theme.background.image_position} id="background.image_position">
				<option value="center" selected>Center</option>
				<option value="top">Top</option>
				<option value="bottom">Bottom</option>
				<option value="left">Left</option>
				<option value="right">Right</option>
			</select>
		</label>

		<label for="background.image_size">
			Image size

			<select bind:value={theme.background.image_size} id="background.image_size">
				<option value="auto">Automatic</option>
				<option value="cover" selected>Cover</option>
				<option value="contain">Contain</option>
			</select>
		</label>

		<label for="background.image_repeat">
			Repeat image in a tile pattern

			<select bind:value={theme.background.image_repeat} id="background.image_repeat">
				<option value="no-repeat" selected>Don't repeat</option>
				<option value="repeat">Repeat</option>
			</select>
		</label>

		<label for="background.image_rendering">
			Image rendering

			<select bind:value={theme.background.image_rendering} id="background.image_rendering">
				<option value="smooth" selected>Smooth</option>
				<option value="pixelated">Pixelated</option>
			</select>
		</label>

		<label for="background.image_attachment">
			Page scroll behavior

			<select bind:value={theme.background.image_attachment} id="background.image_attachment">
				<option value="scroll">Scroll image with page</option>
				<option value="fixed" selected>Keep the image fixed</option>
			</select>
		</label>
	{:else if theme.background.type === 'color'}
		<ColorPicker
			isDialog={false}
			bind:hex={theme.background.color}
			label="Background color"
			name="background.color"
		/>
	{/if}
</section>

<style lang="scss">
	[for='background.image'] {
		display: block !important;
		position: relative;
		cursor: pointer;
		aspect-ratio: 16 / 9;

		.current-background {
			width: 100%;
			max-width: 100%;
			border-radius: var(--widgets-border-base-radius);
			aspect-ratio: 16 / 9;
			object-fit: cover;
		}

		.cover-text {
			display: flex;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			padding: calc(var(--base-padding) * 0.75) calc(var(--base-padding) * 1.5);
			border-radius: var(--widgets-border-base-radius);
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(5px);
			color: var(--buttons-primary-on-background-color);
		}

		&:has(.current-background) {
			&:not(:hover) .cover-text {
				display: none;
			}
		}
	}
</style>
