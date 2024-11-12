<script lang="ts">
	import { X } from 'phosphor-svelte';
	import BasePlaceholderWidget from './BasePlaceholderWidget.svelte';
	import { defaultWidgets } from '../default-widgets';
	import type { FullUser } from '$lib/db/schema/users';
	import PlaceholderFriendsWidget from './PlaceholderFriendsWidget.svelte';
	import PlaceholderMusicWidget from './PlaceholderMusicWidget.svelte';
	import PlaceholderConnectionsWidgets from './PlaceholderConnectionsWidgets.svelte';

	let {
		user,
		showPicker = $bindable(false)
	}: {
		user: FullUser | undefined | null;
		showPicker: boolean;
	} = $props();

	let addWidgetMenuScroll = $state(0);
	let dialogEl = $state<HTMLDialogElement>();

	$effect(() => {
		if (showPicker) {
			dialogEl?.showModal();
		} else {
			dialogEl?.close();
		}
	});
</script>

<dialog bind:this={dialogEl} id="widget-picker" oncancel={() => (showPicker = false)}>
	<div class="header" class:scrolling={addWidgetMenuScroll}>
		<h2>Add a widget to your profile</h2>

		<form method="dialog">
			<button class="close-btn" onclick={() => (showPicker = false)}>
				<X weight="regular" />
			</button>
		</form>
	</div>

	<div
		class="scrollable"
		onscroll={(ev) => (addWidgetMenuScroll = (ev.target as HTMLUListElement).scrollTop)}
	>
		<ul class="widgets">
			<!-- filter widgets that are not in a user's widgets
			user.widgets is an array of arrays containing the widgets -->
			{#if user}
				{#each defaultWidgets.filter((e) => !user.widgets.find( (c) => c.find((w) => w.id === e.id) )) as widget}
					{#if widget.id === 'about_me'}
						<BasePlaceholderWidget bind:showPicker widget-id={widget.id}>
							<h3>About me</h3>
							<p>Write a little bit about yourself.</p>
						</BasePlaceholderWidget>
					{:else if widget.id === 'friends'}
						<PlaceholderFriendsWidget bind:showPicker />
					{:else if widget.id === 'music'}
						<PlaceholderMusicWidget bind:showPicker />
					{/if}
				{/each}
			{/if}

			<PlaceholderConnectionsWidgets bind:showPicker />
		</ul>
	</div>
</dialog>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#widget-picker {
		bottom: var(--base-padding);
		top: auto;
		left: 50%;
		transform: translateX(-50%);

		flex-direction: column;
		background-color: var(--widgets-background-color);
		border-radius: calc(var(--widgets-border-base-radius) * 1.25);
		box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
			var(--widgets-box-shadow-blur) var(--widgets-box-shadow-color);
		border: var(--widgets-border-width) solid var(--widgets-border-color);
		max-height: 40vh;
		max-width: 800px;
		width: 100%;

		&[open] {
			display: flex;
		}

		.close-btn {
			background: none;
			border: none;
			cursor: pointer;
			padding: calc(var(--base-padding) * 0.5);
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--base-gap);
			padding: calc(var(--base-padding) * 1.25);
			border-bottom: var(--widgets-border-width) solid transparent;
			transition: border-color 200ms;

			&.scrolling {
				border-bottom: var(--widgets-border-width) solid var(--widgets-border-color);
			}
		}

		.scrollable {
			display: flex;
			flex-direction: column;
			overflow-y: scroll;
		}

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

		@media (max-width: 800px) {
			max-height: 60vh;
			border-radius: calc(var(--widgets-border-base-radius) * 1.25)
				calc(var(--widgets-border-base-radius) * 1.25) 0 0;
			bottom: 0;
		}

		&::backdrop {
			background: rgba(0, 0, 0, 0.5);
		}
	}
</style>
