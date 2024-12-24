<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import CustomWidgetComponent from '$lib/widgets/blocks/CustomWidgetComponent.svelte';
	import AboutMeWidgetComponent from '$lib/widgets/default/AboutMeWidgetComponent.svelte';
	import ConnectionsWidgetComponent from '$lib/widgets/default/ConnectionsWidgetComponent.svelte';
	import FriendsWidgetComponent from '$lib/widgets/default/FriendsWidgetComponent.svelte';
	import MusicWidgetComponent from '$lib/widgets/default/MusicWidgetComponent.svelte';
	import ProfileWidgetComponent from '$lib/widgets/default/ProfileWidgetComponent.svelte';
	import type { AboutMeWidget, AnyWidget } from '$lib/widgets/types';
	import ProfileEditBar from './ProfileEditBar.svelte';

	let { data } = $props();

	let theme = $state(data.user.theme);

	$effect(() => {
		theme = data.user.theme;
	});
</script>

<Meta
	title={data.user.displayName || data.user.username}
	description={(
		data.user.widgets
			.find((c) => c.find((w) => w.id === 'about_me'))
			?.find((w) => w.id === 'about_me') as AboutMeWidget
	)?.content}
/>

{#snippet widgets(widgets: AnyWidget[])}
	{#each widgets as widget}
		{#if widget.id === 'about_me' && 'content' in widget}
			<AboutMeWidgetComponent {widget} {...data} />
		{:else if widget.id === 'music' && 'content_url' in widget && (!data.editing ? widget.content_url : true)}
			<MusicWidgetComponent {widget} {...data} />
		{:else if widget.id === 'friends' && !('blocks' in widget)}
			<FriendsWidgetComponent {widget} {...data} />
		{:else if widget.id === 'connections' && 'connections' in widget}
			<ConnectionsWidgetComponent {widget} {...data} />
		{:else if 'blocks' in widget}
			<CustomWidgetComponent {widget} {...data} />
		{/if}
	{/each}
{/snippet}

<div id="root-profile">
	<ThemeProvider {theme}>
		<main>
			<div class="column">
				<ProfileWidgetComponent {...data} />
				{@render widgets(data.user.widgets[0].sort((a, b) => a.position - b.position))}
			</div>
			<div class="column">
				{@render widgets(data.user.widgets[1].sort((a, b) => a.position - b.position))}
			</div>
		</main>
	</ThemeProvider>
</div>

{#if data.editable && data.currentUser}
	<ProfileEditBar bind:editing={data.editing} user={data.currentUser} />
{/if}

<style lang="scss">
	#root-profile {
		display: flex;
		flex: 1;
	}

	main {
		background: var(--background);
		display: grid;
		padding: clamp(calc(var(--base-padding) / 2), 2vw, calc(var(--base-padding) * 2));
		gap: var(--base-gap);
		grid-template-columns: 1fr 1.5fr;
		grid-template-rows: 0fr;
		background-position: center;
		background-size: cover;
		flex: 1;

		.column {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);
		}

		@media (max-width: 950px) {
			grid-template-columns: 1fr;
		}
	}
</style>
