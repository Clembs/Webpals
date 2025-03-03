<script lang="ts">
	import { PUBLIC_STORAGE_BASE_URL } from '$env/static/public';
	import Webpals from '$icons/Webpals.svelte';
	import type { Profile } from '$lib/db/types';

	let {
		user,
		src,
		size
	}: {
		user: Partial<Profile>;
		src?: string;
		size?: string;
	} = $props();
</script>

{#if user.avatar || src}
	<img
		height={size}
		width={size}
		loading="lazy"
		style:--size={size}
		class="avatar"
		src={src ?? `${PUBLIC_STORAGE_BASE_URL}/avatars/${user.id}/${user.avatar}.webp`}
		alt="@{user.username}'s avatar"
	/>
{:else}
	<div style:--size={size} class="avatar fallback">
		<Webpals />
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
