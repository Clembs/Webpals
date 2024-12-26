<script lang="ts">
	import { page } from '$app/state';
	import { aboutIslandsDialog } from '$lib/components/NavBar/AccountMenu.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { Bell, DoorOpen, EyeSlash, Island, Palette, User } from 'phosphor-svelte';

	const settingCategories: {
		name: string;
		settings: { label: string; href: string; icon: typeof Island }[];
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
		}
	];

	let { children } = $props();
</script>

<div id="settings">
	<aside>
		<nav class="top" aria-label="Main settings">
			{#each settingCategories as category}
				<section>
					<div class="category-label">{category.name}</div>
					<ul>
						{#each category.settings as { label, href, icon: Icon }}
							{@const current = page.url.pathname.includes(href)}
							<li>
								<a class="nav-item" {href} aria-current={current}>
									<div class="icon">
										<Icon weight={current ? 'fill' : 'regular'} />
									</div>
									<div class="label">
										{label}
									</div>
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
							dialogPortal.openDialog(aboutIslandsDialog);
						}}
						class="nav-item"
					>
						<div class="icon">
							<Island />
						</div>
						<div class="label">About Islands</div>
					</button>
				</li>
				<li>
					<a href="/logout" class="nav-item">
						<div class="icon">
							<DoorOpen weight="regular" />
						</div>
						<div class="label">Logout</div>
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
		flex: 1;

		aside {
			padding: calc(var(--base-padding) * 1.25) calc(var(--base-padding) * 0.75);
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);
			justify-content: space-between;
			width: var(--aside-width);
			flex-shrink: 0;

			h1 {
				font-size: 1.5rem;
				margin-bottom: var(--base-gap);
				margin-left: calc(var(--base-gap) * 0.75);
			}

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
				padding: calc(var(--base-padding) * 0.625) calc(var(--base-padding) * 0.75);
				border-radius: var(--inputs-border-base-radius);
				color: var(--widgets-text-color);
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

				.icon {
					width: 24px;
					height: 24px;
				}

				.label {
					font-size: 1rem;
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

			:global(section) {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.5);
				padding: var(--base-padding);
			}
		}
	}
</style>
