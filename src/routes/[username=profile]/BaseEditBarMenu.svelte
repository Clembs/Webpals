<script lang="ts">
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { ArrowsOutSimple, CaretLeft } from 'phosphor-svelte';
	import { type Snippet } from 'svelte';

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

	let addWidgetMenuScroll = $state(0);

	// i am abusing svelte's animation directive to animate the opening and closing of the menu
	function openAnimation(menuEl: HTMLElement) {
		if (!editBarEl || !editBarWrapperEl) return {};

		// get the fixed dimensions of the wrapper so they can be animated
		const wrapperRect = editBarWrapperEl.getBoundingClientRect();

		// initial state of the menu
		menuEl.style.display = 'flex';
		menuEl.style.transition = 'opacity 500ms ease 200ms';
		menuEl.style.opacity = '0';

		// set fixed dimensions to the edit bar wrapper
		editBarWrapperEl.style.height = `${wrapperRect.height}px`;
		editBarWrapperEl.style.width = `${wrapperRect.width}px`;

		const mobile = window.matchMedia('(max-width: 950px)').matches;

		requestAnimationFrame(() => {
			if (!editBarEl || !editBarWrapperEl) return {};

			const openedMenuRect = menuEl.getBoundingClientRect();

			// animate the edit bar wrapper to the dimensions of the opened menu
			editBarWrapperEl.style.transition = `all 500ms cubic-bezier(0.75, -0.2, 0.15, 1)`;
			editBarWrapperEl.style.height =
				// see whats taller between the opened menu and the max height of the window (80% on mobile, 40% on desktop)
				`${Math.max(openedMenuRect.height, mobile ? window.innerHeight - 200 : 500)}px`;
			editBarWrapperEl.style.width = `${openedMenuRect.width}px`;

			editBarWrapperEl.classList.add('expanded');

			// fade out the edit bar
			editBarEl.style.transition = 'opacity 250ms ease';
			editBarEl.style.opacity = '0';
			editBarEl.style.pointerEvents = 'none';

			// fade in the opened menu
			menuEl.style.opacity = '1';
		});

		return {};
	}

	function closeAnimation(menuEl: HTMLElement) {
		if (!editBarEl || !editBarWrapperEl) return {};

		// get the fixed dimensions of the wrapper so they can be animated
		const wrapperRect = editBarWrapperEl.getBoundingClientRect();

		editBarWrapperEl.style.transition = `all 500ms cubic-bezier(0.75, -0.2, 0.15, 1)`;
		editBarWrapperEl.style.height = `${wrapperRect.height}px`;
		editBarWrapperEl.style.width = `${wrapperRect.width}px`;

		// fade out the opened menu
		menuEl.style.transition = 'opacity 500ms ease';
		menuEl.style.opacity = '0';

		// fade in the edit bar
		editBarEl.style.transition = 'opacity 250ms ease 250ms';
		editBarEl.style.opacity = '1';
		editBarEl.style.pointerEvents = 'all';

		const editBarRect = editBarEl.getBoundingClientRect();

		const targetHeight = editBarRect.height;
		const targetWidth = editBarRect.width;

		requestAnimationFrame(() => {
			editBarWrapperEl.style.height = `${targetHeight}px`;
			editBarWrapperEl.style.width = `${targetWidth}px`;

			menuEl.style.opacity = '0';

			editBarWrapperEl.classList.remove('expanded');
		});

		editBarWrapperEl.addEventListener(
			'transitionend',
			() => {
				editBarWrapperEl.style.transition = '';
				editBarWrapperEl.style.height = '';
				editBarWrapperEl.style.width = '';
				editBarEl.style.transition = '';
			},
			{ once: true }
		);

		return {
			duration: 250
		};
	}
</script>

<svelte:window
	onkeydown={(ev) => {
		if (ev.key === 'Escape' && !dialogPortal.wasOpened() && menuOpen) {
			menuOpen = false;
		}
	}}
/>

{#if menuOpen}
	<div in:openAnimation out:closeAnimation class="bar-menu">
		<div class="header" class:scrolling={addWidgetMenuScroll}>
			<div class="third">
				<button class="btn" onclick={() => (menuOpen = false)}>
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
{/if}

<style lang="scss">
	.bar-menu {
		display: none;
		flex-direction: column;
		background-color: var(--widgets-background-color);
		height: 100%;
		flex: 1;

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
