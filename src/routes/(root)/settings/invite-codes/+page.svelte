<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { ArrowsClockwise, Check, Clipboard, X } from 'phosphor-svelte';

	let { data } = $props();

	let generateStatus = $state<'loading' | 'success' | 'error' | null>(null);
</script>

<section class="settings-section">
	<h1>Invite codes</h1>

	<p>
		Registering on Webpals is for now limited via invite codes. You may generate up to 10 invite
		codes to invite your friends over!
	</p>

	<table>
		<thead>
			<tr>
				<th>#</th>
				<th>Invite code</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each data.currentProfile.inviteCodes as code, index (code.code)}
				<tr>
					<td>
						<div class="index">
							<code>
								{index + 1}
							</code>
						</div>
					</td>
					<td>
						<div class="code">
							<code>
								{code.code}
							</code>

							<Button
								onclick={() => {
									navigator.clipboard.writeText(code.code);
								}}
								inline
								icon
								size="small"
								variant="secondary"
								disabled={!!code.claimedAt}
							>
								<Clipboard weight="regular" size={18} />
							</Button>
						</div>
					</td>
					<td>
						<div class="status">
							{#if !code.claimedAt}
								<Check color="var(--color-success)" weight="regular" />
								Available
							{:else}
								<X color="var(--color-urgent)" weight="regular" />
								Claimed
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if data.currentProfile.inviteCodes.length >= 10}
		<Button variant="secondary" disabled>Out of invite codes!</Button>
	{:else}
		<form
			use:enhance={() => {
				generateStatus = 'loading';

				return async ({ result, update }) => {
					if (
						result.type === 'success' &&
						result.data &&
						'code' in result.data &&
						typeof result.data.code === 'string'
					) {
						generateStatus = 'success';
						navigator.clipboard.writeText(result.data.code);
						setTimeout(() => (generateStatus = null), 2000);
					} else {
						generateStatus = 'error';
					}
					await update({
						invalidateAll: true
					});
				};
			}}
			method="post"
		>
			<Button
				variant={generateStatus === 'success' ? 'success' : 'primary'}
				disabled={generateStatus === 'loading'}
			>
				{#if generateStatus !== 'success'}
					<div class="icon" class:loading={generateStatus === 'loading'}>
						<ArrowsClockwise />
					</div>
					Generate invite code
				{:else if generateStatus !== 'success'}
					<div class="icon loading" class:loading={generateStatus === 'loading'}>
						<ArrowsClockwise />
					</div>
					Generate invite code
				{:else}
					<Check weight="regular" />
					Copied to clipboard!
				{/if}
			</Button>
		</form>
	{/if}

	<span class="subtext centered">
		{10 - data.currentProfile.inviteCodes.length}/10 codes remaining
	</span>
</section>

<style lang="scss">
	@use '../../../../styles/mixins.scss';

	table {
		@include mixins.fancy-table;

		.index {
			code {
				display: block;
				width: 3ch;
				text-align: end;
			}
		}

		.code,
		.status {
			display: flex;
			align-items: center;
			gap: calc(var(--base-gap) * 0.5);
		}

		// .status {

		// }
	}

	.icon.loading {
		animation: spin 1s linear infinite;

		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}
	}

	.centered {
		align-self: center;
	}
</style>
