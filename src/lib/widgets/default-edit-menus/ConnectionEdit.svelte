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
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { slide } from 'svelte/transition';

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
	let isLoading = $state(false);

	let knownProvider = $derived(connectionProviders[connection.provider]);

	let isPressingShift = $state(false);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Shift') {
			isPressingShift = true;
		}

		if (e.key === 'Escape' && selectedConnectionIndex) {
			e.preventDefault();
			selectedConnectionIndex = undefined;
		}
	}}
	onkeyup={(e) => {
		if (e.key === 'Shift') {
			isPressingShift = false;
		}
	}}
/>

<li class="connection" out:slide>
	<!-- TODO: the endpoint -->
	<form
		use:enhance={() => {
			isLoading = true;
			return async ({ result, update }) => {
				isLoading = false;

				if (result.type === 'success') {
					selectedConnectionIndex = undefined;
				}

				await update({
					reset: false
				});
			};
		}}
		action="/api/profile?/editConnection&index={index}"
		method="post"
	>
		<div class="left">
			{#if knownProvider}
				<knownProvider.icon {...knownProvider.iconProps} />
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
						value={connection.url || connection.identifiable}
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
				{#if isPressingShift}
					<Button
						aria-label="Delete connection"
						icon
						size="small"
						variant="urgent"
						inline
						type="submit"
						formaction="/api/profile?/deleteConnection&index={index}"
					>
						<TrashSimple />
					</Button>
				{:else}
					<Button
						aria-label="Delete connection"
						icon
						size="small"
						variant="secondary"
						inline
						type="button"
						onclick={() => {
							if (!isPressingShift) dialogPortal.openDialog(confirmDeleteDialog);
						}}
					>
						<TrashSimple />
					</Button>
				{/if}
			{/if}
		</div>
	</form>
</li>

{#snippet confirmDeleteDialog()}
	<form
		class="confirm-delete"
		use:enhance={() =>
			({ update }) => {
				dialogPortal.closeDialog();
				update();
			}}
		method="post"
		action="/api/profile?/deleteConnection&index={index}"
	>
		<h2>Delete connection</h2>

		<p>
			Are you sure you want to delete this connection? If it was verified, you will have to
			re-verify it. This action cannot be undone.
		</p>

		<span> Pro tip: Hold Shift while clicking the delete button to skip this confirmation. </span>

		<div class="buttons">
			<Button
				aria-label="Delete connection"
				variant="secondary"
				inline
				type="button"
				onclick={() => dialogPortal.closeDialog()}
			>
				Cancel
			</Button>

			<Button aria-label="Delete connection" variant="urgent" inline type="submit">
				Delete connection
			</Button>
		</div>
	</form>
{/snippet}

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
		gap: 1rem;

		form {
			display: contents;
		}

		.left {
			display: flex;
			gap: calc(var(--base-gap) * 0.75);
			align-items: center;
			width: 100%;
		}

		.text {
			display: flex;
			flex-direction: column;
			gap: calc(var(--base-gap) * 0.125);
			width: 100%;
			flex: 1;

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

	.confirm-delete {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		h2 {
			font-size: 1.5rem;
			text-wrap: balance;
		}

		.buttons {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			justify-content: flex-end;
		}
	}
</style>
