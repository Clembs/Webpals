<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import type { ConnectionsWidget, WidgetComponentProps } from '../types';
	import { connectionProviders } from '../connections';
	import { ArrowSquareOut, Check, CopySimple, SealCheck, TextAlignLeft } from 'phosphor-svelte';
	import ConnectionsWidgetEditComponent from '../default-edit-menus/ConnectionsWidgetEditComponent.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Connection } from '$lib/db/schema/types';

	let { user, widget, editing }: WidgetComponentProps<ConnectionsWidget> = $props();

	let modalOpened = $state(false);

	let copiedConnections = new SvelteMap(user.connections.map((_, index) => [index, false]));

	function copyConnectionIdentifiable(index: number) {
		const connection = user.connections[index];
		navigator.clipboard.writeText(connection.identifiable);
		copiedConnections.set(index, true);
		setTimeout(() => copiedConnections.set(index, false), 1000);
	}

	// let topTwoConnections = $derived(
	// 	widget.connections
	// 		// get the verified non-domain connections
	// 		.filter((c) => c.provider !== 'domain' && c.url)
	// 		.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
	// 		.slice(0, 2)
	// );
	// let otherConnections = $derived(widget.connections.filter((c) => !topTwoConnections.includes(c)));
</script>

{#snippet editMenu()}
	<ConnectionsWidgetEditComponent {user} />
{/snippet}

<!-- {#snippet topConnectionContents(connection: Connection, index: number)}
	{@const provider = connectionProviders[connection.provider]!}

	<a class="connection" href={connection.url} target="_blank" rel="noopener noreferrer">
		<provider.icon {...provider.iconProps} />

		<div class="text">
			{connection.identifiable}
			{#if connection.verified}
				<SealCheck size={15} />
			{/if}
		</div>
	</a>
{/snippet} -->

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

<BaseWidget bind:isWidgetEditing={modalOpened} {editMenu} {user} {widget} editingMode={editing}>
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
			{#each user.connections as connection, index (index)}
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

		// .top-connections-list {
		// 	display: flex;
		// 	gap: calc(var(--base-gap) * 0.5);
		// 	list-style: none;
		// 	margin-bottom: calc(0px - var(--base-gap) * 0.5);
		// 	container-type: inline-size;

		// 	li {
		// 		display: contents;
		// 	}

		// 	.connection {
		// 		display: flex;
		// 		background-color: var(--widgets-background-color-dim);
		// 		color: var(--color-heading);
		// 		gap: calc(var(--base-gap) * 0.75);
		// 		padding: var(--base-padding) calc(var(--base-padding) * 0.75);
		// 		border-radius: calc(var(--widgets-border-base-radius) * 0.5);
		// 		width: 100%;
		// 		text-decoration: none;
		// 		justify-content: center;

		// 		&:hover {
		// 			filter: brightness(0.95);
		// 		}

		// 		.text {
		// 			display: flex;
		// 			gap: calc(var(--base-gap) * 0.25);
		// 		}
		// 	}

		// 	@container (max-width: 400px) {
		// 		.connection .text {
		// 			display: none;
		// 		}
		// 	}
		// }

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
