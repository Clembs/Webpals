<script lang="ts">
	import { page } from '$app/stores';
	import { Island, House, Palette, Bell, BellRinging } from 'phosphor-svelte';
	import Avatar from './Avatar.svelte';
</script>

<header>
	<nav>
		<a class="logo" href="/" aria-label="Home" title="Home">
			<Island weight="bold" />
		</a>

		<div class="right">
			<ul>
				<li>
					<a href="/" aria-label="Feeds" title="Feeds">
						<House weight={$page.url.pathname === '/' ? 'fill' : 'bold'} />
					</a>
				</li>
				<li>
					<button aria-label="Theme settings" title="Theme settings">
						<Palette weight="bold" />
					</button>
				</li>
				{#if $page.data.currentUser}
					<li>
						<button aria-label="Notifications" title="Notifications">
							<Bell weight="bold" />
						</button>
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
		}
	}
</style>
