<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ConnectionsWidget, WidgetComponentProps } from '../types';
	import { enhance } from '$app/forms';
	import { connectionProviders } from '../connections';
	import { SealCheck } from 'phosphor-svelte';

	let { user, widget, editing }: WidgetComponentProps<ConnectionsWidget> = $props();

	let modalOpened = $state(false);
</script>

{#snippet editMenu()}
	<form
		use:enhance={() =>
			({ update }) => {
				update({ reset: false });
				modalOpened = false;
			}}
		class="connections-edit"
		action="/api/profile?/editConnections"
		method="post"
	>
		<h2>Connections</h2>

		<Button>Save</Button>
	</form>
{/snippet}

{#snippet connectionContents(connection: ConnectionsWidget['connections'][0])}
	{@const provider = connectionProviders[connection.provider]}

	<div class="left">
		<!-- svelte-ignore svelte_component_deprecated -->
		<svelte:component this={provider.icon} {...provider.iconProps} />
		<div class="text">
			{#if connection.provider !== 'domain'}
				<div class="heading">
					{provider.name}
				</div>
			{/if}
			<div class="subtext">
				{connection.identifiable}
				{#if connection.verified}
					<SealCheck />
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<BaseWidget bind:modalOpened {editMenu} {user} {widget} {editing}>
	<div class="connections">
		<h2>Connections</h2>

		{#each widget.connections as connection}
			{#if connection.url}
				<li>
					<a class="connection" href={connection.url}>
						{@render connectionContents(connection)}
					</a>
				</li>
			{:else}
				<li class="connection">
					{@render connectionContents(connection)}
				</li>
			{/if}
		{/each}
	</div>
</BaseWidget>

<style lang="scss">
	.connections {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
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
