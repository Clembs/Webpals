<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import ThemeEditor from '$lib/themes/ThemeEditor.svelte';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import CustomWidgetComponent from '$lib/widgets/blocks/CustomWidgetComponent.svelte';
	import AboutMeWidgetComponent from '$lib/widgets/default/AboutMeWidgetComponent.svelte';
	import ConnectionsWidgetComponent from '$lib/widgets/default/ConnectionsWidgetComponent.svelte';
	import FriendsWidgetComponent from '$lib/widgets/default/FriendsWidgetComponent.svelte';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import ProfileWidgetComponent from '$lib/widgets/default/ProfileWidgetComponent.svelte';
	import WidgetPicker from '$lib/widgets/picker/WidgetPicker.svelte';
	import type { AboutMeWidget, AnyWidget } from '$lib/widgets/types';
	import { Eye, PencilSimple, Plus, Palette, Gear } from 'phosphor-svelte';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	let widgetPickerOpen = $state(false);
	let themeEditorOpen = $state(false);

	let theme = $state(data.user.theme);

	$effect(() => {
		theme = data.user.theme;
	});

	let editBarEl = $state<HTMLDivElement>();
	let editBarWrapperEl = $state<HTMLDivElement>();
	let toggleModesButtonEl = $state<HTMLAnchorElement>();
	let editModeButtonHover = $state(false);

	// handles the fancy animation when toggling between view and edit mode
	// if i ever need to change any of this i'm just gonna cry ;-;
	function toggleMode() {
		if (!editBarWrapperEl || !toggleModesButtonEl || !editBarEl) return;

		if (!data.editing) {
			// expand animation
			const anim = editBarWrapperEl.animate(
				[
					{ width: `${toggleModesButtonEl.clientWidth}px` },
					{ width: `${editBarEl.clientWidth}px` }
				],
				{
					duration: 500,
					easing: 'cubic-bezier(0.8, -0.3, 0.1, 1.3)'
				}
			);

			editBarEl.style.transform = `none`;

			anim.finished.then(() => {
				if (!editBarWrapperEl) return;
				editBarWrapperEl.style.width = `max-content`;
			});
		} else {
			// collapse animation
			const anim = editBarWrapperEl.animate(
				[
					{ width: `${editBarEl.clientWidth}px` },
					{ width: `${toggleModesButtonEl.clientWidth}px` }
				],
				{
					duration: 500,
					easing: 'cubic-bezier(0.8, -0.3, 0.1, 1.3)'
				}
			);

			editBarEl.style.transform = `translateX(calc(-100% + ${toggleModesButtonEl.clientWidth}px))`;

			anim.finished.then(() => {
				if (!editBarWrapperEl || !toggleModesButtonEl) return;
				// enforce the width because idfk weird js bug i guess??????
				editBarWrapperEl.style.width = `${toggleModesButtonEl.clientWidth}px`;
			});
		}
	}
</script>

<Meta
	title={data.user.displayName || data.user.username}
	description={(
		data.user.widgets
			.find((c) => c.find((w) => w.id === 'about_me'))
			?.find((w) => w.id === 'about_me') as AboutMeWidget
	)?.content}
/>

