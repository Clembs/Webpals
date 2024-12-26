<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { At } from 'phosphor-svelte';
	import type { LayoutServerData } from '../$types';
	import { enhance } from '$app/forms';

	let { data }: { data: LayoutServerData } = $props();

	let baseUrl = $derived(
		`${page.url.hostname}${page.url.hostname === 'localhost' ? `:${page.url.port}` : ''}`
	);

	let username = $state(data.currentUser.username);
	let isLoading = $state(false);
</script>

{#snippet changeUsernameDialog()}
	<!-- TODO: implement the endpoint -->
	<form
		use:enhance={() => {
			isLoading = true;

			return async ({ result, update }) => {
				isLoading = false;

				if (result.type === 'success') {
					dialogPortal.closeDialog();
					await update({
						reset: false
					});
				}
			};
		}}
		action="/api/settings?/editUsername"
		method="post"
	>
		<h2>Change username</h2>

		<p>
			Pick something short and sweet, between 2 and 24 characters. You can only use letters, numbers
			and underscores.
		</p>

		{#snippet at(size: number)}
			<At {size} weight="regular" />
		{/snippet}
		<TextInput name="username" bind:value={username} prefixIcon={at} error={page.form?.message} />

		<div class="buttons">
			<Button type="button" onclick={() => dialogPortal.closeDialog()} variant="secondary" inline>
				Cancel
			</Button>

			<Button inline>Save</Button>
		</div>
	</form>
{/snippet}

<section id="username">
	<h3>Username</h3>

	<p>
		Your username, <span class="heading"> @{data.currentUser.username}</span>, is your unique
		identifier on the platform. It is used to create your profile URL ({baseUrl}/<span
			class="heading"
		>
			{data.currentUser.username}
		</span>).
	</p>

	<Button inline onclick={() => dialogPortal.openDialog(changeUsernameDialog)}>
		Change username
	</Button>

	<p>
		Looking to change your display name? Check your <a href="/{data.currentUser.username}">
			profile settings
		</a>.
	</p>
</section>
