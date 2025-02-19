<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { At } from 'phosphor-svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { USERNAME_REGEX } from '$lib/db/schema/users';
	import type { LayoutServerData } from '../$types';

	let { data }: { data: LayoutServerData } = $props();

	let baseUrl = $derived(
		`${page.url.hostname}${page.url.hostname === 'localhost' ? `:${page.url.port}` : ''}`
	);

	let username = $state(data.currentProfile.username);
	let isLoading = $state(false);
</script>

{#snippet changeUsernameDialog()}
	<form
		use:enhance={() => {
			isLoading = true;

			return async ({ result, update }) => {
				if (result.type === 'success') {
					dialogPortal.closeDialog();
				}
				// in case the username change occurs on the profile page
				// redirect to the new username
				if (result.type === 'redirect') {
					dialogPortal.closeDialog();
					await goto(result.location, {
						replaceState: true,
						invalidateAll: true
					});
				}
				await update({
					reset: false
				});
				isLoading = false;
			};
		}}
		action="/api/settings?/updateUsername"
		method="post"
	>
		<h2>Change username</h2>

		<p>
			Pick something short and sweet, between 2 and 24 characters. You can only use letters, numbers
			and underscores.
		</p>
		<TextInput
			name="username"
			bind:value={username}
			pattern={USERNAME_REGEX.source}
			minlength={2}
			maxlength={24}
			error={page.form?.message}
		>
			{#snippet prefixIcon(size: number)}
				<At {size} weight="regular" />
			{/snippet}
		</TextInput>

		<div class="buttons">
			<Button type="button" onclick={() => dialogPortal.closeDialog()} variant="secondary" inline>
				Cancel
			</Button>

			<Button
				type="submit"
				inline
				disabled={username === data.currentProfile.username ||
					isLoading ||
					!username ||
					username.length < 2 ||
					username.length > 24 ||
					!USERNAME_REGEX.test(username)}
			>
				Save
			</Button>
		</div>
	</form>
{/snippet}

<section id="username" class="settings-section">
	<h3>Username</h3>

	<p>
		Your username, <span class="heading"> @{data.currentProfile.username}</span>, is your unique
		identifier on the platform. It is used to create your profile URL ({baseUrl}/<span
			class="heading"
		>
			{data.currentProfile.username}
		</span>).
	</p>

	<Button inline onclick={() => dialogPortal.openDialog(changeUsernameDialog)}>
		Change username
	</Button>

	<p>
		Looking to change your display name? Check your <a href="/{data.currentProfile.username}">
			profile settings
		</a>.
	</p>
</section>
