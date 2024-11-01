<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { mergeThemes, plainTheme } from '$lib/themes/mergeThemes.js';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import CustomWidgetComponent from '$lib/widgets/blocks/CustomWidgetComponent.svelte';
	import AboutMeWidgetComponent from '$lib/widgets/default/AboutMeWidgetComponent.svelte';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import ProfileWidgetComponent from '$lib/widgets/default/ProfileWidgetComponent.svelte';
	import type { AnyWidget } from '$lib/widgets/types';

	let { data } = $props();
</script>

{#snippet widgets(widgets: AnyWidget[])}
	{#each widgets as widget}
		{#if widget.id === 'about_me' && 'content' in widget}
			<AboutMeWidgetComponent user={data.user} {widget} edit={data.edit} />
		{:else if widget.id === 'music' && 'content_url' in widget && widget.content_url}
			<MusicWidgetComponent user={data.user} {widget} />
		{:else if 'blocks' in widget}
			<CustomWidgetComponent user={data.user} {widget} />
		{/if}
	{/each}
{/snippet}

<ThemeProvider theme={data.user.theme ? mergeThemes(plainTheme, data.user.theme) : plainTheme}>
	<main>
		<div class="column">
			<ProfileWidgetComponent user={data.user} />
			{@render widgets(data.user.widgets[0].sort((a, b) => a.position - b.position))}
		</div>
		<div class="column">
			{@render widgets(data.user.widgets[1].sort((a, b) => a.position - b.position))}
		</div>
	</main>
</ThemeProvider>

{#if data.editable}
	<div id="edit-button">
		{#if !data.edit}
			<Button href="?edit">Edit profile</Button>
		{:else}
			<Button variant="secondary" href="/{data.user.username}">Cancel</Button>
		{/if}
	</div>
{/if}

<style lang="scss">
	main {
		background: var(--background);
		min-height: 100vh;
		display: grid;
		padding: clamp(calc(var(--base-padding) / 2), 2vw, calc(var(--base-padding) * 2));
		gap: var(--base-gap);
		grid-template-columns: 1fr 1.5fr;
		grid-template-rows: 0fr;
		background-position: center;
		background-size: cover;

		@media (max-width: 950px) {
			grid-template-columns: 1fr;
		}

		.column {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);
		}
	}

	#edit-button {
		position: fixed;
		bottom: var(--base-padding);
		right: var(--base-padding);
		z-index: 100;
	}
</style>
