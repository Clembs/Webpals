<script lang="ts">
	import {
		Check,
		Globe,
		PencilSimple,
		SealCheck,
		TextAlignLeft,
		TrashSimple,
		X
	} from 'phosphor-svelte';
	import { connectionProviders } from '../connections';
	import type { Connection } from '../types';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';

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

	let knownProvider = $derived(connectionProviders[connection.provider]);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && selectedConnectionIndex) {
			e.preventDefault();
			selectedConnectionIndex = undefined;
		}
	}}
/>

<li class="connection">
	<!-- TODO: the endpoint -->
	<form use:enhance action="/api/profile?/editConnection&index={index}" method="post">
		<div class="left">
			{#if knownProvider}
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={knownProvider.icon} {...knownProvider.iconProps} />
			{:else if connection.url}
				<Globe />
			{:else}
				<TextAlignLeft />
			{/if}
			<div class="text">
				{#if isEditing && (!knownProvider || connection.url)}
					<InlineTextInput
						name="connection-provider"
						value={knownProvider?.name || connection.provider}
						placeholder="Service (e.g. Discord, Nintendo Network...)"
						required
					/>
				{:else}
					<div class="heading">
						{knownProvider?.name || connection.provider}
					</div>
				{/if}
				{#if isEditing}
					<InlineTextInput
						name="connection-identifiable"
						value={connection.identifiable}
						placeholder={connection.url
							? 'Enter a valid URL'
							: knownProvider && knownProvider.identifiableHint
								? knownProvider.identifiableHint
								: 'Enter your @, a friend'}
						required
					/>
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
				{#if !connection.verified && knownProvider && knownProvider.verifiable}
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
				<Button
					aria-label="Delete connection"
					icon
					size="small"
					variant="secondary"
					inline
					type="submit"
					formaction="/api/profile?/deleteConnection&index={index}"
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
