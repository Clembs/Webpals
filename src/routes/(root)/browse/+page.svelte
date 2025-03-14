<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { type Profile } from '$lib/db/types';
	import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';
	import { formatDate, formatRelativeTime } from '$lib/helpers/text';
	import { mergeThemes, plainTheme } from '$lib/themes/mergeThemes';

	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import { Cake, Circle, CircleDashed, Prohibit } from 'phosphor-svelte';

	let { data } = $props();

	let usePlainTheme = $state(false);
</script>

{#snippet renderProfile(profile: Profile)}
	<ThemeProvider theme={usePlainTheme ? plainTheme : mergeThemes(plainTheme, profile.theme || {})}>
		{@const userAlive =
			profile.status !== 'offline' &&
			profile.lastHeartbeat.getTime() > Date.now() - HEARTBEAT_INTERVAL + 1000}
		<li>
			<a class="profile" href="/{profile.username}">
				<div class="important">
					<Avatar user={profile} size="48px" />

					<div class="text">
						<h3>{profile.displayName || profile.username}</h3>
						@{profile.username}
					</div>
				</div>
				<div class="less-important">
					<p class="line">
						{#if profile.status === 'online' && userAlive}
							<Circle color="var(--color-success)" />
							Currently <span class="darken"> online </span>
						{:else if profile.status === 'dnd' && userAlive}
							<Prohibit color="var(--color-urgent)" />
							Currently <span class="darken"> busy </span>
						{:else}
							<CircleDashed />
							Last seen
							<!-- if the last heartbeat was less than a day ago, use relative time -->
							{#if profile.lastHeartbeat.getTime() > Date.now() - 24 * 60 * 60 * 1000}
								<span class="darken">
									{formatRelativeTime(profile.lastHeartbeat, 'en-US')}
								</span>
							{:else}
								on
								<span class="darken">
									{formatDate(profile.lastHeartbeat, 'en-US')}
								</span>
							{/if}
						{/if}
					</p>
					<p class="line">
						<Cake />
						<span class="darken">
							{formatDate(profile.createdAt, 'en-US')}
						</span>
					</p>
				</div>
			</a>
		</li>
	</ThemeProvider>
{/snippet}

<main>
	<div class="header">
		<h1>Browse all profiles</h1>

		<p>
			{data.count} profiles total
		</p>
	</div>

	<label for="use-plain-theme">
		<input id="use-plain-theme" type="checkbox" bind:checked={usePlainTheme} />
		Override profile themes with the default theme
	</label>

	<ul id="profiles">
		{#each data.firstProfiles as profile}
			{@render renderProfile(profile)}
		{/each}
		{#await data.awaitedProfiles}
			Loading more profiles...
		{:then profiles}
			{#each profiles as profile}
				{@render renderProfile(profile)}
			{/each}
		{/await}
	</ul>
</main>

<style lang="scss">
	main {
		padding: var(--base-padding);
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
		align-items: center;

		h1 {
			font-size: 3rem;
		}
	}

	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		input {
			width: 1.5rem;
			height: 1.5rem;
		}
	}

	#profiles {
		// display: flex;
		// flex-direction: column;
		display: grid;
		// repeat with each element being minimum 320px, but fill the width
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: calc(var(--base-gap) * 0.5);
		list-style: none;
		--plain-theme-padding: var(--base-padding);
		--plain-theme-gap: var(--base-gap);
		max-width: 800px;
		width: 100%;

		li {
			display: block;
			padding: calc(var(--plain-theme-padding) * 0.5);
			background: var(--background);
			border-radius: calc(var(--widgets-border-base-radius) + var(--plain-theme-padding) * 0.5);

			.profile {
				display: flex;
				flex-direction: column;
				text-decoration: none;
				gap: var(--plain-theme-gap);

				background: var(--widgets-background-color);
				border-radius: var(--widgets-border-base-radius);
				padding: var(--plain-theme-padding);
				box-shadow: var(--widgets-box-shadow-x) var(--widgets-box-shadow-y)
					var(--widgets-box-shadow-blur) var(--widgets-box-shadow-spread)
					var(--widgets-box-shadow-color);

				.important {
					display: flex;
					gap: var(--plain-theme-gap);
					align-items: center;
				}

				.less-important {
					display: flex;
					flex-direction: column;
					gap: calc(var(--plain-theme-gap) * 0.5);

					.line {
						display: flex;
						gap: calc(var(--plain-theme-gap) * 0.25);
					}
				}
			}
		}
	}
</style>
