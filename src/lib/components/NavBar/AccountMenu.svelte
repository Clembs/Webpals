<script lang="ts">
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
					<svg
						role="img"
						height="24"
						width="24"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><title>Discord</title><path
							d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
						/>
					</svg>
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
	@use '../../../styles/mixins';

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
