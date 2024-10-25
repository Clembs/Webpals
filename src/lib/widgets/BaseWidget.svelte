<script lang="ts">
	import type { User } from '$lib/db/schema/users';
	import type { AnyWidget } from '$lib/widgets/types';
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/Card.svelte';
	import { PencilIcon, Trash2Icon } from 'lucide-svelte';

	let {
		widget,
		modalOpened = $bindable(false),
		edit = $bindable(false),
		editMenu,
		children
	}: {
		modalOpened?: boolean;
		user: Partial<User>;
		widget?: AnyWidget;
		edit?: boolean;
		editMenu: Snippet;
		children: Snippet;
	} = $props();

	let widgetWrapperEl: HTMLDivElement | undefined = $state();
	let widgetDialogEl: HTMLDialogElement | undefined = $state();
	let widgetEditEl: HTMLDivElement | undefined = $state();

	const animationDurationSeconds = 250;
	const animationDuration = `${animationDurationSeconds}ms`;

	function expandDialog() {
		if (!widgetWrapperEl || !widgetDialogEl) return;

		const rect = widgetWrapperEl.getBoundingClientRect();

		if (!rect) return;

		modalOpened = true;
		widgetDialogEl.showModal();
		// get the dialog to take the dimensions of the widget
		widgetDialogEl.style.transform = 'none';
		widgetDialogEl.style.left = `${rect.x}px`;
		widgetDialogEl.style.top = `${rect.y}px`;
		widgetDialogEl.style.width = `${rect.width}px`;
		widgetDialogEl.style.height = `${rect.height}px`;
		// hide the widget
		widgetWrapperEl.style.opacity = '0.01';

		setTimeout(() => {
			if (!widgetDialogEl) return;
			widgetDialogEl.style.transition = `left ${animationDuration}, top ${animationDuration}, width ${animationDuration}, height ${animationDuration}, transform ${animationDuration}`;

			const widgetEditRect = widgetEditEl?.getBoundingClientRect();

			// transition to center
			widgetDialogEl.style.left = '50%';
			widgetDialogEl.style.top = '50%';
			widgetDialogEl.style.transform = 'translate(-50%, -50%)';
			widgetDialogEl.style.height = `${(widgetEditRect?.height || 200) + (parseInt(window.getComputedStyle(widgetDialogEl)?.padding.replace('px', '')) || 16) * 2.5}px`;
		}, 10);

		setTimeout(() => {
			// remove the transition
			widgetDialogEl!.style.transition = 'none';
			widgetDialogEl!.style.height = 'fit-content';
		}, animationDurationSeconds + 10);
	}

	function closeDialog(ev: Event) {
		ev.preventDefault();
		if (!widgetWrapperEl || !widgetDialogEl) return;

		modalOpened = false;

		// set dialog height to a value in px so it can animate
		const dialogRect = widgetDialogEl.getBoundingClientRect();
		widgetDialogEl.style.height = `${dialogRect.height}px`;

		// reset the dialog to the dimensions of the widget
		setTimeout(() => {
			if (!widgetDialogEl || !widgetWrapperEl) return;
			// enable the transition on the dialog
			widgetDialogEl.style.transition = `left ${animationDuration}, top ${animationDuration}, width ${animationDuration}, height ${animationDuration}, transform ${animationDuration}`;

			const wrapperRect = widgetWrapperEl.getBoundingClientRect();

			widgetDialogEl.style.left = `${wrapperRect.x}px`;
			widgetDialogEl.style.top = `${wrapperRect.y}px`;
			widgetDialogEl.style.transform = 'none';
			widgetDialogEl.style.width = `${wrapperRect.width}px`;
			widgetDialogEl.style.height = `${wrapperRect.height}px`;
		}, 10);

		setTimeout(() => {
			// close the dialog
			widgetDialogEl!.close();
			// show the widget
			widgetWrapperEl!.style.opacity = '1';
			// remove the transition and safely close the dialog
			widgetDialogEl!.style.transition = 'none';
		}, animationDurationSeconds + 10);
	}
</script>

<dialog
	aria-label="Edit widget"
	bind:this={widgetDialogEl}
	oncancel={(ev) => {
		closeDialog(ev);
	}}
>
	<div class="menu" bind:this={widgetEditEl}>
		{@render editMenu()}
	</div>
</dialog>

<div inert aria-hidden={true} class:open={modalOpened} class="dialog-backdrop"></div>

<div class="widget-wrapper" class:editing={edit} bind:this={widgetWrapperEl}>
	<div class="hover-menu">
		<button
			aria-label="Edit widget"
			onclick={() => {
				edit = true;
				expandDialog();
			}}
		>
			<PencilIcon size={20} />
		</button>
		{#if !widget}
			<!-- TODO: Delete widget & "deletable" field -->
			<button aria-label="Delete widget">
				<Trash2Icon size={20} />
			</button>
		{/if}
	</div>

	<Card>
		{@render children()}
	</Card>
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
		will-change: transform, width, height, left, top;

		&[open] {
			// opacity: 1;
			display: flex;
			flex-direction: column;
			will-change: transform, width, height, left, top;
		}

		&::backdrop {
			background-color: transparent;
		}
	}

	.widget-wrapper {
		position: relative;

		.hover-menu {
			opacity: 0;
			display: flex;
			transition:
				opacity 150ms,
				top 150ms;
			position: absolute;
			top: calc(0px - var(--base-padding) * 1.5);
			left: 50%;
			transform: translateX(-50%);
			background: var(--widgets-background-color);
			padding: calc(var(--base-padding) * 0.25);
			gap: calc(var(--base-gap) * 0.25);
			border: var(--widgets-border-width) solid var(--widgets-border-color);
			border-radius: calc(var(--widgets-border-base-radius));
			box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
				var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);

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

		&:hover .hover-menu,
		&:focus-within .hover-menu,
		&:active .hover-menu {
			transition:
				opacity 150ms,
				top 150ms;
			opacity: 1;
			top: calc(0px - var(--base-padding));
		}
	}
</style>
