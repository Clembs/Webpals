<script lang="ts" module>
	// thanks a LOT to @paolo.ricciuti.me for their help with figuring out this!!
	// https://bsky.app/profile/paolo.ricciuti.me/post/3lehtcrthvc2i
	let isAnyWidgetEditing = $state({
		value: false
	});

	export { isAnyWidgetEditing };
</script>

<script lang="ts">
	import type { PublicUser } from '$lib/db/schema/users';
	import type { AnyWidget } from '$lib/widgets/types';
	import { tick, type Snippet } from 'svelte';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';
	import { PencilSimple, TrashSimple } from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { fade, fly } from 'svelte/transition';

	let {
		editingMode,
		isWidgetEditing = $bindable(false),
		widget,
		editMenu,
		children
	}: {
		editingMode?: boolean;
		isWidgetEditing?: boolean;
		user: PublicUser;
		widget?: AnyWidget;
		editMenu?: Snippet;
		children: Snippet;
	} = $props();

	let wrapperEl = $state<HTMLDivElement>();
	let dialogEl = $state<HTMLDivElement>();
	let dialogContentsEl = $state<HTMLDivElement>();
	let dialogOpen = $state(false);

	const animationDurationMs = 350;

	function expandDialog() {
		if (!wrapperEl) return;

		isWidgetEditing = true;
		isAnyWidgetEditing.value = true;
		dialogOpen = true;

		// hide the original widget
		wrapperEl.style.visibility = 'hidden';

		// wait for the dialog component to be mounted before animating
		tick();

		requestAnimationFrame(() => {
			if (!dialogEl || !wrapperEl) return;
			// get the dimensions of the widget wrapper & the dialog's contents so we can animate to it
			const wrapperRect = wrapperEl.getBoundingClientRect();

			// set the dialog
			dialogEl.style.transition = '';
			dialogEl.style.left = `${wrapperRect.x}px`;
			dialogEl.style.top = `${wrapperRect.y}px`;
			dialogEl.style.width = `${wrapperRect.width}px`;
			dialogEl.style.height = `${wrapperRect.height}px`;
		});

		// wait for the next frame to animate
		requestAnimationFrame(() => {
			if (!dialogEl || !dialogContentsEl) return;
			// the widget's height plus the padding of the dialog
			// we need to get the computed padding because it depends on the user's theme (default to 1rem, aka 16px)
			const dialogContentsRect = dialogContentsEl.getBoundingClientRect();
			const dialogPadding =
				parseInt(window.getComputedStyle(dialogEl).padding.replace('px', '')) || 16;

			dialogEl.style.transition = `all ${animationDurationMs}ms cubic-bezier(0.75, -0.2, 0.15, 1.2)`;

			// transition to center
			dialogEl.style.left = '50%';
			dialogEl.style.top = '50%';
			dialogEl.style.transform = 'translate(-50%, -50%)';
			dialogEl.style.width = '700px';
			// set a absolute height so it can be animated
			dialogEl.style.height = `${dialogContentsRect.height + dialogPadding * 2}px`;

			dialogEl.addEventListener(
				'transitionend',
				() => {
					// set the dialog height to fit the content so that
					// the dialog can be expanded (when there's a textarea, for example)
					dialogEl!.style.height = 'fit-content';
				},
				{ once: true }
			);
		});
	}

	export function closeDialog(ev?: Event, force = false) {
		if (ev) ev.preventDefault();

		// if the els aren't here, or that isWidgetEditing is already false, return (override isWidgetEditing with force)
		if ((!force && !isWidgetEditing) || !dialogOpen || !wrapperEl || !dialogEl) return;

		// we change the variable first so the background can darken at the same time
		isWidgetEditing = false;
		isAnyWidgetEditing.value = false;

		// set dialog height to a value in px so it can animate
		const dialogRect = dialogEl.getBoundingClientRect();
		if (!dialogRect) return;

		dialogEl.style.transition = '';
		dialogEl.style.height = `${dialogRect.height}px`;

		requestAnimationFrame(() => {
			if (!wrapperEl || !dialogEl) return;
			// enable transition
			dialogEl.style.transition = `all ${animationDurationMs}ms cubic-bezier(0.75, -0.2, 0.15, 1.2)`;

			const wrapperRect = wrapperEl.getBoundingClientRect();
			if (!wrapperRect) return;

			dialogEl.style.left = `${wrapperRect.x}px`;
			dialogEl.style.top = `${wrapperRect.y}px`;
			dialogEl.style.transform = 'none';
			dialogEl.style.width = `${wrapperRect.width}px`;
			dialogEl.style.height = `${wrapperRect.height}px`;
		});

		dialogEl.addEventListener(
			'transitionend',
			() => {
				// show the original widget
				wrapperEl!.style.visibility = '';

				// wait for the animation to finish & everything to be done before removing the dialog
				requestAnimationFrame(() => {
					dialogOpen = false;
				});
			},
			{ once: true }
		);
	}

	$effect(() => {
		if (!editMenu) return;

		if (!isWidgetEditing) {
			closeDialog(new Event(''), true);
		}
	});
