<script lang="ts">
	import type { PublicUser } from '$lib/db/schema/users';
	import { Island } from 'phosphor-svelte';

	let {
		user,
		size
	}: {
		user?: Partial<PublicUser>;
		size?: string;
	} = $props();
</script>

{#if user?.avatar}
	<img style:--size={size} class="avatar" src={user.avatar} alt="@{user.username}'s avatar" />
{:else}
	<div style:--size={size} class="avatar fallback">
		<Island />
	</div>
{/if}

<style lang="scss">
	.avatar {
		width: var(--size, var(--avatar-size));
		height: var(--size, var(--avatar-size));
		border-radius: var(--avatar-border-radius);
		flex-shrink: 0;

		&.fallback {
			display: grid;
			place-items: center;
			background-color: var(--widgets-background-color-dim);
			color: var(--color-heading);
			border: var(--inputs-border-width) solid var(--widgets-border-color);

			:global(svg) {
				width: 50%;
				height: 50%;
			}
		}
	}
</style>
