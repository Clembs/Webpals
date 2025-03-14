<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import CustomWidgetComponent from '$lib/widgets/blocks/CustomWidgetComponent.svelte';
	import AboutMeWidgetComponent from '$lib/widgets/default/AboutMeWidgetComponent.svelte';
	import ConnectionsWidgetComponent from '$lib/widgets/default/ConnectionsWidgetComponent.svelte';
	import FriendsWidgetComponent from '$lib/widgets/default/FriendsWidgetComponent.svelte';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import ProfileWidgetComponent from '$lib/widgets/default/ProfileWidgetComponent.svelte';
	import type {
		AboutMeWidget,
		AnyWidget,
		ConnectionsWidget,
		FriendsWidget
	} from '$lib/widgets/types';
	import { flip } from 'svelte/animate';
	import ProfileEditBar from './ProfileEditBar.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { invalidateAll } from '$app/navigation';
	import BaseWidget, { isAnyWidgetEditing } from '$lib/widgets/BaseWidget.svelte';
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import ClockWidgetComponent from '$lib/widgets/default/ClockWidgetComponent.svelte';

	let { data } = $props();

	let theme = $state(data.profile.theme);
	let userWidgets = $state(data.profile.widgets);
	let editing = $state(data.editing);

	$effect(() => {
		theme = data.profile.theme;
		userWidgets = data.profile.widgets;
		editing = data.editing;
	});

	async function updateWidgetPosition(widgetId: string) {
		const newColumn = userWidgets.findIndex((c) => c.find((w) => w.id === widgetId));
		const newPosition = userWidgets[newColumn].findIndex((w) => w.id === widgetId);

		const searchParams = new URLSearchParams();
		searchParams.append('id', widgetId);
		searchParams.append('new-column', newColumn.toString());
		searchParams.append('new-position', newPosition.toString());

		await fetch(`/api/profile?/updateWidgetPosition&${searchParams}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});

		await invalidateAll();
	}
</script>

<Meta
	title={data.profile.displayName || data.profile.username}
	description={(
		userWidgets
			.find((c) => c.find((w) => w.id === 'about_me'))
			?.find((w) => w.id === 'about_me') as AboutMeWidget
	)?.content}
/>

{#snippet widgetEl(widget: AnyWidget)}
	{#if widget.id === 'about_me' && 'content' in widget}
		<AboutMeWidgetComponent {widget} {...data} {editing} />
	{:else if widget.id === 'music' && 'content_url' in widget && (!editing ? widget.content_url : true)}
		<MusicWidgetComponent {widget} {...data} {editing} />
	{:else if widget.id === 'connections'}
		<ConnectionsWidgetComponent widget={widget as ConnectionsWidget} {...data} {editing} />
	{:else if widget.id === 'clock' && 'hour_format' in widget}
		<ClockWidgetComponent {widget} {...data} {editing} />
	{:else if 'blocks' in widget}
		<CustomWidgetComponent {widget} {...data} {editing} />
	{:else if widget.id === 'friends'}
		<FriendsWidgetComponent widget={widget as FriendsWidget} {...data} {editing} />
	{:else if editing}
		<BaseWidget editingMode={editing} {widget}>
			I didn't code this widget in yet (type {widget.id}).<br />
			Other users won't see this widget, but once it's coded it'll render properly!
		</BaseWidget>
	{/if}
{/snippet}

{#snippet draggableWidgetColumns(widgets: AnyWidget[], index: number)}
	<div
		class="column"
		use:dndzone={{
			items: widgets,
			flipDurationMs: 200,
			dragDisabled: isAnyWidgetEditing.value
		}}
		onconsider={(ev) => {
			userWidgets[index] = ev.detail.items;
		}}
		onfinalize={async (ev) => {
			userWidgets[index] = ev.detail.items;
			await updateWidgetPosition(ev.detail.info.id);
		}}
	>
		{#each widgets as widget (widget.id)}
			<div class="widget-wrapper" animate:flip={{ duration: 200 }}>
				<ThemeProvider {theme}>
					{@render widgetEl(widget)}
				</ThemeProvider>
			</div>
		{/each}
	</div>
{/snippet}

<ThemeProvider {theme}>
	<NavBar />

	<main>
		{#each userWidgets as column, index}
			<div class="column-outer">
				{#if index === 0}
					<ProfileWidgetComponent {...data} {editing} />
				{/if}
				{#if editing}
					{@render draggableWidgetColumns(column, index)}
				{:else}
					<div class="column">
						{#each column as widget (widget.id)}
							{@render widgetEl(widget)}
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</main>
</ThemeProvider>

{#if data.editable && data.currentProfile && data.currentUser}
	<ProfileEditBar
		currentUser={data.currentUser}
		bind:editing
		profile={data.currentProfile}
		bind:theme
	/>
{/if}

<style lang="scss">
	main {
		background: var(--background);
		background-size: var(--background-size);
		background-position: var(--background-position);
		background-repeat: var(--background-repeat);
		background-attachment: var(--background-attachment);
		image-rendering: var(--background-rendering);

		display: grid;
		padding: clamp(calc(var(--base-padding) / 2), 2vw, calc(var(--base-padding) * 2));
		gap: var(--base-gap);
		grid-template-columns: 1fr 1.5fr;
		grid-template-rows: 1fr auto; // thx kevin powell https://stackoverflow.com/a/45897789
		flex: 1;

		.column-outer {
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);
			height: 100%;

			.column {
				display: flex;
				flex-direction: column;
				gap: var(--base-gap);
				height: 100%;
			}
		}

		@media (max-width: 950px) {
			grid-template-columns: 1fr;
			grid-template-rows: 0fr;
		}
	}
</style>
