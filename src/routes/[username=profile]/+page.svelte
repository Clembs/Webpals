<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { mergeThemes, plainTheme } from '$lib/themes/mergeThemes.js';
	import ThemeEditor from '$lib/themes/ThemeEditor.svelte';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import CustomWidgetComponent from '$lib/widgets/blocks/CustomWidgetComponent.svelte';
	import AboutMeWidgetComponent from '$lib/widgets/default/AboutMeWidgetComponent.svelte';
	import FriendsWidgetComponent from '$lib/widgets/default/FriendsWidgetComponent.svelte';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import ProfileWidgetComponent from '$lib/widgets/default/ProfileWidgetComponent.svelte';
	import WidgetPicker from '$lib/widgets/picker/WidgetPicker.svelte';
	import type { AnyWidget } from '$lib/widgets/types';
	import { Eye, PencilSimple, Plus, Palette } from 'phosphor-svelte';
	import { fly, slide } from 'svelte/transition';

	let { data } = $props();

	let widgetPickerOpen = $state(false);
	let themeEditorOpen = $state(false);

	let theme = $state(data.user.theme);
</script>

{#if data.editing}
	<div id="top-info" transition:slide>
		You are in editing mode. Hover over a widget or click it to reveal more options.
	</div>
{/if}

{#snippet widgets(widgets: AnyWidget[])}
	{#each widgets as widget}
		{#if widget.id === 'about_me' && 'content' in widget}
			<AboutMeWidgetComponent {widget} {...data} />
		{:else if widget.id === 'music' && 'content_url' in widget && (!data.editing ? widget.content_url : true)}
			<MusicWidgetComponent {widget} {...data} />
		{:else if widget.id === 'friends' && !('blocks' in widget)}
			<FriendsWidgetComponent {widget} {...data} />
		{:else if 'blocks' in widget}
			<CustomWidgetComponent {widget} {...data} />
		{/if}
	{/each}
{/snippet}

<div id="root-profile">
	<div id="profile">
		<ThemeProvider {theme}>
			<main>
				<div class="column">
					<ProfileWidgetComponent {...data} />
					{@render widgets(data.user.widgets[0].sort((a, b) => a.position - b.position))}
				</div>
				<div class="column">
					{@render widgets(data.user.widgets[1].sort((a, b) => a.position - b.position))}
				</div>
			</main>
		</ThemeProvider>
	</div>

	{#if data.editing && themeEditorOpen}
		<ThemeEditor bind:theme />
	{/if}
</div>

{#if data.editable}
	<div id="edit-button">
		{#if !data.editing}
			<Button href="?edit">
				<PencilSimple />
				Edit profile
			</Button>
		{:else}
			<Button variant="secondary" href="/{data.user.username}">
				<Eye />
				View profile
			</Button>
		{/if}
	</div>
{/if}

<WidgetPicker user={data.currentUser} bind:showPicker={widgetPickerOpen} />

{#if data.editing}
	<div id="edit-bar" transition:fly={{ y: 200 }}>
		<button onclick={() => (widgetPickerOpen = true)} aria-label="Add widget">
			<Plus weight="regular" size={30} />
		</button>
		<button onclick={() => (themeEditorOpen = !themeEditorOpen)} aria-label="Edit theme">
			<Palette size={30} />
		</button>
	</div>
{/if}

<style lang="scss">
	#top-info {
		background-color: var(--color-success);
		color: white;
		border-bottom: 0px solid black;
		font-weight: 500;
		font-size: 1.25rem;
		border-width: 1px;
		padding: 1rem;
	}

	#root-profile {
		display: flex;
		flex: 1;
	}

	#profile {
		display: contents;
		container-type: inline-size;
		flex-grow: 1;
	}

	main {
		background: var(--background);
		display: grid;
		padding: clamp(calc(var(--base-padding) / 2), 2vw, calc(var(--base-padding) * 2));
		gap: var(--base-gap);
		grid-template-columns: 1fr 1.5fr;
		grid-template-rows: 0fr;
		background-position: center;
		background-size: cover;
		flex: 1;

		.column {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);
		}
	}

	@container (max-width: 950px) {
		main {
			grid-template-columns: 1fr;
		}
	}

	#edit-button {
		position: fixed;
		bottom: var(--base-padding);
		right: var(--base-padding);
		z-index: 5;
	}

	#edit-bar {
		display: flex;
		position: fixed;
		bottom: var(--base-padding);
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		gap: calc(var(--base-gap) * 0.5);
		background-color: var(--widgets-background-color);
		padding: calc(var(--base-padding) * 0.5);
		border-radius: var(--widgets-border-base-radius);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);
		border: var(--widgets-border-width) solid var(--widgets-border-color);

		button {
			background: var(--widgets-background-color-dim);
			border: var(--inputs-border-width) solid var(--inputs-border-color);
			border-radius: var(--inputs-border-base-radius);
			padding: calc(var(--base-padding) * 0.25);
			cursor: pointer;

			&:hover {
				filter: brightness(0.9);
			}
		}
	}
</style>
