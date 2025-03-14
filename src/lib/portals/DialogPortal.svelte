<!-- TODO: lock the body when a dialog is opened -->

<script lang="ts">
	import { dialogPortal } from './dialog.svelte';
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			dialogPortal.closeDialog();
		}
	}}
/>

<dialog-portal>
	<div
		class="dialog-backdrop"
		class:open={dialogPortal.current}
		inert={!dialogPortal.current}
		aria-hidden={true}
		onclick={() =>
			dialogPortal.current &&
			dialogPortal.current.options.allowClickOutside &&
			dialogPortal.closeDialog()}
	></div>

	{#each dialogPortal.history as dialog, i}
		<!-- svelte-ignore a11y_autofocus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			role="dialog"
			class="dialog-window"
			inert={i !== dialogPortal.history.length - 1}
			aria-current={i === dialogPortal.history.length - 1}
			style:--nested-level={dialogPortal.history.length - i}
			autofocus
		>
			{@render dialog.component(dialog.props)}
		</div>
	{/each}
</dialog-portal>

<style lang="scss">
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		opacity: 0;
		transition: opacity 100ms;

		&.open {
			transition: opacity 200ms;
			opacity: 1;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}

	.dialog-window {
		position: fixed;
		// ok this is a bit hacky but basically
		// "inset: 0; margin: auto" centers the thing without resorting to
		// "left: 50%; top: 50%; transform: translate(-50%, -50%);"
		// since that makes the dialog only take a third of the viewport max (so on mobile it looks like shit)
		// we set the height & width to "fit-content" because otherwise its set to 100% for some reason
		// but the max width is 600px, OR the width of the viewport minus 2*base-padding to create some side spacing
		// whew
		inset: 0;
		margin: auto;
		width: fit-content;
		height: fit-content;
		max-width: min(600px, calc(100% - 2 * var(--base-padding)));
		min-width: min(300px, calc(100% - 2 * var(--base-padding)));

		transition:
			scale 200ms,
			opacity 200ms;
		z-index: 1001;

		background-color: var(--widgets-background-color);
		border-radius: var(--widgets-border-base-radius);
		border: var(--widgets-border-width) solid var(--widgets-border-color);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-spread)
			var(--widgets-box-shadow-color);
		padding: var(--base-padding);

		&[inert] {
			pointer-events: none;
			// for each level of nesting:
			// - add 2px of blur
			// - decrease brightness by 0.05
			// - decrease scale by 0.05
			filter: blur(calc(2px * var(--nested-level))) brightness(calc(1 - 0.1 * var(--nested-level)));
			scale: calc(1 - 0.05 * var(--nested-level));
		}

		& :global(> form) {
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);

			:global(h2) {
				font-size: 1.5rem;
				text-wrap: balance;
			}

			:global(.buttons) {
				display: flex;
				gap: calc(var(--base-gap) * 0.5);
				justify-content: flex-end;
			}
		}

		animation: fadeIn 200ms;

		@keyframes fadeIn {
			from {
				opacity: 0;
				scale: 1.1;
			}
			to {
				opacity: 1;
				scale: 1;
			}
		}

		@keyframes slideUp {
			from {
				transform: translateY(50vh);
			}
			to {
				transform: translateY(0);
			}
		}

		@media (prefers-reduced-motion: reduce) {
			animation: none;
		}

		@media (max-width: 768px) {
			width: 100%;
			border-radius: var(--widgets-border-base-radius) var(--widgets-border-base-radius) 0 0;
			max-width: 100%;
			min-width: 100%;
			top: auto;
			bottom: -20px;
			padding-bottom: 40px;
			animation: slideUp 300ms cubic-bezier(0.25, -0.1, 0, 1.35);
		}
	}
</style>
