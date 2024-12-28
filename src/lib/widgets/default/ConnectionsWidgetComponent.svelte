<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import type { ConnectionsWidget, WidgetComponentProps } from '../types';
	import { connectionProviders } from '../connections';
	import { ArrowSquareOut, Check, CopySimple, SealCheck, TextAlignLeft } from 'phosphor-svelte';
	import ConnectionsWidgetEditComponent from '../default-edit-menus/ConnectionsWidgetEditComponent.svelte';
	import { SvelteMap } from 'svelte/reactivity';

	let { user, widget, editing }: WidgetComponentProps<ConnectionsWidget> = $props();

	let modalOpened = $state(false);

	let copiedConnection = new SvelteMap(widget.connections.map((_, index) => [index, false]));

	function copyConnectionIdentifiable(index: number) {
		const connection = widget.connections[index];
		navigator.clipboard.writeText(connection.identifiable);
		copiedConnection.set(index, true);
		setTimeout(() => copiedConnection.set(index, false), 1000);
	}
</script>

{#snippet editMenu()}
	<ConnectionsWidgetEditComponent {widget} />
{/snippet}

{#snippet connectionContents(connection: ConnectionsWidget['connections'][0], index: number)}
	{@const provider = connectionProviders[connection.provider]}

	<div class="left">
		{#if provider}
			<provider.icon {...provider.iconProps} />
		{:else}
			<TextAlignLeft />
		{/if}
		<div class="text">
			<div class="heading">
				{provider?.name || connection.provider}
			</div>
			<div class="subtext">
				{connection.identifiable}
				{#if connection.verified}
					<SealCheck size={16} />
				{/if}
			</div>
		</div>
	</div>

	{#if connection.url}
		<ArrowSquareOut weight="regular" />
	{:else}
		<div class="copy-icon" class:animate={copiedConnection.get(index)}>
			{#if copiedConnection.get(index)}
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

		<ul class="connections-list">
			{#each widget.connections as connection, index (index)}
				<li>
					{#if connection.url}
						<a class="connection" href={connection.url} target="_blank" rel="noopener noreferrer">
							{@render connectionContents(connection, index)}
						</a>
					{:else}
						<!-- TODO: show visual info to confirm copy -->
						<button class="connection" onclick={() => copyConnectionIdentifiable(index)}>
							{@render connectionContents(connection, index)}
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
		gap: var(--base-gap);

		.connections-list {
			@include mixins.fancy-list;
			overflow: hidden;

			.connection {
				display: flex;
				padding: calc(var(--base-padding) * 0.75);
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
		font-size: 1.5rem;
	}
</style>
