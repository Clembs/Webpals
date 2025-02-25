<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { formatDate } from '$lib/helpers/text';
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
				<th>Issued on</th>
				<th>Invite code</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each data.currentProfile.inviteCodes as code (code.code)}
				<tr>
					<td>
						<time datetime={code.createdAt.toISOString()}>
							{formatDate(code.createdAt, 'en-US')}
						</time>
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
							{#if !code.claimedAt || !code.claimedBy}
								<Check color="var(--color-success)" weight="regular" />
								Available
							{:else}
								<X color="var(--color-urgent)" weight="regular" />
								Claimed by <a href="/{code.claimedBy.username}">@{code.claimedBy.username}</a>
							{/if}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if !data.isClembs && data.currentProfile.inviteCodes.length >= 10}
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
						await update({
							invalidateAll: true
						});
						generateStatus = 'success';
						navigator.clipboard.writeText(result.data.code);
						setTimeout(() => (generateStatus = null), 2000);
					} else {
						await update({
							invalidateAll: true
						});
						generateStatus = 'error';
					}
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

	{#if !data.isClembs}
		<span class="subtext centered">
			{10 - data.currentProfile.inviteCodes.length}/10 codes remaining
		</span>
	{/if}
</section>

<style lang="scss">
	@use '../../../../styles/mixins.scss';

	table {
		@include mixins.fancy-table;

		.code,
		.status {
			display: flex;
			align-items: center;
			gap: calc(var(--base-gap) * 0.5);
		}
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
