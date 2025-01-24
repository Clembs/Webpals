<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { type PublicUser } from '$lib/db/schema/types';
	import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';
	import { formatDate, formatRelativeTime } from '$lib/helpers/text';
	import { snowflakeToDate } from '$lib/helpers/users';
	import { mergeThemes, plainTheme } from '$lib/themes/mergeThemes';

	import ThemeProvider from '$lib/themes/ThemeProvider.svelte';
	import { Cake, Circle, CircleDashed, Prohibit } from 'phosphor-svelte';

	let { data } = $props();

	let usePlainTheme = $state(false);
</script>

{#snippet renderUser(user: PublicUser)}
	<ThemeProvider theme={usePlainTheme ? plainTheme : mergeThemes(plainTheme, user.theme || {})}>
		{@const userAlive =
			user.status !== 'offline' &&
			user.lastHeartbeat.getTime() > Date.now() - HEARTBEAT_INTERVAL + 1000}
		<li>
			<a class="profile" href="/{user.username}">
				<div class="important">
					<Avatar {user} size="48px" />

					<div class="text">
						<h3>{user.displayName || user.username}</h3>
						@{user.username}
					</div>
				</div>
				<div class="less-important">
					<p class="line">
						{#if user.status === 'online' && userAlive}
							<Circle color="var(--color-success)" />
							Currently <span class="darken"> online </span>
						{:else if user.status === 'dnd' && userAlive}
							<Prohibit color="var(--color-urgent)" />
							Currently <span class="darken"> busy </span>
						{:else}
							<CircleDashed />
							Last seen
							<!-- if the last heartbeat was less than a day ago, use relative time -->
							{#if user.lastHeartbeat.getTime() > Date.now() - 24 * 60 * 60 * 1000}
								<span class="darken">
									{formatRelativeTime(user.lastHeartbeat, 'en-US')}
								</span>
							{:else}
								on
								<span class="darken">
									{formatDate(user.lastHeartbeat, 'en-US')}
								</span>
							{/if}
						{/if}
					</p>
					<p class="line">
						<Cake />
						<span class="darken">
							{formatDate(snowflakeToDate(user.id), 'en-US')}
						</span>
					</p>
				</div>
			</a>
		</li>
	</ThemeProvider>
{/snippet}

<main>
	<div class="header">
		<h1>Browse all users</h1>

		<p>
			{data.count} users total
		</p>
	</div>

	<label for="use-plain-theme">
		<input id="use-plain-theme" type="checkbox" bind:checked={usePlainTheme} />
		Override profile themes with the default theme
	</label>

	<ul id="profiles">
		{#each data.firstUsers as user}
			{@render renderUser(user)}
		{/each}
		{#await data.awaitedUsers}
			Loading more users...
		{:then users}
			{#each users as user}
				{@render renderUser(user)}
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
