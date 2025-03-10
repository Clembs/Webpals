<script module lang="ts">
	export { aboutWebpalsDialog };
</script>

<script lang="ts">
	import BlueskyLogo from '$icons/brands/BlueskyLogo.svelte';
	import XLogo from '$icons/brands/XLogo.svelte';
	import DiscordLogo from '$icons/brands/DiscordLogo.svelte';
	import Webpals from '$icons/Webpals.svelte';
	import type { FullProfile } from '$lib/db/types';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { ArrowSquareOut, DoorOpen, Gear, UserSquare } from 'phosphor-svelte';
	import { fly } from 'svelte/transition';
	import WebpalsThumbup from '$icons/WebpalsThumbup.svelte';
	import GitHubLogo from '$icons/brands/GitHubLogo.svelte';
	import type { Component } from 'svelte';

	let {
		menuOpen = $bindable(false),
		user
	}: {
		menuOpen: boolean;
		user: FullProfile;
	} = $props();
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			menuOpen = false;
		}
	}}
/>

{#snippet link(href: string, label: string, Icon: Component)}
	<li>
		<a {href} target="_blank" rel="noopener noreferrer">
			<div class="label">
				<Icon />
				{label}
			</div>

			<ArrowSquareOut weight="regular" />
		</a>
	</li>
{/snippet}

{#snippet aboutWebpalsDialog()}
	<div id="about-webpals">
		<div class="header">
			<WebpalsThumbup size={64} />

			<h1>Webpals</h1>

			<p id="copyright-blurb">
				&copy; 2024-{new Date().getFullYear()} Clembs
			</p>

			<div id="version-badge">Private Alpha</div>
		</div>

		<ul aria-label="Issues">
			{@render link('https://discord.gg/Mauurzxvrp', 'Community', DiscordLogo)}
			{@render link('https://github.com/Clembs/Webpals/issues', 'Report an Issue', GitHubLogo)}
		</ul>

		<ul aria-label="Socials">
			{@render link(
				'https://bsky.app/profile/did:plc:ywcz5zihn4hxynh6wmxk4f4y',
				'Bluesky',
				BlueskyLogo
			)}
			{@render link('https://x.com/clembsv', 'X/Twitter', XLogo)}
		</ul>

		<!-- TODO -->
		<!-- <ul aria-label="Legal">
			{@render link('/terms-of-service', 'Terms of Service', Scroll)}
			{@render link('/privacy-policy', 'Privacy Policy', EyeSlash)}
		</ul> -->
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
					dialogPortal.openDialog(aboutWebpalsDialog);
				}}
			>
				<Webpals />
				About Webpals
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
					color: var(--color-heading);
					border: none;
					cursor: pointer;

					&:hover {
						backdrop-filter: brightness(0.95);
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

	#about-webpals {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(var(--base-gap) * 1.25);
		width: 350px;

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		h1 {
			font-size: 1.75rem;
			display: flex;
			margin-top: var(--base-gap);
			margin-bottom: calc(var(--base-gap) * 0.25);
		}

		#copyright-blurb {
			margin-bottom: calc(var(--base-gap) * 0.75);
		}

		#version-badge {
			background-color: #987fff;
			padding: calc(var(--base-padding) * 0.25) calc(var(--base-padding) * 0.75);
			align-items: center;
			height: fit-content;
			margin-left: calc(var(--base-gap) * 0.25);
			border-radius: 99px;
			color: var(--inputs-background-color);
			transform: translateY(-4px);
		}

		ul {
			@include mixins.fancy-list;
			width: 100%;

			a {
				display: flex;
				align-items: center;
				gap: var(--base-gap);
				text-decoration: none;
				padding: var(--base-padding);
				justify-content: space-between;

				.label {
					display: flex;
					align-items: center;
					gap: calc(var(--base-gap) * 0.75);
				}

				&:hover {
					backdrop-filter: brightness(0.95);
				}
			}
		}
	}
</style>
