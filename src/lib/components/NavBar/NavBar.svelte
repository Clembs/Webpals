<script lang="ts">
	import { page } from '$app/stores';
	import { Island, House, Palette, Bell, BellRinging } from 'phosphor-svelte';
	import Avatar from '../Avatar.svelte';
	import NotificationsMenu from './NotificationsMenu.svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { enhance } from '$app/forms';

	let notificationsMenuOpen = $state(false);

	let unreadNotifications = $derived($page.data.currentUser?.notifications.filter((n) => !n.read));
</script>

<header>
	<nav>
		<a class="logo" href="/" aria-label="Home" title="Home">
			<Island />
		</a>

		<div class="right">
			<ul>
				<li>
					<a href="/" aria-label="Feeds" title="Feeds" aria-current={$page.url.pathname === '/'}>
						<House weight={$page.url.pathname === '/' ? 'fill' : 'regular'} />
					</a>
				</li>
				<li>
					<button aria-label="Theme settings" title="Theme settings">
						<Palette weight="regular" />
					</button>
				</li>
				{#if $page.data.currentUser}
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
								user={$page.data.currentUser}
							/>
						{/if}
					</li>
				{/if}
			</ul>
			{#if !$page.data.currentUser}
				<a href="/login"> Join Islands </a>
			{:else}
				<button aria-label="Profile" title="Profile">
					<Avatar user={$page.data.currentUser} size="40px" />
				</button>
			{/if}
		</div>
	</nav>
</header>

<style lang="scss">
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: calc(var(--base-padding) * 0.25) var(--base-padding);
		gap: var(--base-gap);
		background-color: var(--widgets-background-color);
		height: calc(var(--base-padding) * 4);

		a,
		button {
			display: grid;
			place-items: center;
			border-radius: 99px;
			padding: calc(var(--base-padding) * 0.5);
			background-color: transparent;
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
				background-color: var(--widgets-background-color-dim);
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
	}
</style>
