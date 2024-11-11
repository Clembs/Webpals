<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { mergeThemes, plainTheme } from '$lib/themes/mergeThemes.js';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import CustomWidgetComponent from '$lib/widgets/blocks/CustomWidgetComponent.svelte';
	import AboutMeWidgetComponent from '$lib/widgets/default/AboutMeWidgetComponent.svelte';
	import FriendsWidgetComponent from '$lib/widgets/default/FriendsWidgetComponent.svelte';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import ProfileWidgetComponent from '$lib/widgets/default/ProfileWidgetComponent.svelte';
	import WidgetPicker from '$lib/widgets/picker/WidgetPicker.svelte';
	import type { AnyWidget } from '$lib/widgets/types';
	import { Eye, PencilSimple, Plus, Palette } from 'phosphor-svelte';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	let showPicker = $state(false);
</script>

<div id="top-info" class:show={data.editing}>
	You are in editing mode. Hover over a widget or click it to reveal more options.
</div>

{#snippet widgets(widgets: AnyWidget[])}
	{#each widgets as widget}
		{#if widget.id === 'about_me' && 'content' in widget}
			<AboutMeWidgetComponent {widget} {...data} />
		{:else if widget.id === 'music' && 'content_url' in widget && widget.content_url}
			<MusicWidgetComponent {widget} {...data} />
		{:else if widget.id === 'friends' && !('blocks' in widget)}
			<FriendsWidgetComponent {widget} {...data} />
		{:else if 'blocks' in widget}
			<CustomWidgetComponent {widget} {...data} />
		{/if}
	{/each}
{/snippet}

<ThemeProvider theme={data.user.theme ? mergeThemes(plainTheme, data.user.theme) : plainTheme}>
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

<WidgetPicker bind:showPicker />

{#if data.editing}
	<div id="edit-bar" transition:fly={{ y: 200 }}>
		<button onclick={() => (showPicker = true)} aria-label="Add widget">
			<Plus weight="regular" size={30} />
		</button>
		<button aria-label="Edit theme">
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
		max-height: 0px;
		padding: 0 1rem;
		transition:
			max-height 100ms,
			padding 100ms;
		overflow: hidden;

		&.show {
			border-width: 1px;
			padding: 1rem;
			max-height: 999px;
			transition:
				max-height 200ms,
				padding 200ms;
		}
	}

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
