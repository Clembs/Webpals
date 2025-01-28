<script lang="ts">
	import BasePlaceholderWidget from '$lib/widgets/picker/BasePlaceholderWidget.svelte';
	import { defaultWidgets } from '$lib/widgets/default-widgets';
	import type { FullUser } from '$lib/db/schema/types';
	import PlaceholderFriendsWidget from '$lib/widgets/picker/PlaceholderFriendsWidget.svelte';
	import PlaceholderMusicWidget from '$lib/widgets/picker/PlaceholderMusicWidget.svelte';
	import PlaceholderConnectionsWidgets from '$lib/widgets/picker/PlaceholderConnectionsWidgets.svelte';
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

	// filter widgets that are not in a user's widgets
	// user.widgets is an array of arrays containing the widgets
	let addableWidgets = $derived(
		defaultWidgets.filter((e) => !user.widgets.find((c) => c.find((w) => w.id === e.id)))
	);
</script>

<BaseEditBarMenu name="Add a widget" {editBarEl} {editBarWrapperEl} bind:menuOpen>
	{#if addableWidgets.length === 0}
		<div class="no-widgets">
			<p>No more widgets to add :(</p>

			<p>In a future version, you'll be able to add community widgets too!</p>
		</div>
	{:else}
		<ul class="widgets">
			{#each addableWidgets as widget}
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
	{/if}
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

	.no-widgets {
		align-content: center;
		gap: 0;
		height: 100%;
		padding: var(--base-padding);
		text-align: center;
	}
</style>
