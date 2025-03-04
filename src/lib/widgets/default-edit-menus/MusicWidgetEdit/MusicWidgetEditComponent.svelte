<script lang="ts">
	import { MusicNote } from 'phosphor-svelte';
	import { type MusicProvider, musicProviders } from '$lib/helpers/music';
	import type { MusicWidget, WidgetComponentProps } from '../../types';
	import MusicProviderSearch from './MusicProviderSearch.svelte';
	import MusicUpload from './MusicUpload.svelte';

	let {
		widget,
		modalOpened = $bindable(false)
	}: WidgetComponentProps<MusicWidget> & {
		modalOpened: boolean;
	} = $props();

	let selectedProvider = $state<MusicProvider>(widget.provider || musicProviders[0].value);
	let selectedProviderData = $derived(musicProviders.find((p) => p.value === selectedProvider));
</script>

<div class="music-widget">
	<aside>
		<div class="header">
			<MusicNote />

			<h2>Edit Music</h2>
		</div>
		<ul id="music-providers">
			{#each musicProviders.toSorted( (p) => (widget.provider ? (widget.provider === p.value ? 0 : -1) : 0) ) as provider}
				<li>
					<input
						id="provider-{provider.value}"
						type="radio"
						name="music-provider"
						value={provider.value}
						checked={selectedProvider === provider.value}
						onchange={() => (selectedProvider = provider.value)}
					/>
					<label class="music-provider" for="provider-{provider.value}">
						<provider.icon />
						{provider.label}
					</label>
				</li>
			{/each}
		</ul>
	</aside>

	<div class="content">
		{#if selectedProvider !== 'local' && selectedProviderData}
			<MusicProviderSearch {selectedProvider} bind:modalOpened />
		{:else}
			<MusicUpload bind:modalOpened />
		{/if}
	</div>
</div>

<style lang="scss">
	.music-widget {
		display: flex;
		margin: calc(0px - var(--base-padding));
	}

	aside {
		flex-shrink: 0;
		padding: var(--base-padding);
		border-right: var(--inputs-border-width) solid var(--inputs-border-color);

		.header {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;
			color: var(--color-heading);
			margin-bottom: var(--base-gap);

			h2 {
				font-size: 1.25rem;
			}
		}

		#music-providers {
			display: flex;
			flex-direction: column;
			gap: calc(var(--base-gap) * 0.25);
			list-style: none;
			min-width: 200px;

			[type='radio'] {
				height: 1px;
				width: 1px;
				position: fixed;
				top: -1px;
				left: -1px;

				&:checked + .music-provider {
					background-color: var(--buttons-primary-background-color);
					color: var(--buttons-primary-on-background-color);
				}
			}

			.music-provider {
				display: flex;
				gap: calc(var(--base-gap) * 0.75);
				padding: calc(var(--base-padding) * 0.75) calc(var(--base-padding) * 1);
				color: var(--inputs-on-background-color);
				border-radius: var(--inputs-border-base-radius);
				cursor: pointer;
			}
		}
	}

	.content {
		flex: 1;
		padding: var(--base-padding);
	}
</style>
