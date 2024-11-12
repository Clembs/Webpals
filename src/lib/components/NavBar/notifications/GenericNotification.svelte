<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { Notification } from '$lib/db/schema/notifications';
	import { Check } from 'phosphor-svelte';

	let {
		notification
	}: {
		notification: Notification;
	} = $props();
</script>

<div class="left">If you see this, you may be me. Huh?</div>

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
