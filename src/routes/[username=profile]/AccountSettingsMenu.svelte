<script lang="ts">
	import type { FullProfile } from '$lib/db/schema/types';
	import type { User } from '@supabase/supabase-js';
	import AccountSettings from '../(root)/settings/account/AccountSettings.svelte';
	import BaseEditBarMenu from './BaseEditBarMenu.svelte';

	let {
		profile,
		currentUser,
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		profile: FullProfile;
		currentUser: User;
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
			currentProfile: profile,
			currentUser
		}}
	/>
</BaseEditBarMenu>
