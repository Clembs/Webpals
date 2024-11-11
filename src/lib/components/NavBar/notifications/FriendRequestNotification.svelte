<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/schema/notifications';
	import { Check, X } from 'phosphor-svelte';

	let {
		notification
	}: {
		notification: Notification;
	} = $props();

	let recipient = $derived(notification.mentionedUsers[0].user!);
</script>

<div class="left">
	<a href="/{recipient.username}">
		<Avatar user={recipient} size="48px" />
	</a>

	<div class="text">
		<a href="/{recipient.username}">
			@{recipient.username}
		</a>
		<span class="subtext">wants to be friends with you!</span>
	</div>
</div>

<div class="right">
	<form
		use:enhance
		action="/api/relationships?/acceptFriendRequest&id={recipient.id}"
		method="post"
	>
		<Button
			size="small"
			inline
			icon
			variant="success"
			aria-label="Accept friend request"
			title="Accept friend request"
		>
			<Check weight="regular" />
		</Button>
	</form>
	<form
		use:enhance
		action="/api/notifications?/deleteNotification&id={notification.id}"
		method="post"
	>
		<Button
			size="small"
			inline
			icon
			variant="urgent"
			aria-label="Decline friend request"
			title="Decline friend request"
			type="submit"
		>
			<X weight="regular" />
		</Button>
	</form>
</div>
