<script lang="ts">
	import { page } from '$app/state';
	import { aboutWebpalsDialog } from '$lib/components/NavBar/AccountMenu.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { Bell, DoorOpen, EyeSlash, Numpad, Palette, User } from 'phosphor-svelte';
	import './layout.scss';
	import type { Component } from 'svelte';
	import Webpals from '$icons/Webpals.svelte';

	let { data, children } = $props();

	const settingCategories: {
		name: string;
		settings: {
			label: string;
			href: string;
			icon: Component;
			badge?: {
				label: string;
				color?: string;
			};
		}[];
	}[] = [
		{
			name: 'Account Settings',
			settings: [
				{
					label: 'Account',
					href: '/settings/account',
					icon: User
				},
				{
					label: 'Privacy',
					href: '/settings/privacy',
					icon: EyeSlash
				}
			]
		},
		{
			name: 'App Settings',
			settings: [
				{
					label: 'Notifications',
					href: '/settings/notifications',
					icon: Bell
				},
				{
					label: 'Appearance',
					href: '/settings/appearance',
					icon: Palette
				}
			]
		},
		// hardcode this bc idrc lol
		...(data.currentProfile.username.toLowerCase() === 'clembs'
			? [
					{
						name: 'Tester Secrets',
						settings: [
							{
								label: 'Invite Codes',
								href: '/settings/invite-codes',
								icon: Numpad,
								badge: {
									label: data.currentProfile.inviteCodes
										.filter(({ claimedAt }) => !claimedAt)
										.length.toString(),
									color: 'var(--color-heading)'
								}
							}
						]
					}
				]
			: [])
	];
</script>

<div id="settings">
	<aside>
		<nav class="top" aria-label="Main settings">
			{#each settingCategories as category}
				<section>
					<div class="category-label">{category.name}</div>
					<ul>
						{#each category.settings as setting}
							{@const current = page.url.pathname.includes(setting.href)}
							<li>
								<a class="nav-item" href={setting.href} aria-current={current}>
									<div class="left">
										<div class="icon">
											<setting.icon weight={current ? 'fill' : 'regular'} />
										</div>
										<div class="label">
											{setting.label}
										</div>
									</div>

									{#if setting.badge}
										<div class="badge" style:--color={setting.badge.color}>
											{setting.badge.label}
										</div>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</nav>

		<nav aria-label="Other options" class="bottom">
			<ul>
				<li>
					<button
						onclick={() => {
							dialogPortal.openDialog(aboutWebpalsDialog);
						}}
						class="nav-item"
					>
						<div class="left">
							<div class="icon">
								<Webpals />
							</div>
							<div class="label">About Webpals</div>
						</div>
					</button>
				</li>
				<li>
					<a href="/logout" class="nav-item">
						<div class="left">
							<div class="icon">
								<DoorOpen weight="regular" />
							</div>
							<div class="label">Logout</div>
						</div>
					</a>
				</li>
			</ul>
		</nav>
	</aside>

	<main>
		{@render children()}
	</main>
</div>

<style lang="scss">
	#settings {
		--aside-width: 300px;

		display: flex;
		max-width: 900px;
		margin: 0 auto;
		height: calc(100vh - var(--navbar-height));

		aside {
			padding: calc(var(--base-padding) * 1.25) calc(var(--base-padding) * 0.75);
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);
			justify-content: space-between;
			width: var(--aside-width);
			flex-shrink: 0;

			nav {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 1.25);
			}

			.category-label {
				font-size: 0.9rem;
				font-weight: 500;
				margin-bottom: calc(var(--base-gap) * 0.5);
				margin-left: calc(var(--base-gap) * 0.75);
			}

			ul {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.25);
				list-style: none;
			}

			.nav-item {
				display: flex;
				align-items: center;
				gap: var(--base-gap);
				justify-content: space-between;
				padding: calc(var(--base-padding) * 0.625) calc(var(--base-padding) * 0.75);
				border-radius: var(--inputs-border-base-radius);
				color: var(--inputs-on-background-color);
				text-decoration: none;
				background-color: transparent;
				border: none;
				width: 100%;
				cursor: pointer;

				&:hover {
					backdrop-filter: brightness(0.9);
				}

				&[aria-current='true'] {
					background-color: var(--inputs-on-background-color);
					color: var(--inputs-background-color);
				}

				.left {
					display: flex;
					gap: var(--base-gap);
					align-items: center;
				}

				.badge {
					background-color: var(--color);
					color: var(--widgets-background-color);
					border-radius: 999px;
					height: 24px;
					width: 24px;
					font-size: 0.75rem;
					display: grid;
					place-items: center;
					border: 1px solid var(--widgets-background-color);
				}
			}
		}

		main {
			display: flex;
			flex-direction: column;
			margin: var(--base-padding);
			background-color: var(--widgets-background-color);
			border-radius: var(--widgets-border-base-radius);
			overflow-y: auto;
			width: 100%;
		}
	}
</style>
