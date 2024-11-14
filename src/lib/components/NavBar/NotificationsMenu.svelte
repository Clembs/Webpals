<script lang="ts">
	import { NotificationTypes } from '$lib/db/schema/notifications';
	import type { FullUser } from '$lib/db/schema/users';
	import Button from '../Button.svelte';
	import { fly } from 'svelte/transition';
	import FriendRequestNotification from './notifications/FriendRequestNotification.svelte';
	import FriendRequestAcceptedNotification from './notifications/FriendRequestAcceptedNotification.svelte';
	import GenericNotification from './notifications/GenericNotification.svelte';
	import { enhance } from '$app/forms';

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

<div class="notifications-menu" transition:fly={{ y: -20, duration: 200 }}>
	<div class="header">
		<h2>Notifications ({user.notifications.length})</h2>

		<form use:enhance action="/api/notifications?/deleteAllNotifications" method="post">
			<Button disabled={!user.notifications.length} size="small" inline variant="secondary">
				Clear all
			</Button>
		</form>
	</div>

	{#if user.notifications.length}
		<ul class="notification-list">
			{#each user.notifications as notification}
				<li class="notification">
					{#if notification.type === NotificationTypes.Generic}
						<GenericNotification {notification} />
					{:else if notification.type === NotificationTypes.FriendRequest && notification.mentionedUsers.length}
						<FriendRequestNotification {notification} />
					{:else if notification.type === NotificationTypes.FriendRequestAccepted && notification.mentionedUsers.length}
						<FriendRequestAcceptedNotification {notification} />
					{:else}
						Invalid notification... Report this issue to the developers via Discord, Twitter or
						Bluesky!
					{/if}
					<!-- TODO: implement other kinds of notification types -->
				</li>
			{/each}
		</ul>
	{:else}
		<p>No notifications! Hurray!</p>
	{/if}
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.notifications-menu {
		@include mixins.card;
		width: 500px;
		position: absolute;
		top: 100%;
		right: 0;
		z-index: 99;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.notification-list {
			@include mixins.fancy-list;

			.notification {
				display: flex;
				padding: calc(var(--base-padding) * 0.75);
				justify-content: space-between;

				&:last-child {
					border-bottom: none;
				}

				:global(.left),
				:global(.right) {
					display: flex;
					align-items: center;
					gap: calc(var(--base-gap) * 0.5);

					:global(a) {
						text-decoration: none;

						&:hover {
							text-decoration: underline;
						}
					}
				}
			}
		}
	}
</style>