{#snippet widgets(widgets: AnyWidget[])}
	{#each widgets as widget}
		{#if widget.id === 'about_me' && 'content' in widget}
			<AboutMeWidgetComponent {widget} {...data} />
		{:else if widget.id === 'music' && 'content_url' in widget && (!data.editing ? widget.content_url : true)}
			<MusicWidgetComponent {widget} {...data} />
		{:else if widget.id === 'friends' && !('blocks' in widget)}
			<FriendsWidgetComponent {widget} {...data} />
		{:else if widget.id === 'connections' && 'connections' in widget}
			<ConnectionsWidgetComponent {widget} {...data} />
		{:else if 'blocks' in widget}
			<CustomWidgetComponent {widget} {...data} />
		{/if}
	{/each}
{/snippet}

<div id="root-profile">
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

	{#if data.editing && themeEditorOpen}
		<ThemeEditor bind:theme />
	{/if}
</div>

<WidgetPicker user={data.currentUser} bind:showPicker={widgetPickerOpen} />

{#if data.editable}
	<div
		id="edit-bar-wrapper"
		transition:fly={{ y: 200 }}
		bind:this={editBarWrapperEl}
		class:viewing={!data.editing}
	>
		<div id="edit-bar" bind:this={editBarEl}>
			{#if data.editing}
				<!-- commands -->
				<div id="edit-commands">
					<button
						class="edit-command"
						onclick={() => (widgetPickerOpen = true)}
						aria-label="Add widget"
					>
						<Plus weight="regular" />
						<span class="label"> Add widget </span>
					</button>
					<button
						class="edit-command"
						onclick={() => (themeEditorOpen = !themeEditorOpen)}
						aria-label="Theme settings"
					>
						<Palette />
						<span class="label"> Theme settings </span>
					</button>
					<button class="edit-command" aria-label="Account settings">
						<Gear />
						<span class="label"> Account settings </span>
					</button>
				</div>

				<!-- switch button -->
				<!-- holy fuck thats a lot of props lmao -->
				<a
					href="?view"
					data-sveltekit-replacestate
					id="toggle-modes-button"
					class:hovering={editModeButtonHover}
					class="switch-to-view"
					aria-label="Switch to view mode"
					onmouseenter={() => (editModeButtonHover = true)}
					onmouseleave={() => (editModeButtonHover = false)}
					onfocus={() => (editModeButtonHover = true)}
					onblur={() => (editModeButtonHover = false)}
					onclick={() => toggleMode()}
					bind:this={toggleModesButtonEl}
				>
					{#if editModeButtonHover}
						<Eye />
						<span class="label"> Switch to view mode </span>
					{:else}
						<PencilSimple />
						<span class="label"> Currently in edit mode </span>
					{/if}
				</a>
			{:else}
				<!-- commands (they're inert so you dont focus into them or whatever) -->
				<div id="edit-commands">
					<button class="edit-command" aria-hidden={true} inert>
						<Plus weight="regular" />
						<span class="label"> Add widget </span>
					</button>
					<button class="edit-command" aria-hidden={true} inert>
						<Palette />
						<span class="label"> Theme settings </span>
					</button>
					<button class="edit-command" aria-hidden={true} inert>
						<Gear />
						<span class="label"> Account settings </span>
					</button>
				</div>

				<!-- switch button -->
				<a
					href="/{data.user.username}"
					data-sveltekit-replacestate
					id="toggle-modes-button"
					class="view"
					aria-label="Switch to edit mode"
					onclick={() => toggleMode()}
					bind:this={toggleModesButtonEl}
				>
					<PencilSimple />
					<span class="label">
						<div class="label">Switch to edit mode</div>
					</span>
				</a>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	#root-profile {
		display: flex;
		flex: 1;
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

		@media (max-width: 950px) {
			grid-template-columns: 1fr;
		}
	}

	#edit-bar-wrapper {
		display: flex;
		background-color: var(--widgets-background-color);
		border-radius: var(--widgets-border-base-radius);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);
		overflow: hidden;
		border: var(--widgets-border-width) solid var(--widgets-border-color);

		position: fixed;
		bottom: var(--base-padding);
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		width: max-content;

		--toggle-modes-button-width: 230px;

		// the 24px is just the size of the icon
		@media (max-width: 950px) {
			--toggle-modes-button-width: calc(var(--base-padding) * 2 + 24px);
		}

		&.viewing {
			width: var(--toggle-modes-button-width);

			&:hover {
				border-color: var(--buttons-primary-background-color);
			}

			#edit-bar {
				transform: translateX(calc(-100% + var(--toggle-modes-button-width)));
			}
		}
	}

	#edit-bar {
		display: flex;
		transition: transform 500ms cubic-bezier(0.8, -0.3, 0.1, 1.3); // fancy ass cubic bézier
		width: fit-content;

		#edit-commands {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			padding: calc(var(--base-padding) * 0.5);
			border-right: var(--widgets-border-width) solid var(--widgets-border-color);
			flex-shrink: 0;
			flex: 1;
		}

		.edit-command {
			display: flex;
			align-items: center;
			background-color: transparent;
			border: none;
			gap: calc(var(--base-gap) * 0.5);
			border-radius: var(--inputs-border-base-radius);
			padding: calc(var(--base-padding) * 0.5);
			cursor: pointer;
			font-weight: 500;

			// tbh css sucks big time
			white-space: nowrap;
			width: max-content;

			:global(svg) {
				flex-shrink: 0;
			}

			&:hover {
				background: var(--widgets-background-color-dim);
			}
		}

		#toggle-modes-button {
			display: flex;
			align-items: center;
			padding: var(--base-padding);
			gap: calc(var(--base-gap) * 0.5);
			min-width: var(--toggle-modes-button-width);
			max-width: var(--toggle-modes-button-width);
			justify-content: center;
			text-decoration: none;
			white-space: nowrap;
			flex: 1;
			transition: background-color 150ms;

			:global(svg) {
				flex-shrink: 0;
			}

			&.switch-to-view {
				background-color: var(--color-success);
				color: var(--buttons-primary-on-background-color);

				&.hovering {
					background-color: var(--buttons-primary-background-color);
					color: var(--buttons-primary-on-background-color);
				}
			}

			&:hover {
				background-color: var(--buttons-primary-background-color);
				color: var(--buttons-primary-on-background-color);
			}
		}

		.edit-command .label,
		#toggle-modes-button .label {
			display: contents;

			@media (max-width: 950px) {
				display: none;
			}
		}
	}
</style>
