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
					{label}
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

		aside {
			max-width: 200px;
			width: 100%;
			flex-shrink: 0;
			position: sticky;
			inset: 0;

			nav {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.25);
				// overflow-x: scroll;

				button {
					display: flex;
					align-items: center;
					gap: var(--base-gap);
					padding: calc(var(--base-padding) * 0.625) calc(var(--base-padding) * 0.75);
					border-radius: var(--inputs-border-base-radius);
					border: none;
					cursor: pointer;

					background-color: transparent;

					&:hover {
						backdrop-filter: brightness(0.9);
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
