<script lang="ts">
	import type { FullUser } from '$lib/db/schema/types';
	import type { Theme } from '$lib/themes/types';
	import { Eye, PencilSimple, Plus, Gear, Palette, Hexagon } from 'phosphor-svelte';
	import WidgetPickerMenu from './WidgetPickerMenu.svelte';
	import AccountSettingsMenu from './AccountSettingsMenu.svelte';
	import ThemeEditorMenu from './ThemeEditorMenu.svelte';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import { plainTheme } from '$lib/themes/mergeThemes';
	import { replaceState } from '$app/navigation';
	import MattMenu from './MattMenu.svelte';

	let {
		editing = $bindable(),
		user = $bindable(),
		theme = $bindable()
	}: {
		editing: boolean;
		user: FullUser;
		theme: Theme;
	} = $props();

	let widgetPickerOpen = $state(false);
	let themeEditorOpen = $state(false);
	let accountSettingsOpen = $state(false);
	let mattOpen = $state(false);

	let editBarEl = $state<HTMLDivElement>();
	let editBarWrapperEl = $state<HTMLDivElement>();
	let toggleModesButtonEl = $state<HTMLElement>();
	let editModeButtonHover = $state(false);

	// handles the fancy animation when toggling between view and edit mode
	// if i ever need to change any of this i'm just gonna cry ;-;
	function toggleMode() {
		if (!editBarWrapperEl || !toggleModesButtonEl || !editBarEl) return;

		editing = !editing;

		// switch to editing
		if (editing) {
			replaceState(`/${user.username}`, {});

			// expand animation
			editBarWrapperEl.style.width = `${toggleModesButtonEl.clientWidth}px`;
			editBarWrapperEl.style.transition = `width 500ms cubic-bezier(0.75, -0.2, 0.15, 1)`;
			editBarEl.style.transform = `none`;

			requestAnimationFrame(() => {
				editBarWrapperEl!.style.width = `${editBarEl!.clientWidth}px`;
			});

			editBarWrapperEl.addEventListener(
				'transitionend',
				() => {
					editBarWrapperEl!.style.width = '';
					editBarWrapperEl!.style.transition = '';
				},
				{ once: true }
			);
		}
		// switch to viewing
		else {
			replaceState(`/${user.username}?view`, {});

			// collapse animation
			editBarWrapperEl.style.transition = `width 500ms cubic-bezier(0.75, -0.2, 0.15, 1)`;
			editBarWrapperEl.style.width = `${editBarEl.clientWidth}px`;

			editBarEl.style.transform = `translateX(calc(0px - var(--toggle-modes-button-width) - 20px))`;

			requestAnimationFrame(() => {
				editBarWrapperEl!.style.width = `${toggleModesButtonEl!.clientWidth}px`;
			});

			editBarWrapperEl.addEventListener('transitionend', () => {
				editBarWrapperEl!.style.transition = '';
				editBarWrapperEl!.style.width = '';
			});
		}
	}
</script>

<ThemeProvider theme={plainTheme}>
	<div id="edit-bar-wrapper" bind:this={editBarWrapperEl} class:viewing={!editing}>
		<WidgetPickerMenu {user} {editBarEl} {editBarWrapperEl} bind:menuOpen={widgetPickerOpen} />

		<ThemeEditorMenu bind:theme {editBarEl} {editBarWrapperEl} bind:menuOpen={themeEditorOpen} />

		<AccountSettingsMenu
			{user}
			{editBarEl}
			{editBarWrapperEl}
			bind:menuOpen={accountSettingsOpen}
		/>

		<MattMenu {editBarEl} {editBarWrapperEl} bind:menuOpen={mattOpen} />

		<div id="edit-bar" bind:this={editBarEl}>
			<!-- commands -->
			<div id="edit-commands">
				<button
					class="edit-command"
					onclick={() => (widgetPickerOpen = true)}
					aria-label="Add widget"
					inert={!editing}
					aria-hidden={!editing}
				>
					<Plus weight="regular" />
					<span class="label"> Add widget </span>
				</button>
				<button
					class="edit-command"
					onclick={() => (themeEditorOpen = true)}
					aria-label="Theme settings"
					inert={!editing}
					aria-hidden={!editing}
				>
					<Palette />
					<span class="label"> Theme settings </span>
				</button>
				<button
					class="edit-command"
					onclick={() => (accountSettingsOpen = true)}
					aria-label="Account settings"
					inert={!editing}
					aria-hidden={!editing}
				>
					<Gear />
					<span class="label"> Account settings </span>
				</button>
				<button
					class="edit-command"
					onclick={() => (mattOpen = true)}
					aria-label="Matt"
					inert={!editing}
					aria-hidden={!editing}
				>
					<Hexagon />

					<div class="label">Matt</div>
				</button>
			</div>

			{#if editing}
				<!-- switch button -->
				<!-- holy fuck thats a lot of props lmao -->
				<button
					id="toggle-modes-button"
					class:hovering={editModeButtonHover}
					class="switch-to-view"
					aria-label="Switch to view mode"
					onmouseenter={() => (editModeButtonHover = true)}
					onmouseleave={() => (editModeButtonHover = false)}
					onfocus={() => (editModeButtonHover = true)}
					onblur={() => (editModeButtonHover = false)}
					onclick={toggleMode}
					bind:this={toggleModesButtonEl}
				>
					{#if editModeButtonHover}
						<Eye />
						<span class="label"> Switch to view mode </span>
					{:else}
						<PencilSimple />
						<span class="label"> Currently in edit mode </span>
					{/if}
				</button>
			{:else}
				<button
					id="toggle-modes-button"
					aria-label="Switch to edit mode"
					onclick={toggleMode}
					bind:this={toggleModesButtonEl}
				>
					<PencilSimple />
					<span class="label">
						<div class="label">Switch to edit mode</div>
					</span>
				</button>
			{/if}
		</div>
	</div>
</ThemeProvider>

<style lang="scss">
	#edit-bar-wrapper {
		max-width: 900px;
		background-color: var(--widgets-background-color);
		border-radius: var(--widgets-border-base-radius);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);
		overflow: hidden;
		border: var(--widgets-border-width) solid var(--widgets-border-color);

		display: flex;
		flex-direction: column;

		position: fixed;
		bottom: var(--base-padding);
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		// width: max-content;
		max-height: 500px;

		--toggle-modes-button-width: 230px;

		// the 24px is just the size of the icon
		@media (max-width: 950px) {
			--toggle-modes-button-width: calc(var(--base-padding) * 2 + 24px);
			max-height: 80vh;
		}

		&.viewing {
			width: var(--toggle-modes-button-width);

			&:hover {
				border-color: var(--buttons-primary-background-color);
			}

			#edit-bar {
				transform: translateX(calc(0px - var(--toggle-modes-button-width) - 20px));
			}
		}

		&:global(.expanded) {
			// :global(#edit-bar) {
			// 	position: absolute;
			// 	bottom: 0;
			// 	left: 50%;
			// 	transform: translateX(-50%);
			// }

			@media (max-width: 950px) {
				width: 100% !important;
				bottom: 0;
				border-radius: var(--widgets-border-base-radius) var(--widgets-border-base-radius) 0 0;
			}
		}
	}

	#edit-bar {
		display: flex;
		transition:
			transform 500ms cubic-bezier(0.75, -0.2, 0.15, 1),
			// fancy ass cubic bézier
			opacity 250ms ease;
		width: fit-content;
		align-self: center;

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
			border: none;
			cursor: pointer;

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
