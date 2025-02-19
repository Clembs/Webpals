<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/types';
	import { Check, X } from 'phosphor-svelte';

	let {
		notification
	}: {
		notification: Notification;
	} = $props();

	let acceptIsLoading = $state(false);
	let declineIsLoading = $state(false);

	let recipient = $derived(notification.mentionedProfiles[0].profile!);
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
		use:enhance={() => {
			acceptIsLoading = true;
			return ({ update }) => {
				acceptIsLoading = false;
				update();
			};
		}}
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
			disabled={acceptIsLoading}
		>
			<Check weight="regular" />
		</Button>
	</form>
	<form
		use:enhance={() => {
			declineIsLoading = true;
			return ({ update }) => {
				declineIsLoading = false;
				update();
			};
		}}
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
			disabled={declineIsLoading}
		>
			<X weight="regular" />
		</Button>
	</form>
</div>
