<script lang="ts" module>
	export const sections = {
		background: {
			label: 'Background',
			icon: Gradient,
			component: BackgroundEditor
		},
		widgets: {
			label: 'Widgets',
			icon: Cards,
			component: WidgetEditor
		},
		font: {
			label: 'Font',
			icon: TextAa,
			component: FontEditor
		},
		primaryButtons: {
			label: 'Primary Buttons',
			icon: RadioButton,
			component: PrimaryButtonsEditor
		},
		secondaryInputs: {
			label: 'Secondary Inputs',
			icon: Textbox,
			component: SecondaryInputsEditor
		},
		spacing: {
			label: 'Spacing',
			icon: ArrowsInLineHorizontal,
			component: SpacingEditor
		}
	} as const satisfies Record<
		string,
		{
			label: string;
			icon: typeof Palette;
			component: Component<{ theme: Theme }>;
		}
	>;
</script>

<script lang="ts">
	import type { Theme } from './types';
	import type { Component } from 'svelte';
	import {
		ArrowsInLineHorizontal,
		Gradient,
		RadioButton,
		Palette,
		Cards,
		TextAa,
		Textbox
	} from 'phosphor-svelte';
	import BackgroundEditor from './editor-tabs/BackgroundEditor.svelte';
	import WidgetEditor from './editor-tabs/WidgetEditor.svelte';
	import SpacingEditor from './editor-tabs/SpacingEditor.svelte';
	import PrimaryButtonsEditor from './editor-tabs/PrimaryButtonsEditor.svelte';
	import FontEditor from './editor-tabs/FontEditor.svelte';
	import SecondaryInputsEditor from './editor-tabs/SecondaryInputsEditor.svelte';

	let { theme = $bindable() }: { theme: Theme } = $props();

	let currentSection = $state<keyof typeof sections>('background');
	let CurrentSectionEditor = $derived(sections[currentSection].component);
</script>

<div id="theme-editor">
	<aside>
		<nav>
			{#each Object.entries(sections) as [key, { label, icon: Icon }] (key)}
				<button
					onclick={() => (currentSection = key as keyof typeof sections)}
					aria-current={key === currentSection}
				>
					<Icon weight={key === currentSection ? 'fill' : 'regular'} />
					<span class="label">
						{label}
					</span>
				</button>
			{/each}
		</nav>
	</aside>

	<div class="editor">
		<CurrentSectionEditor bind:theme />
	</div>
</div>

<style lang="scss">
	#theme-editor {
		display: flex;
		position: relative;
		min-height: 200px;
		border-top: var(--widgets-border-width) solid var(--widgets-border-color);
		height: 100%;

		@media (max-width: 950px) {
			flex-direction: column;
			padding-top: 0;
			min-height: 500px;
		}

		aside {
			max-width: max-content;
			width: 100%;
			flex-shrink: 0;
			background-color: var(--widgets-background-color);

			@media (max-width: 950px) {
				max-width: none;
				width: calc(100% + var(--base-padding) * 2);
				margin: 0px calc(0px - var(--base-padding));
			}

			nav {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.125);
				overflow-y: auto;
				padding: var(--base-padding);
				height: 100%;
				scrollbar-width: none;
				-webkit-overflow-scrolling: touch;
				&::-webkit-scrollbar {
					display: none;
				}

				@media (max-width: 950px) {
					height: auto;
					gap: calc(var(--base-gap) * 0.5);
					flex-direction: row;
					overflow-x: auto;
					overflow-y: hidden;
				}

				button {
					display: flex;
					align-items: center;
					gap: var(--base-gap);
					padding: calc(var(--base-padding) * 0.625) calc(var(--base-padding) * 0.75);
					border-radius: var(--inputs-border-base-radius);
					border: none;
					cursor: pointer;
					white-space: nowrap;
					background-color: transparent;

					@media (hover: hover) {
						&:hover {
							backdrop-filter: brightness(0.9);
						}
					}

					.label {
						white-space: nowrap;
					}

					@media (max-width: 950px) {
						padding: calc(var(--base-padding) * 0.5) calc(var(--base-padding) * 0.625);
						min-width: max-content;

						&:first-child {
							margin-left: var(--base-padding);
						}

						&:last-child {
							margin-right: var(--base-padding);
						}
					}

					&[aria-current='true'] {
						background-color: var(--inputs-on-background-color);
						color: var(--inputs-background-color);
					}
				}
			}
		}

		.editor {
			flex: 1;
			padding: var(--base-padding);
			overflow-y: auto;

			@media (max-width: 950px) {
				overflow: initial;
			}

			:global(section) {
				display: flex;
				flex-direction: column;
				gap: var(--base-gap);

				color: var(--color-paragraph);

				:global(label) {
					display: flex;
					flex-direction: column;
				}

				:global(.color-picker label) {
					display: flex;
					flex-direction: row;
				}

				:global(.color-picker .color) {
					border: var(--inputs-border-width) solid var(--inputs-border-color);
				}
			}
		}
	}
</style>
