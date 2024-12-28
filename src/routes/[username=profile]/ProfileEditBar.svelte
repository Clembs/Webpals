<script lang="ts">
	import type { FullUser } from '$lib/db/schema/users';
	import { Eye, PencilSimple, Plus, Gear } from 'phosphor-svelte';
	import { fly } from 'svelte/transition';
	import WidgetPicker from './WidgetPicker.svelte';
	import AccountSettings from './AccountSettings.svelte';
	import type { EditBarMenuMethods } from './BaseEditBarMenu.svelte';

	let {
		editing = $bindable(),
		user
	}: {
		editing: boolean;
		user: FullUser;
	} = $props();

	let widgetPickerOpen = $state(false);
	let widgetPickerMethods = $state<EditBarMenuMethods>();

	let themeEditorOpen = $state(false);
	let themeEditor = $state<EditBarMenuMethods>();

	let accountSettingsOpen = $state(false);
	let accountSettingsMethods = $state<EditBarMenuMethods>();

	let editBarEl = $state<HTMLDivElement>();
	let editBarWrapperEl = $state<HTMLDivElement>();
	let toggleModesButtonEl = $state<HTMLAnchorElement>();
	let editModeButtonHover = $state(false);

	// handles the fancy animation when toggling between view and edit mode
	// if i ever need to change any of this i'm just gonna cry ;-;
	function toggleMode(mode: 'editing' | 'viewing') {
		if (!editBarWrapperEl || !toggleModesButtonEl || !editBarEl) return;

		editing = mode === 'editing';

		if (editing) {
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

<div
	id="edit-bar-wrapper"
	transition:fly={{ y: 200 }}
	bind:this={editBarWrapperEl}
	class:viewing={!editing}
	class:expanded={themeEditorOpen || widgetPickerOpen || accountSettingsOpen}
>
	<WidgetPicker
		{user}
		{editBarEl}
		{editBarWrapperEl}
		bind:menu={widgetPickerMethods}
		bind:menuOpen={widgetPickerOpen}
	/>

	<div id="edit-bar" bind:this={editBarEl}>
		<!-- commands -->
		<div id="edit-commands">
			<button
				class="edit-command"
				onclick={() => widgetPickerMethods?.open()}
				aria-label="Add widget"
				inert={!editing}
				aria-hidden={!editing}
			>
				<Plus weight="regular" />
				<span class="label"> Add widget </span>
			</button>
			<!-- TODO: reimplement theme & account settings -->
			<!-- <button
					class="edit-command"
					onclick={() => (themeEditorOpen = !themeEditorOpen)}
					aria-label="Theme settings"
				>
					<Palette />
					<span class="label"> Theme settings </span>
				</button>
				<button
				class="edit-command"
				onclick={() => accountSettingsMethods?.open()}
				aria-label="Account settings"
				inert={!editing}
				aria-hidden={!editing}
			>
				<Gear />
				<span class="label"> Account settings </span>
			</button> -->
		</div>

		{#if editing}
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
				onclick={() => toggleMode('viewing')}
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
			<a
				href="/{user.username}"
				data-sveltekit-replacestate
				id="toggle-modes-button"
				class="view"
				aria-label="Switch to edit mode"
				onclick={() => toggleMode('editing')}
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

<style lang="scss">
	#edit-bar-wrapper {
		max-width: 800px;
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

		&.expanded {
			@media (max-width: 950px) {
				width: 100%;
				bottom: 0;
				border-radius: var(--widgets-border-base-radius) var(--widgets-border-base-radius) 0 0;
			}
		}
	}

	#edit-bar {
		display: flex;
		transition:
			transform 500ms cubic-bezier(0.8, -0.3, 0.1, 1.3),
			// fancy ass cubic bézier
			opacity 250ms ease 200ms;
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
