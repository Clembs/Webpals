<script lang="ts">
	import type { PublicUser } from '$lib/db/schema/users';
	import type { AnyWidget } from '$lib/widgets/types';
	import { type Snippet } from 'svelte';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';
	import { PencilSimple, TrashSimple } from 'phosphor-svelte';
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { fly } from 'svelte/transition';

	let {
		editing,
		modalOpened = $bindable(false),
		widget,
		editMenu,
		children
	}: {
		editing?: boolean;
		modalOpened?: boolean;
		user: PublicUser;
		widget?: AnyWidget;
		editMenu?: Snippet;
		children: Snippet;
	} = $props();

	let widgetWrapperEl = $state<HTMLDivElement>();
	let widgetDialogEl = $state<HTMLDialogElement>();
	let widgetEditEl = $state<HTMLDivElement>();

	const animationDurationMs = 350;

	function expandDialog() {
		if (!widgetWrapperEl || !widgetDialogEl) return;

		const rect = widgetWrapperEl.getBoundingClientRect();

		if (!rect) return;

		modalOpened = true;
		widgetDialogEl.showModal();

		// hide the original widget
		widgetWrapperEl.style.visibility = 'hidden';

		// get the dimensions of the dialog's contents so we can animate to it
		const widgetEditRect = widgetEditEl?.getBoundingClientRect();

		const animation = widgetDialogEl.animate(
			[
				{
					transformOrigin: 'top left',
					left: '0%',
					top: '0%',
					transform: `translate(${rect.left}px, ${rect.top}px)`,
					width: `${rect.width}px`,
					height: `${rect.height}px`
				},
				{
					transformOrigin: 'top left',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					width: '700px',
					// the widget's height plus the padding of the dialog
					// we need to get the computed padding because it depends on the user's theme
					height: `${(widgetEditRect?.height || 200) + (parseInt(window.getComputedStyle(widgetDialogEl)?.padding.replace('px', '')) || 16) * 2}px`
				}
			],
			{
				duration: animationDurationMs,
				easing: 'cubic-bezier(0.75, -0.2, 0.15, 1.2)',
				fill: 'forwards'
			}
		);

		animation.finished.then(() => {
			// set the dialog height to fit the content so that
			// the dialog can be expanded (when there's a textarea, for example)
			widgetDialogEl!.style.minHeight = 'fit-content';
		});
	}

	function closeDialog(ev: Event) {
		ev.preventDefault();
		if (!widgetWrapperEl || !widgetDialogEl) return;

		modalOpened = false;

		const rect = widgetWrapperEl.getBoundingClientRect();

		if (!rect) return;

		// get the dimensions of the dialog's contents so we can animate to it
		const widgetEditRect = widgetEditEl?.getBoundingClientRect();

		// reset min-height so the dialog can shrink
		widgetDialogEl!.style.minHeight = 'auto';

		const animation = widgetDialogEl.animate(
			[
				{
					transformOrigin: 'top left',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					width: '700px',
					height: `${(widgetEditRect?.height || 200) + (parseInt(window.getComputedStyle(widgetDialogEl)?.padding.replace('px', '')) || 16) * 2}px`
				},
				{
					transformOrigin: 'top left',
					left: '0%',
					top: '0%',
					transform: `translate(${rect.left}px, ${rect.top}px)`,
					width: `${rect.width}px`,
					height: `${rect.height}px`
				}
			],
			{
				duration: animationDurationMs,
				easing: 'cubic-bezier(0.75, -0.2, 0.15, 1.2)',
				fill: 'forwards'
			}
		);

		// wait for the animation to finish before closing the dialog
		// or it brutally interrupts because of display: none;
		animation.finished.then(() => {
			widgetDialogEl!.close();
			widgetWrapperEl!.style.visibility = '';
		});
	}

	$effect(() => {
		if (!editMenu) return;

		if (modalOpened) {
			expandDialog();
		} else {
			closeDialog(new Event('cancel'));
		}
	});
</script>

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
	{#if editing && editMenu}
		<dialog aria-label="Edit widget" bind:this={widgetDialogEl} oncancel={closeDialog}>
			<div class="menu" bind:this={widgetEditEl}>
				{@render editMenu()}
			</div>
		</dialog>

		<div inert aria-hidden={true} class:open={modalOpened} class="dialog-backdrop"></div>
	{/if}

	<div class="widget-wrapper" class:editing={modalOpened} bind:this={widgetWrapperEl}>
		{#if editing}
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

		<Card inert={editing}>
			{@render children()}
		</Card>
	</div>
</div>

<style lang="scss">
	.dialog-backdrop {
		background-color: transparent;
		transition: background-color 200ms;
		position: fixed;
		inset: 0;
		height: 100vh;
		width: 100vw;
		z-index: 99;

		&.open {
			background-color: #00000060;
			// transition: background-color 100ms;
		}
	}

	dialog {
		// opacity: 0;
		gap: var(--base-gap);
		background-color: var(--widgets-background-color);
		padding: var(--base-padding);
		border-radius: var(--widgets-border-base-radius);
		border: var(--widgets-border-width) solid var(--widgets-border-color);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);
		overflow: hidden;
		/* will-change: transform, width, height, left, top; */
		max-width: 100%;
		// margin: auto;

		&[open] {
			// opacity: 1;
			// display: flex;
			flex-direction: column;
			// will-change: transform, width, height, left, top;
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
			gap: calc(var(--base-gap) * 0.25);

			button {
				border: none;
				border: var(--inputs-border-width) solid var(--inputs-border-color);
				border-radius: calc(var(--inputs-border-base-radius) + var(--base-padding) * 0.25);
				background: var(--widgets-background-color-dim);
				padding: calc(var(--base-padding) * 0.25);
				color: var(--inputs-on-background-color);
				cursor: pointer;
			}
		}
	}

	.confirm-delete {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		h2 {
			font-size: 1.5rem;
			text-wrap: balance;
		}

		.buttons {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			justify-content: flex-end;
		}
	}
</style>
