<script lang="ts">
	import type { FullUser } from '$lib/db/schema/users';
	import AccountSettings from '../(root)/settings/account/AccountSettings.svelte';
	import BaseEditBarMenu, { type EditBarMenuMethods } from './BaseEditBarMenu.svelte';

	let {
		user,
		menu = $bindable(),
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		user: FullUser;
		menu: EditBarMenuMethods | undefined;
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
	bind:this={menu}
>
	<AccountSettings
		data={{
			currentUser: user
		}}
	/>
</BaseEditBarMenu>
