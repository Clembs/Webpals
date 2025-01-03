<script lang="ts" module>
	export type EditBarMenuMethods = {
		open: () => void;
		close: () => void;
	};
</script>

<script lang="ts">
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { ArrowsOutSimple, CaretLeft } from 'phosphor-svelte';
	import type { Snippet } from 'svelte';

	let {
		name,
		expandHref,
		rightButton,
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl,
		children
	}: {
		name: string;
		expandHref?: string;
		rightButton?: Snippet;
		menuOpen: boolean;
		editBarEl: HTMLDivElement | undefined;
		editBarWrapperEl: HTMLDivElement | undefined;
		children: Snippet;
	} = $props();

	let menuEl = $state<HTMLDivElement>();

	let addWidgetMenuScroll = $state(0);

	export function open() {
		if (!menuEl || !editBarEl || !editBarWrapperEl) return;

		// get the dimensions of the edit bar wrapper so we can animate to it
		const wrapperRect = editBarWrapperEl.getBoundingClientRect();

		// show the widget picker
		menuEl.style.display = 'flex';
		menuEl.style.transition = 'opacity 500ms ease 200ms';
		menuEl.style.opacity = '0';

		// set fixed dimensions to the edit bar wrapper
		editBarWrapperEl.style.height = `${wrapperRect.height}px`;
		editBarWrapperEl.style.width = `${wrapperRect.width}px`;

		const mobile = window.matchMedia('(max-width: 950px)').matches;

		requestAnimationFrame(() => {
			if (!editBarEl || !editBarWrapperEl || !menuEl) return;

			const openedMenuRect = menuEl.getBoundingClientRect();

			// animate the edit bar wrapper to the dimensions of the opened menu
			editBarWrapperEl.style.transition = `all 500ms cubic-bezier(0.8, -0.3, 0.1, 1.3)`;
			editBarWrapperEl.style.height =
				// see whats taller between the opened menu and the max height of the window (80% on mobile, 40% on desktop)
				`${Math.max(openedMenuRect.height, window.innerHeight * (mobile ? 0.8 : 0.4))}px`;
			editBarWrapperEl.style.width = mobile ? `100%` : `${openedMenuRect.width}px`;

			menuOpen = true;

			// fade out the edit bar
			editBarEl.style.opacity = '0';
			editBarEl.style.pointerEvents = 'none';

			// fade in the opened menu
			menuEl.style.opacity = '1';
		});

		editBarWrapperEl.addEventListener(
			'transitionend',
			() => {
				if (!editBarWrapperEl || !menuEl) return;

				// set the dimensions of the edit bar wrapper to be lax
				// editBarWrapperEl.style.height = '';
				// editBarWrapperEl.style.width = '';
			},
			{ once: true }
		);
	}

	export function close() {
		if (!menuEl || !editBarEl || !editBarWrapperEl) return;

		// get the dimensions of the edit bar wrapper so we can animate to it
		const wrapperRect = editBarWrapperEl.getBoundingClientRect();

		// animate the edit bar wrapper to the dimensions of the opened menu
		editBarWrapperEl.style.height = `${wrapperRect.height}px`;
		editBarWrapperEl.style.width = `${wrapperRect.width}px`;

		// fade out the opened menu
		menuEl.style.transition = 'opacity 250ms ease';
		menuEl.style.opacity = '0';

		// fade in the edit bar
		editBarEl.style.opacity = '1';
		editBarEl.style.pointerEvents = 'all';

		requestAnimationFrame(() => {
			if (!editBarEl || !editBarWrapperEl || !menuEl) return;

			const editBarRect = editBarEl.getBoundingClientRect();

			// reset the dimensions of the edit bar wrapper
			editBarWrapperEl.style.transition = `all 500ms cubic-bezier(0.8, -0.3, 0.1, 1.3)`;
			editBarWrapperEl.style.height = `${editBarRect.height}px`;
			editBarWrapperEl.style.width = `${editBarRect.width}px`;
			menuOpen = false;
		});

		editBarWrapperEl.addEventListener(
			'transitionend',
			() => {
				if (!editBarWrapperEl || !menuEl) return;

				// set the dimensions of the edit bar wrapper to be lax
				editBarWrapperEl.style.height = '';
				editBarWrapperEl.style.width = '';

				menuEl.style.display = '';
			},
			{ once: true }
		);
	}
</script>

<svelte:window
	onkeydown={(ev) => {
		if (ev.key === 'Escape' && !dialogPortal.wasOpened() && menuOpen) {
			close();
		}
	}}
/>

<div bind:this={menuEl} class="bar-menu" class:open={menuOpen}>
	<div class="header" class:scrolling={addWidgetMenuScroll}>
		<div class="third">
			<button
				class="btn"
				onclick={() => {
					close();
				}}
			>
				<CaretLeft weight="regular" />
			</button>
		</div>

		<div class="third">
			<h2>{name}</h2>
		</div>

		<div class="third">
			{#if expandHref}
				<a aria-label="Expand settings" class="btn" href="/settings/account">
					<ArrowsOutSimple weight="regular" />
				</a>
			{:else if rightButton}
				{@render rightButton()}
			{:else}
				<div></div>
			{/if}
		</div>
	</div>

	<div
		class="scrollable"
		onscroll={(ev) => (addWidgetMenuScroll = (ev.target as HTMLUListElement).scrollTop)}
	>
		{@render children()}
	</div>
</div>

<style lang="scss">
	.bar-menu {
		display: none;
		flex-direction: column;
		background-color: var(--widgets-background-color);
		opacity: 0;
		transition: opacity 500ms ease 200ms;
		height: 100%;

		@media (max-width: 950px) {
			min-width: 100%;
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--base-gap);
			padding: calc(var(--base-padding) * 1.25);
			border-bottom: var(--widgets-border-width) solid transparent;
			transition: border-color 200ms;

			.third {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				&:first-child {
					justify-content: flex-start;
				}

				&:last-child {
					justify-content: flex-end;
				}
			}

			h2 {
				text-align: center;
			}

			&.scrolling {
				border-bottom: var(--widgets-border-width) solid var(--widgets-border-color);
			}

			.btn {
				background: none;
				border: none;
				cursor: pointer;
				padding: calc(var(--base-padding) * 0.5);
				border-radius: var(--widgets-border-base-radius);

				&:hover,
				&:focus-visible {
					background-color: var(--widgets-background-color-dim);
				}
			}
		}

		.scrollable {
			display: flex;
			flex-direction: column;
			overflow-y: scroll;
			flex: 1;
		}
	}
</style>
