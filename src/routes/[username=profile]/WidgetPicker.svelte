<script lang="ts">
	import BasePlaceholderWidget from '$lib/widgets/picker/BasePlaceholderWidget.svelte';
	import { defaultWidgets } from '$lib/widgets/default-widgets';
	import type { FullUser } from '$lib/db/schema/users';
	import PlaceholderFriendsWidget from '$lib/widgets/picker/PlaceholderFriendsWidget.svelte';
	import PlaceholderMusicWidget from '$lib/widgets/picker/PlaceholderMusicWidget.svelte';
	import PlaceholderConnectionsWidgets from '$lib/widgets/picker/PlaceholderConnectionsWidgets.svelte';
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

<BaseEditBarMenu name="Add a widget" {editBarEl} {editBarWrapperEl} bind:menuOpen bind:this={menu}>
	<ul class="widgets">
		<!-- filter widgets that are not in a user's widgets
	user.widgets is an array of arrays containing the widgets -->
		{#each defaultWidgets.filter((e) => !user.widgets.find( (c) => c.find((w) => w.id === e.id) )) as widget}
			{#if widget.id === 'about_me'}
				<BasePlaceholderWidget bind:showPicker={menuOpen} widget-id={widget.id}>
					<h3>About me</h3>
					<p>Write a little bit about yourself.</p>
				</BasePlaceholderWidget>
			{:else if widget.id === 'friends'}
				<PlaceholderFriendsWidget bind:showPicker={menuOpen} />
			{:else if widget.id === 'music'}
				<PlaceholderMusicWidget bind:showPicker={menuOpen} />
			{:else if widget.id === 'connections'}
				<PlaceholderConnectionsWidgets bind:showPicker={menuOpen} />
			{/if}
		{/each}
	</ul>
</BaseEditBarMenu>

<style lang="scss">
	.widgets {
		columns: 2;
		list-style: none;
		padding: calc(var(--base-padding) * 1.25);
		padding-top: 0;
		margin: 0;

		@media (max-width: 950px) {
			columns: 1;
		}
	}
</style>
