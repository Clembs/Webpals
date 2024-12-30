<script lang="ts">
	import ThemeEditor from '$lib/themes/ThemeEditor.svelte';
	import BaseEditBarMenu, { type EditBarMenuMethods } from './BaseEditBarMenu.svelte';
	import type { Theme } from '$lib/themes/types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	let {
		theme = $bindable(),
		menu = $bindable(),
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		theme: Theme;
		menu: EditBarMenuMethods | undefined;
		menuOpen: boolean;
		editBarEl: HTMLDivElement | undefined;
		editBarWrapperEl: HTMLDivElement | undefined;
	} = $props();

	let formState = $state<null | 'loading' | 'success' | 'error'>(null);
</script>

{#snippet saveButton()}
	<form
		use:enhance={() => {
			formState = 'loading';
			return async ({ result, update }) => {
				if (result.type === 'success') {
					formState = 'success';
					setTimeout(() => {
						formState = null;
					}, 1000);
				} else {
					formState = 'error';
				}
				await update({ reset: false });
			};
		}}
		action="/api/profile?/editTheme"
		method="post"
	>
		<input type="hidden" name="theme" value={JSON.stringify(theme)} />
		<Button size="small" type="submit" disabled={formState === 'loading'}>
			{#if formState === 'loading'}
				Saving...
			{:else if formState === 'success'}
				Saved
			{:else}
				Save
			{/if}
		</Button>
	</form>
{/snippet}

<BaseEditBarMenu
	name="Theme Settings"
	{editBarEl}
	{editBarWrapperEl}
	rightButton={saveButton}
	bind:menuOpen
	bind:this={menu}
>
	<ThemeEditor bind:theme />
</BaseEditBarMenu>
