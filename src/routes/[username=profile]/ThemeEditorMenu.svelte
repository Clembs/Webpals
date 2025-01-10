<script lang="ts">
	import ThemeEditor from '$lib/themes/ThemeEditor.svelte';
	import BaseEditBarMenu from './BaseEditBarMenu.svelte';
	import type { Theme } from '$lib/themes/types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { page } from '$app/state';
	import { ArrowClockwise } from 'phosphor-svelte';

	let {
		theme = $bindable(),
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		theme: Theme;
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

		<Button
			inline
			size="small"
			icon
			variant="secondary"
			type="button"
			onclick={() => {
				console.log(page.data.user.theme);
				theme = page.data.user.theme;
			}}
			disabled={formState === 'loading'}
			aria-label="Undo all"
		>
			<ArrowClockwise />
		</Button>

		<Button inline size="small" type="submit" disabled={formState === 'loading'}>
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
>
	<ThemeEditor bind:theme />
</BaseEditBarMenu>

<style lang="scss">
	form {
		display: flex;
		align-items: center;
		gap: calc(var(--base-gap) * 0.5);
	}
</style>
