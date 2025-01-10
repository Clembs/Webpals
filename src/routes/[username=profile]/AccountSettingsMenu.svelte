<script lang="ts">
	import type { FullUser } from '$lib/db/schema/users';
	import AccountSettings from '../(root)/settings/account/AccountSettings.svelte';
	import BaseEditBarMenu from './BaseEditBarMenu.svelte';

	let {
		user,
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		user: FullUser;
		menuOpen: boolean;
		editBarEl: HTMLDivElement | undefined;
		editBarWrapperEl: HTMLDivElement | undefined;
	} = $props();
</script>

<BaseEditBarMenu
	expandHref="/settings/account"
	name="Account settings"
	{editBarEl}
	{editBarWrapperEl}
	bind:menuOpen
>
	<AccountSettings
		data={{
			currentUser: user
		}}
	/>
</BaseEditBarMenu>
