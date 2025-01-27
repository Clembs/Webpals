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

	let fileInput = $state<HTMLInputElement>();
</script>

<BaseEditBarMenu name="Theme Settings" {editBarEl} {editBarWrapperEl} bind:menuOpen>
	{#snippet rightButton()}
		<form
			use:enhance={() => {
				formState = 'loading';
				return async ({ result, update }) => {
					await update({ reset: false });
					if (result.type === 'success') {
						formState = 'success';
						setTimeout(() => {
							formState = null;
						}, 1000);
					} else {
						formState = 'error';
					}
				};
			}}
			enctype="multipart/form-data"
			action="/api/profile?/editTheme"
			method="post"
		>
			{#if theme.background.type === 'image'}
				<input
					id="background.image"
					name="background.image"
					type="file"
					accept="image/*"
					bind:this={fileInput}
					onchange={() => {
						const file = fileInput?.files?.[0];
						if (!file) return;
						if (theme.background.type !== 'image') return;

						theme.background.image_url = URL.createObjectURL(file);
					}}
				/>
			{/if}

			<input type="hidden" name="theme" value={JSON.stringify(theme)} />

			<Button
				inline
				size="small"
				icon
				variant="secondary"
				type="button"
				onclick={() => {
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

	<ThemeEditor bind:theme />
</BaseEditBarMenu>

<style lang="scss">
	form {
		display: flex;
		align-items: center;
		gap: calc(var(--base-gap) * 0.5);
	}

	input[type='file'] {
		position: fixed;
		top: -1000px;

		&:focus + :global(.hover-text) {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			padding: calc(var(--base-padding) * 0.75) calc(var(--base-padding) * 1.5);
			border-radius: var(--widgets-border-base-radius);
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(5px);
			color: var(--buttons-primary-on-background-color);
		}
	}
</style>
