<script lang="ts">
	import type { FullProfile } from '$lib/db/schema/types';
	import AccountSettings from '../(root)/settings/account/AccountSettings.svelte';
	import BaseEditBarMenu from './BaseEditBarMenu.svelte';

	let {
		user,
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		user: FullProfile;
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
			currentProfile: user
		}}
	/>
</BaseEditBarMenu>
