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

	let user = $derived(notification.mentionedUsers[0].user!);
</script>

<div class="left">
	<a href="/{user.username}">
		<Avatar {user} size="48px" />
	</a>

	<div class="text">
		<a href="/{user.username}">
			@{user.username}
		</a>
		<span class="subtext">wants to be friends with you!</span>
	</div>
</div>

<div class="right">
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
