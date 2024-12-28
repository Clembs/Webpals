<script lang="ts">
	import ThemeEditor from '$lib/themes/ThemeEditor.svelte';
	import BaseEditBarMenu, { type EditBarMenuMethods } from './BaseEditBarMenu.svelte';
	import type { Theme } from '$lib/themes/types';

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
</script>

<BaseEditBarMenu
	name="Theme Settings"
	{editBarEl}
	{editBarWrapperEl}
	bind:menuOpen
	bind:this={menu}
>
	<ThemeEditor bind:theme />
</BaseEditBarMenu>
