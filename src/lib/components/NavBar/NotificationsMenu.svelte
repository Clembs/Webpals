<script lang="ts">
	import { NotificationTypes } from '$lib/db/schema/notifications';
	import type { FullUser } from '$lib/db/schema/users';
	import { Check, X } from 'phosphor-svelte';
	import Avatar from '../Avatar.svelte';
	import Button from '../Button.svelte';

	let {
		user
	}: {
		user: FullUser;
	} = $props();
</script>

<div class="notifications-menu">
	<div class="header">
		<h2>Notifications ({user.notifications.length})</h2>

		<Button size="small" inline variant="secondary">Clear all</Button>
	</div>

	<ul class="notification-list">
		{#each user.notifications as notification}
			<li class="notification">
				{#if notification.type === NotificationTypes.FriendRequest && notification.mentionedUsers}
					{@const user = notification.mentionedUsers[0].user!}
					<div class="left">
						<Avatar {user} size="48px" />

						<div class="text">
							@{user.username} <span class="subtext">wants to be friends with you!</span>
						</div>
					</div>

					<div class="right">
						<Button
							size="small"
							inline
							icon
							variant="primary"
							aria-label="Accept friend request"
							title="Accept friend request"
						>
							<Check weight="regular" />
						</Button>
						<Button
							size="small"
							inline
							icon
							variant="secondary"
							aria-label="Decline friend request"
							title="Decline friend request"
						>
							<X weight="regular" />
						</Button>
					</div>
				{/if}
				<!-- TODO: implement other kinds of notification types -->
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	@use '../../../styles/mixins';

	.notifications-menu {
		@include mixins.card;
		width: 500px;
		position: absolute;
		top: 100%;
		right: 0;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.notification-list {
			display: flex;
			flex-direction: column;
			list-style: none;
			background-color: var(--widgets-background-color-dim);
			border-radius: calc(var(--widgets-border-base-radius) * 0.5);

			.notification {
				display: flex;
				align-items: center;
				padding: calc(var(--base-padding) * 0.75);
				gap: var(--base-gap);
				justify-content: space-between;

				.left,
				.right {
					display: flex;
					align-items: center;
					gap: calc(var(--base-gap) * 0.5);
				}
			}
		}
	}
</style>
