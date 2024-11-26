<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import type { ConnectionsWidget, WidgetComponentProps } from '../types';
	import { connectionProviders } from '../connections';
	import { ArrowSquareOut, CopySimple, SealCheck, TextAlignLeft } from 'phosphor-svelte';

	let { user, widget, editing }: WidgetComponentProps<ConnectionsWidget> = $props();

	let modalOpened = $state(false);
</script>

{#snippet editMenu()}{/snippet}

{#snippet connectionContents(connection: ConnectionsWidget['connections'][0])}
	{@const provider = connectionProviders[connection.provider]}

	<div class="left">
		<!-- svelte-ignore svelte_component_deprecated -->
		{#if provider}
			<svelte:component this={provider.icon} {...provider.iconProps} />
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
		<CopySimple />
	{/if}
{/snippet}

<BaseWidget bind:modalOpened {editMenu} {user} {widget} {editing}>
	<div class="connections">
		<h2>Connections</h2>

		<ul class="connections-list">
			{#each widget.connections as connection}
				<li>
					{#if connection.url}
						<a class="connection" href={connection.url}>
							{@render connectionContents(connection)}
						</a>
					{:else}
						<!-- TODO: show visual info to confirm copy -->
						<button
							class="connection"
							onclick={() => navigator.clipboard.writeText(connection.identifiable)}
						>
							{@render connectionContents(connection)}
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
			}
		}
	}
	h2 {
		font-size: 1.5rem;
	}

	.connections-edit {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
	}
</style>
