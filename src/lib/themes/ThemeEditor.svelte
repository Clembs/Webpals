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
		primaryButtons: {
			label: 'Primary Buttons',
			icon: RadioButton,
			component: PrimaryButtonsEditor
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
	import './theme-editor.scss';
	import type { Theme } from './types';
	import type { Component } from 'svelte';
	import { ArrowsInLineHorizontal, Gradient, RadioButton, Palette, Cards } from 'phosphor-svelte';
	import BackgroundEditor from './editor-tabs/BackgroundEditor.svelte';
	import WidgetEditor from './editor-tabs/WidgetEditor.svelte';
	import SpacingEditor from './editor-tabs/SpacingEditor.svelte';
	import PrimaryButtonsEditor from './editor-tabs/PrimaryButtonsEditor.svelte';

	let { theme = $bindable() }: { theme: Theme } = $props();

	let currentSection = $state<keyof typeof sections>('background');
	let CurrentSectionComponent = $derived(sections[currentSection].component);
</script>

<div id="theme-editor">
	<aside>
		<nav>
			{#each Object.entries(sections) as [key, { label, icon: Icon }] (key)}
				<button
					onclick={() => (currentSection = key as keyof typeof sections)}
					aria-current={key === currentSection}
				>
					<Icon />
					<span class="label">
						{label}
					</span>
				</button>
			{/each}
		</nav>
	</aside>

	<div class="component">
		<CurrentSectionComponent {theme} />
	</div>
</div>

<style lang="scss">
	#theme-editor {
		display: flex;
		padding: var(--base-padding);
		gap: calc(var(--base-gap) * 1.5);
		position: relative;
		min-height: 200px;

		@media (max-width: 950px) {
			flex-direction: column;
			padding-top: 0;
		}

		aside {
			max-width: 200px;
			width: 100%;
			flex-shrink: 0;
			position: sticky;
			inset: 0;

			@media (max-width: 950px) {
				max-width: none;
				width: calc(100% + var(--base-padding) * 2);
				margin: 0px calc(0px - var(--base-padding));
			}

			nav {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.25);

				@media (max-width: 950px) {
					gap: calc(var(--base-gap) * 0.75);
					flex-direction: row;
					overflow-x: auto;
					overflow-y: hidden;
					scrollbar-width: none;
					-webkit-overflow-scrolling: touch;
					&::-webkit-scrollbar {
						display: none;
					}
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
					min-width: max-content;
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
						padding: calc(var(--base-padding) * 0.5);

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
	}
</style>