</script>

<svelte:window
	onkeydown={(ev) => {
		if (ev.key === 'Escape') {
			closeDialog();
		}
	}}
/>

{#snippet confirmDeleteDialog()}
	<form
		use:enhance={() =>
			({ update }) => {
				dialogPortal.closeDialog();
				update();
			}}
		action="/api/profile?/deleteWidget&id={widget!.id}"
		method="post"
		class="confirm-delete"
	>
		<h2>Are you sure you want to delete this widget?</h2>

		<p>
			Contents of the widget will be lost. You can bring it back with the + menu, but it will be
			blank.
		</p>

		<div class="buttons">
			<Button inline type="button" variant="secondary" onclick={() => dialogPortal.closeDialog()}>
				Cancel
			</Button>
			<Button inline type="submit" variant="urgent">Delete widget</Button>
		</div>
	</form>
{/snippet}

<div class="widget-root">
	{#if editingMode && editMenu}
		{#if dialogOpen}
			<div
				role="dialog"
				aria-current={dialogOpen}
				inert={!dialogOpen}
				aria-label="Edit widget"
				bind:this={dialogEl}
			>
				<div class="menu" bind:this={dialogContentsEl}>
					{@render editMenu()}
				</div>
			</div>
		{/if}

		{#if isWidgetEditing}
			<div
				aria-hidden={true}
				transition:fade={{ duration: animationDurationMs }}
				class="dialog-backdrop"
				onclick={(ev) => closeDialog(ev)}
			></div>
		{/if}
	{/if}

	<div class="widget-wrapper" class:editing={isWidgetEditing} bind:this={wrapperEl}>
		{#if editingMode}
			<div class="hover-menu" transition:fly={{ duration: 150, y: -10 }}>
				{#if editMenu}
					<button aria-label="Edit widget" onclick={expandDialog}>
						<PencilSimple size={20} />
					</button>
				{/if}
				{#if widget}
					<!-- if the menu is editable, open the dialog to confirm deletion -->
					{#if editMenu}
						<button
							onclick={() => dialogPortal.openDialog(confirmDeleteDialog)}
							aria-label="Delete widget"
						>
							<TrashSimple size={20} />
						</button>
						<!-- otherwise we dont really care and can delete right away -->
					{:else}
						<form use:enhance action="/api/profile?/deleteWidget&id={widget.id}" method="post">
							<button aria-label="Delete widget">
								<TrashSimple size={20} />
							</button>
						</form>
					{/if}
				{/if}
			</div>
		{/if}

		<Card inert={editingMode}>
			{@render children()}
		</Card>
	</div>
</div>

<style lang="scss">
	.dialog-backdrop {
		background-color: transparent;
		transition: background-color;
		position: fixed;
		inset: 0;
		height: 100vh;
		width: 100vw;
		z-index: 99;
		background-color: #00000060;
	}

	[role='dialog'] {
		display: none;
		gap: var(--base-gap);
		background-color: var(--widgets-background-color);
		padding: var(--base-padding);
		border-radius: var(--widgets-border-base-radius);
		border: var(--widgets-border-width) solid var(--widgets-border-color);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);
		overflow: hidden;
		max-width: 100%;
		max-height: calc(100vh - var(--base-padding) * 2);
		max-height: calc(100dvh - var(--base-padding) * 2);
		overflow-y: auto;

		&[aria-current='true'] {
			display: flex;
			flex-direction: column;
			position: fixed;
			z-index: 999;
		}

		&::backdrop {
			background-color: transparent;
		}
	}

	.widget-wrapper {
		position: relative;

		.hover-menu {
			display: flex;
			position: absolute;
			right: calc(var(--base-padding) * 0.25);
			top: calc(var(--base-padding) * 0.25);
			padding: calc(var(--base-padding) * 0.25);

			button {
				border: none;
				border: var(--inputs-border-width) solid var(--inputs-border-color);
				background: var(--widgets-background-color-dim);
				padding: calc(var(--base-padding) * 0.375);
				color: var(--inputs-on-background-color);
				cursor: pointer;

				&:first-child {
					border-radius: var(--inputs-border-base-radius) 0 0 var(--inputs-border-base-radius);
					border-right: none;
				}

				&:last-child {
					border-radius: 0 var(--inputs-border-base-radius) var(--inputs-border-base-radius) 0;
				}

				&:first-child:last-child {
					border-radius: var(--inputs-border-base-radius);
					border-right: var(--inputs-border-width) solid var(--inputs-border-color);
				}

				&:hover,
				&:focus-within {
					filter: brightness(0.9);
				}
			}
		}
	}
</style>
