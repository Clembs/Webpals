<script lang="ts">
	import { Check, PencilSimple, SealCheck, Trash, X } from 'phosphor-svelte';
	import { connectionProviders } from '../connections';
	import type { Connection } from '$lib/db/schema/types';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { slide } from 'svelte/transition';

	let {
		editingConnectionId = $bindable(),
		connection
	}: {
		editingConnectionId: string | undefined;
		connection: Connection;
	} = $props();

	let isEditing = $derived(editingConnectionId === connection.id);
	let isLoading = $state(false);

	let provider = $derived(connectionProviders[connection.provider]);

	let isPressingShift = $state(false);
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Shift') {
			isPressingShift = true;
		}

		if (e.key === 'Escape' && editingConnectionId) {
			e.preventDefault();
			editingConnectionId = undefined;
		}
	}}
	onkeyup={(e) => {
		if (e.key === 'Shift') {
			isPressingShift = false;
		}
	}}
/>

<li class="connection" transition:slide>
	<form
		use:enhance={() => {
			isLoading = true;
			return async ({ result, update }) => {
				if (result.type === 'success') {
					editingConnectionId = undefined;
				}

				await update({
					reset: false
				});

				isLoading = false;
			};
		}}
		action="/api/profile?/editConnection&connection-id={connection.id}"
		method="post"
	>
		<div class="left">
			<provider.icon {...provider.iconProps} />
			<div class="text">
				{#if provider.identifiablePrefix}
					<span class="subtext">
						{provider.identifiablePrefix}
					</span>
				{/if}
				{#if isEditing}
					<InlineTextInput
						name="connection-identifiable"
						value={connection.identifiable}
						placeholder={provider.identifiablePlaceholder}
						required
						autofocus
					/>
				{:else if !connection.verified}
					<button
						aria-label="Edit connection"
						onclick={() => (editingConnectionId = connection.id)}
						class="edit-button heading"
					>
						{connection.identifiable}
						<PencilSimple size={20} />
					</button>
				{:else}
					<span class="heading">
						{connection.identifiable}
						{#if connection.verified}
							<SealCheck size={16} />
						{/if}
					</span>
				{/if}
			</div>
		</div>

		<div class="actions">
			{#if isEditing}
				<!-- Save & Cancel buttons -->
				<Button
					onclick={() => (editingConnectionId = undefined)}
					aria-label="Cancel changes"
					icon
					size="small"
					variant="secondary"
					inline
					type="button"
				>
					<X weight="regular" size={20} />
				</Button>
				<Button aria-label="Save changes" icon size="small" inline>
					<Check weight="regular" size={20} />
				</Button>
			{:else}
				{#if !connection.verified && provider && provider.verifiable}
					<Button
						aria-label="Verify connection"
						disabled
						icon
						size="small"
						variant="secondary"
						inline
						type="button"
					>
						<SealCheck size={20} />
					</Button>
				{/if}
				{#if isPressingShift}
					<Button
						aria-label="Delete connection"
						icon
						size="small"
						variant="urgent"
						inline
						type="submit"
						formaction="/api/profile?/deleteConnection&connection-id={connection.id}"
					>
						<Trash size={20} />
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
						<Trash size={20} />
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
		action="/api/profile?/deleteConnection&connection-id={connection.id}"
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
		padding: calc(var(--base-padding) * 0.5) calc(var(--base-padding) * 0.75);
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
			// gap: calc(var(--base-gap) * 0.125);
			width: 100%;
			flex: 1;

			.heading,
			.subtext {
				display: flex;
				align-items: center;
				gap: calc(var(--base-gap) * 0.25);
			}

			.edit-button {
				display: flex;
				align-items: center;
				gap: calc(var(--base-gap) * 0.25);
				cursor: pointer;
				background-color: transparent;
				border: none;
				color: inherit;
				padding: calc(var(--base-gap) * 0.75);
				margin: calc(0px - var(--base-gap) * 0.75);
			}

			.heading {
				text-decoration: underline;
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
