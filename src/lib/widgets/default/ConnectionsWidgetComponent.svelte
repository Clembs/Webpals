<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import type { ConnectionsWidget, WidgetComponentProps } from '../types';
	import { connectionProviders } from '../connections';
	import { ArrowSquareOut, Check, CopySimple, SealCheck, TextAlignLeft } from 'phosphor-svelte';
	import ConnectionsWidgetEditComponent from '../default-edit-menus/ConnectionsWidgetEditComponent.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Connection } from '$lib/db/schema/types';

	let { profile, widget, editing }: WidgetComponentProps<ConnectionsWidget> = $props();

	let modalOpened = $state(false);

	let copiedConnections = new SvelteMap(profile.connections.map((_, index) => [index, false]));

	function copyConnectionIdentifiable(index: number) {
		const connection = profile.connections[index];
		navigator.clipboard.writeText(connection.identifiable);
		copiedConnections.set(index, true);
		setTimeout(() => copiedConnections.set(index, false), 1000);
	}
</script>

{#snippet regularConnectionContents(connection: Connection, index: number)}
	{@const provider = connectionProviders[connection.provider]}

	<div class="left">
		{#if provider}
			<provider.icon {...provider.iconProps} />
		{:else}
			<TextAlignLeft />
		{/if}
		<div class="text">
			<div class="heading">
				{connection.identifiable}
				{#if connection.verified}
					<SealCheck size={15} />
				{/if}
			</div>
		</div>
	</div>

	{#if connection.url}
		<ArrowSquareOut weight="regular" />
	{:else}
		<div class="copy-icon" class:animate={copiedConnections.get(index)}>
			{#if copiedConnections.get(index)}
				<Check weight="regular" />
			{:else}
				<CopySimple />
			{/if}
		</div>
	{/if}
{/snippet}

<BaseWidget bind:isWidgetEditing={modalOpened} {profile} {widget} editingMode={editing}>
	{#snippet editMenu()}
		<ConnectionsWidgetEditComponent user={profile} />
	{/snippet}

	<div class="connections">
		<h2>Connections</h2>

		<!-- <ul class="top-connections-list">
			{#each topTwoConnections as connection, index (index)}
				<li>
					{@render topConnectionContents(connection, index)}
				</li>
			{/each}
		</ul> -->

		<ul class="connections-list">
			{#each profile.connections as connection, index (index)}
				<li>
					{#if connection.url}
						<a class="connection" href={connection.url} target="_blank" rel="noopener noreferrer">
							{@render regularConnectionContents(connection, index)}
						</a>
					{:else}
						<!-- TODO: show visual info to confirm copy -->
						<button class="connection" onclick={() => copyConnectionIdentifiable(index)}>
							{@render regularConnectionContents(connection, index)}
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</BaseWidget>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.connections {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);

		.connections-list {
			@include mixins.fancy-list;
			overflow: hidden;

			.connection {
				display: flex;
				padding: var(--base-padding) calc(var(--base-padding) * 0.75);
				text-decoration: none;
				color: var(--color-heading);
				justify-content: space-between;
				background-color: var(--widgets-background-color-dim);
				border: none;
				width: 100%;
				cursor: pointer;

				&:hover {
					filter: brightness(0.95);
				}

				.left {
					display: flex;
					gap: calc(var(--base-gap) * 0.75);
					align-items: center;
				}

				.text {
					display: flex;
					flex-direction: column;
					gap: calc(var(--base-gap) * 0.125);

					.heading,
					.subtext {
						display: flex;
						align-items: center;
						gap: calc(var(--base-gap) * 0.25);
					}
				}

				&:hover:active .copy-icon {
					transform: scale(0.95);
				}

				.copy-icon {
					display: grid;
					place-items: center;
					transition: transform 200ms;

					&.animate {
						transform: scale(1.15);
					}
				}
			}
		}
	}
	h2 {
		font-size: 1.25rem;
	}
</style>
