<script lang="ts">
	import { CaretLeft } from 'phosphor-svelte';
	import BasePlaceholderWidget from '$lib/widgets/picker/BasePlaceholderWidget.svelte';
	import { defaultWidgets } from '$lib/widgets/default-widgets';
	import type { FullUser } from '$lib/db/schema/users';
	import PlaceholderFriendsWidget from '$lib/widgets/picker/PlaceholderFriendsWidget.svelte';
	import PlaceholderMusicWidget from '$lib/widgets/picker/PlaceholderMusicWidget.svelte';
	import PlaceholderConnectionsWidgets from '$lib/widgets/picker/PlaceholderConnectionsWidgets.svelte';

	let {
		user,
		widgetPickerEl = $bindable(),
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		user: FullUser;
		widgetPickerEl: HTMLDivElement | undefined;
		menuOpen: boolean;
		editBarEl: HTMLDivElement | undefined;
		editBarWrapperEl: HTMLDivElement | undefined;
	} = $props();

	let addWidgetMenuScroll = $state(0);

	export function openMenu() {
		if (!widgetPickerEl || !editBarEl || !editBarWrapperEl) return;

		// get the dimensions of the edit bar wrapper so we can animate to it
		const wrapperRect = editBarWrapperEl.getBoundingClientRect();

		// show the widget picker
		widgetPickerEl.style.display = 'flex';
		widgetPickerEl.style.transition = 'opacity 500ms ease 200ms';
		widgetPickerEl.style.opacity = '0';

		// set fixed dimensions to the edit bar wrapper
		editBarWrapperEl.style.height = `${wrapperRect.height}px`;
		editBarWrapperEl.style.width = `${wrapperRect.width}px`;

		const mobile = window.matchMedia('(max-width: 950px)').matches;

		requestAnimationFrame(() => {
			if (!editBarEl || !editBarWrapperEl || !widgetPickerEl) return;

			const openedMenuRect = widgetPickerEl.getBoundingClientRect();

			// animate the edit bar wrapper to the dimensions of the opened menu
			editBarWrapperEl.style.transition = `all 500ms cubic-bezier(0.8, -0.3, 0.1, 1.3)`;
			editBarWrapperEl.style.height = `${openedMenuRect.height}px`;
			editBarWrapperEl.style.width = mobile ? `100%` : `${openedMenuRect.width}px`;

			menuOpen = true;

			// fade out the edit bar
			editBarEl.style.top = `translateY(-100%)`;
			editBarEl.style.opacity = '0';
			editBarEl.style.pointerEvents = 'none';

			// fade in the opened menu
			widgetPickerEl.style.opacity = '1';
		});
	}

	export function closeSubMenu() {
		if (!widgetPickerEl || !editBarEl || !editBarWrapperEl) return;

		// get the dimensions of the edit bar wrapper so we can animate to it
		const wrapperRect = editBarWrapperEl.getBoundingClientRect();

		// animate the edit bar wrapper to the dimensions of the opened menu
		editBarWrapperEl.style.transition = `all 500ms cubic-bezier(0.8, -0.3, 0.1, 1.3)`;
		editBarWrapperEl.style.height = `${wrapperRect.height}px`;
		editBarWrapperEl.style.width = `${wrapperRect.width}px`;

		// fade out the opened menu
		widgetPickerEl.style.transition = 'opacity 250ms ease';
		widgetPickerEl.style.opacity = '0';

		// fade in the edit bar
		editBarEl.style.top = `translateY(0)`;
		editBarEl.style.opacity = '1';
		editBarEl.style.pointerEvents = 'all';

		requestAnimationFrame(() => {
			if (!editBarEl || !editBarWrapperEl || !widgetPickerEl) return;

			const editBarRect = editBarEl.getBoundingClientRect();

			// reset the dimensions of the edit bar wrapper
			editBarWrapperEl.style.height = `${editBarRect.height}px`;
			editBarWrapperEl.style.width = `${editBarRect.width}px`;
			menuOpen = false;
		});

		editBarWrapperEl.addEventListener(
			'transitionend',
			() => {
				if (!editBarWrapperEl || !widgetPickerEl) return;

				// set the dimensions of the edit bar wrapper to be lax
				editBarWrapperEl.style.height = '';
				editBarWrapperEl.style.width = '';

				widgetPickerEl.style.display = '';
			},
			{ once: true }
		);
	}
</script>

<div bind:this={widgetPickerEl} id="widget-picker" class:open={menuOpen}>
	<div class="header" class:scrolling={addWidgetMenuScroll}>
		<button
			class="close-btn"
			onclick={() => {
				closeSubMenu();
			}}
		>
			<CaretLeft weight="regular" />
		</button>

		<h2>Add a widget</h2>

		<div></div>
	</div>

	<div
		class="scrollable"
		onscroll={(ev) => (addWidgetMenuScroll = (ev.target as HTMLUListElement).scrollTop)}
	>
		<ul class="widgets">
			<!-- filter widgets that are not in a user's widgets
			user.widgets is an array of arrays containing the widgets -->
			{#each defaultWidgets.filter((e) => !user.widgets.find( (c) => c.find((w) => w.id === e.id) )) as widget}
				{#if widget.id === 'about_me'}
					<BasePlaceholderWidget bind:showPicker={menuOpen} widget-id={widget.id}>
						<h3>About me</h3>
						<p>Write a little bit about yourself.</p>
					</BasePlaceholderWidget>
				{:else if widget.id === 'friends'}
					<PlaceholderFriendsWidget bind:showPicker={menuOpen} />
				{:else if widget.id === 'music'}
					<PlaceholderMusicWidget bind:showPicker={menuOpen} />
				{:else if widget.id === 'connections'}
					<PlaceholderConnectionsWidgets bind:showPicker={menuOpen} />
				{/if}
			{/each}
		</ul>
	</div>
</div>

<style lang="scss">
	@use '../../styles/mixins.scss';

	#widget-picker {
		display: none;
		flex-direction: column;
		background-color: var(--widgets-background-color);
		max-height: 40vh;
		// width: max-content;
		opacity: 0;
		transition: opacity 500ms ease 200ms;
		width: 100%;

		// &.open {
		// 	display: flex;
		// }

		.close-btn {
			background: none;
			border: none;
			cursor: pointer;
			padding: calc(var(--base-padding) * 0.5);
			border-radius: var(--widgets-border-base-radius);

			&:hover {
				background-color: var(--widgets-background-color-dim);
			}
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--base-gap);
			padding: calc(var(--base-padding) * 1.25);
			border-bottom: var(--widgets-border-width) solid transparent;
			transition: border-color 200ms;

			&.scrolling {
				border-bottom: var(--widgets-border-width) solid var(--widgets-border-color);
			}
		}

		.scrollable {
			display: flex;
			flex-direction: column;
			overflow-y: scroll;
		}

		.widgets {
			columns: 2;
			list-style: none;
			padding: calc(var(--base-padding) * 1.25);
			padding-top: 0;
			margin: 0;

			@media (max-width: 950px) {
				columns: 1;
			}
		}

		// @media (max-width: 800px) {
		// 	max-height: 60vh;
		// }

		&::backdrop {
			background: rgba(0, 0, 0, 0.5);
		}
	}
</style>
