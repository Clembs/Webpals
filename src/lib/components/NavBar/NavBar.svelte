<script lang="ts">
	import { page } from '$app/stores';
	import { Island, House, Palette, Bell, BellRinging } from 'phosphor-svelte';
	import Avatar from '../Avatar.svelte';
	import NotificationsMenu from './NotificationsMenu.svelte';

	let notificationsMenuOpen = $state(false);
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
					<li data-submenu="true">
						<button
							onclick={() => (notificationsMenuOpen = !notificationsMenuOpen)}
							aria-current={notificationsMenuOpen}
							aria-label="Notifications"
							title="Notifications"
						>
							{#if $page.data.currentUser.notifications.length > 0}
								<BellRinging weight={notificationsMenuOpen ? 'fill' : 'regular'} />
							{:else}
								<Bell weight={notificationsMenuOpen ? 'fill' : 'regular'} />
							{/if}
						</button>

						{#if notificationsMenuOpen}
							<NotificationsMenu user={$page.data.currentUser} />
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
