<script lang="ts">
	import { Check, PencilSimple, SealCheck, TextAlignLeft, TrashSimple, X } from 'phosphor-svelte';
	import { connectionProviders } from '../connections';
	import type { Connection } from '../types';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import Button from '$lib/components/Button.svelte';

	let {
		selectedConnectionIndex = $bindable(),
		connection,
		index
	}: {
		selectedConnectionIndex: number | undefined;
		connection: Connection;
		index: number;
	} = $props();

	let isEditing = $derived(selectedConnectionIndex === index);

	let provider = $derived(connectionProviders[connection.provider]);
</script>

<li class="connection">
	<!-- TODO: the endpoint -->
	<form action="/api/profile?/editConnection&id={index}">
		<div class="left">
			<!-- svelte-ignore svelte_component_deprecated -->
			{#if provider}
				<svelte:component this={provider.icon} {...provider.iconProps} />
			{:else}
				<TextAlignLeft />
			{/if}
			<div class="text">
				{#if isEditing && !provider}
					<InlineTextInput name="connection-{index}-provider" value={connection.provider} />
				{:else}
					<div class="heading">
						{provider?.name || connection.provider}
					</div>
				{/if}
				{#if isEditing}
					<InlineTextInput name="connection-identifiable" value={connection.identifiable} />
				{:else}
					<div class="subtext">
						{connection.identifiable}
						{#if connection.verified}
							<SealCheck size={16} />
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class="actions">
			{#if isEditing}
				<!-- Save & Cancel buttons -->
				<Button aria-label="Save changes" icon size="small" inline>
					<Check weight="regular" />
				</Button>
				<Button
					onclick={() => (selectedConnectionIndex = undefined)}
					aria-label="Cancel changes"
					icon
					size="small"
					variant="secondary"
					inline
					type="button"
				>
					<X weight="regular" />
				</Button>
			{:else}
				{#if !connection.verified}
					<Button
						aria-label="Verify connection"
						disabled
						icon
						size="small"
						variant="secondary"
						inline
						type="button"
					>
						<SealCheck />
					</Button>
				{/if}
				<Button
					onclick={() => (selectedConnectionIndex = index)}
					aria-label="Edit connection"
					icon
					size="small"
					variant="secondary"
					inline
					disabled={connection.verified}
					type="button"
				>
					<PencilSimple />
				</Button>
				<!-- TODO: implement this -->
				<Button
					aria-label="Delete connection"
					icon
					size="small"
					variant="secondary"
					inline
					type="button"
				>
					<TrashSimple />
				</Button>
			{/if}
		</div>
	</form>
</li>

<style lang="scss">
	.connection {
		display: flex;
		padding: calc(var(--base-padding) * 0.75);
		text-decoration: none;
		color: var(--color-heading);
		justify-content: space-between;
		background-color: var(--widgets-background-color-dim);
		width: 100%;
		align-items: center;

		form {
			display: contents;
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

		.actions {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
		}
	}
</style>
