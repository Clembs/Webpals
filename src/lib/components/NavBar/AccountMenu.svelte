<script lang="ts">
	import DiscordLogo from '$icons/DiscordLogo.svelte';
	import type { FullUser } from '$lib/db/schema/users';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { Butterfly, Code, DoorOpen, Gear, Island, UserSquare, XLogo } from 'phosphor-svelte';
	import { fly } from 'svelte/transition';

	let {
		menuOpen = $bindable(false),
		user
	}: {
		menuOpen: boolean;
		user: FullUser;
	} = $props();
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			menuOpen = false;
		}
	}}
/>

{#snippet aboutIslandsDialog()}
	<div class="about-islands">
		<Island size={64} />

		<h1>
			Islands
			<span class="label" aria-label="(developer preview)"> developer preview </span>
		</h1>

		<p>Developed by Clembs</p>

		<ul class="socials">
			<li>
				<a
					href="https://bsky.app/profile/did:plc:ywcz5zihn4hxynh6wmxk4f4y"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Butterfly />
					Bluesky
				</a>
			</li>
			<li>
				<a href="https://x.com/clembsv" target="_blank" rel="noopener noreferrer">
					<XLogo weight="regular" />
					X/Twitter
				</a>
			</li>
			<li>
				<a href="https://clembs.com/discord" target="_blank" rel="noopener noreferrer">
					<DiscordLogo />
					Discord
				</a>
			</li>
			<li>
				<a href="https://github.com/Clembs/islands" target="_blank" rel="noopener noreferrer">
					<Code weight="regular" />
					Source code
				</a>
			</li>
		</ul>
	</div>
{/snippet}

<div class="account-menu" transition:fly={{ y: -20, duration: 200 }}>
	<div class="header">
		<h2>
			{user.displayName || user.username}
			<span class="subtext">
				@{user.username}
			</span>
		</h2>
	</div>

	<ul class="option-list">
		<li class="option">
			<a href="/{user.username}" onclick={() => (menuOpen = false)}>
				<UserSquare weight="regular" />
				My profile
			</a>
		</li>
		<li class="option">
			<a href="/settings" onclick={() => (menuOpen = false)}>
				<Gear weight="regular" />
				Settings
			</a>
		</li>
		<li class="option">
			<button
				onclick={() => {
					menuOpen = false;
					dialogPortal.openDialog(aboutIslandsDialog);
				}}
			>
				<Island />
				About Islands
			</button>
		</li>
		<li class="option">
			<a data-sveltekit-preload-data="off" href="/logout" onclick={() => (menuOpen = false)}>
				<DoorOpen weight="regular" />
				Logout
			</a>
		</li>
	</ul>
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.account-menu {
		@include mixins.card;
		width: 300px;
		position: absolute;
		top: 100%;
		right: 0;
		z-index: 99;

		h2 {
			font-size: 1.25rem;
		}

		.option-list {
			@include mixins.fancy-list;

			.option {
				a,
				button {
					display: flex;
					align-items: center;
					padding: calc(var(--base-padding) * 0.75);
					gap: var(--base-gap);
					text-decoration: none;
					width: 100%;
					background-color: transparent;
					border: none;
					cursor: pointer;

					&:hover {
						background-color: var(--widgets-background-color-dim);
					}
				}
			}
		}

		@media (max-width: 768px) {
			width: 100%;
			position: fixed;
			bottom: 0;
			top: 400px;
			border-bottom: none;
			border-radius: var(--widgets-border-base-radius) var(--widgets-border-base-radius) 0 0;
		}
	}

	.about-islands {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--base-gap);

		h1 {
			font-size: 1.5rem;
			display: flex;

			.label {
				font-size: 0.75rem;
				background-color: #987fff;
				padding: calc(var(--base-padding) * 0.25) calc(var(--base-padding) * 0.5);
				align-items: center;
				height: fit-content;
				margin-left: calc(var(--base-gap) * 0.25);
				border-radius: 99px;
				color: var(--inputs-background-color);
			}
		}

		.socials {
			@include mixins.fancy-list;
			width: 100%;

			a {
				display: flex;
				align-items: center;
				gap: var(--base-gap);
				text-decoration: none;
				padding: var(--base-padding);
			}
		}
	}
</style>
