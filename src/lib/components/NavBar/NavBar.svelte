<script lang="ts">
	import { page } from '$app/state';
	import { House, Bell, BellRinging } from 'phosphor-svelte';
	import Avatar from '../Avatar.svelte';
	import NotificationsMenu from './NotificationsMenu.svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { enhance } from '$app/forms';
	import AccountMenu from './AccountMenu.svelte';
	import { clientSupabase } from '$lib/db/supabase';
	import { onDestroy, onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import Webpals from '$icons/Webpals.svelte';

	let accountMenuOpen = $state(false);
	let notificationsMenuOpen = $state(false);

	let unreadNotifications = $derived(
		page.data.currentProfile?.notifications.filter((n) => !n.read)
	);

	let supabaseChannel = $state<RealtimeChannel>();

	onMount(() => {
		supabaseChannel = clientSupabase
			.channel('notification-updates')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					table: 'notifications',
					schema: 'public',
					// TODO: figure out better security
					filter: `user_id = ${page.data.currentProfile?.id}`
				},
				(payload) => invalidate('layout:user')
			)
			.subscribe((status) => console.log('supabase realtime', status));
	});

	onDestroy(() => supabaseChannel?.unsubscribe());
</script>

<header>
	<nav>
		<a class="logo" href="/" aria-label="Home" title="Home">
			<Webpals />
		</a>

		<div class="right">
			<ul>
				<li>
					<a href="/" aria-label="Feeds" title="Feeds" aria-current={page.url.pathname === '/'}>
						<House weight={page.url.pathname === '/' ? 'fill' : 'regular'} />
					</a>
				</li>
				<!-- <li>
					<button aria-label="Theme settings" title="Theme settings">
						<Palette weight="regular" />
					</button>
				</li> -->
				{#if page.data.currentProfile}
					<li
						data-submenu="true"
						use:clickoutside
						onclickoutside={() => (notificationsMenuOpen = false)}
					>
						<form use:enhance action="/api/notifications?/markAllAsRead" method="post">
							<button
								onclick={() => (notificationsMenuOpen = !notificationsMenuOpen)}
								aria-current={notificationsMenuOpen}
								aria-label="Notifications"
								title="Notifications"
							>
								{#if unreadNotifications!.length > 0}
									<div aria-label="{unreadNotifications!.length} new notifications" class="badge">
										{unreadNotifications!.length}
									</div>
									<BellRinging weight={notificationsMenuOpen ? 'fill' : 'regular'} />
								{:else}
									<Bell weight={notificationsMenuOpen ? 'fill' : 'regular'} />
								{/if}
							</button>
						</form>

						{#if notificationsMenuOpen}
							<NotificationsMenu
								bind:menuOpen={notificationsMenuOpen}
								user={page.data.currentProfile}
							/>
						{/if}
					</li>
				{/if}
			</ul>
			{#if !page.data.currentProfile}
				<a href="/login"> Join Webpals </a>
			{:else}
				<div
					use:clickoutside
					onclickoutside={() => (accountMenuOpen = false)}
					class="account-menu-wrapper"
				>
					<button
						use:clickoutside
						onclick={() => (accountMenuOpen = !accountMenuOpen)}
						aria-label="Profile"
						title="Profile"
					>
						<Avatar user={page.data.currentProfile} size="40px" />
					</button>
					{#if accountMenuOpen}
						<AccountMenu bind:menuOpen={accountMenuOpen} user={page.data.currentProfile} />
					{/if}
				</div>
			{/if}
		</div>
	</nav>
</header>

<style lang="scss">
	:root {
		--navbar-height: calc(40px + var(--base-padding) * 1.5);
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: calc(var(--base-padding) * 0.25) var(--base-padding);
		gap: var(--base-gap);
		background-color: var(--widgets-background-color);
		height: var(--navbar-height);

		a,
		button {
			display: grid;
			place-items: center;
			border-radius: 99px;
			padding: calc(var(--base-padding) * 0.5);
			background-color: transparent;
			color: var(--color-heading);
			cursor: pointer;
			border: none;
			position: relative;

			&[aria-current='true'] {
				background-color: var(--widgets-background-color-dim);
			}

			&:global(.logo svg) {
				width: 2rem;
				height: 2rem;
			}

			&:hover {
				backdrop-filter: brightness(0.95);
			}
		}

		.right {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;
		}

		ul {
			display: contents;
			list-style: none;

			li[data-submenu='true'] {
				position: relative;
			}
		}

		.badge {
			position: absolute;
			top: -2px;
			right: -2px;
			font-weight: bold;
			background-color: var(--color-urgent);
			color: var(--background);
			border-radius: 99px;
			display: grid;
			place-items: center;
			height: calc(var(--base-padding) * 1.25);
			width: calc(var(--base-padding) * 1.25);
			font-size: 14px;
		}
		.account-menu-wrapper {
			position: relative;
		}
	}
</style>
