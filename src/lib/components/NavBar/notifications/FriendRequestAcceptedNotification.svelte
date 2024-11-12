<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/schema/notifications';
	import { Check } from 'phosphor-svelte';

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
		<span class="subtext">has accepted your friend request!</span>
	</div>
</div>

<div class="right">
	<form
		use:enhance
		action="/api/notifications?/deleteNotification&id={notification.id}"
		method="post"
	>
		<Button
			size="small"
			inline
			icon
			variant="secondary"
			aria-label="Dismiss notification"
			title="Dismiss notification"
		>
			<Check weight="regular" />
		</Button>
	</form>
</div>
