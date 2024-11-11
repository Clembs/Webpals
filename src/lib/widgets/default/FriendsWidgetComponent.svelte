<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import Card from '$lib/components/Card.svelte';
	import { RelationshipTypes, type PublicUser, type Relationship } from '$lib/db/schema/users';

	let {
		user
	}: {
		user: PublicUser & {
			initiatedRelationships: Relationship[];
		};
	} = $props();

	let friends = $derived(
		user.initiatedRelationships
			.filter((r) => r.status === RelationshipTypes.Friend)
			.map((r) => r.recipient)
	);
</script>

<Card>
	<h2>Friends ({friends.length})</h2>

	<div class="friends">
		{#each friends as friend}
			<a href="/{friend.username}" class="friend">
				<Avatar user={friend} size="48px" />

				<div class="text">
					<div class="display-name heading">
						{friend.displayName || friend.username}
					</div>
					<div class="username subtext">
						@{friend.username}
					</div>
				</div>
			</a>
		{/each}
	</div>
</Card>

<style lang="scss">
	.friends {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: var(--base-gap);
		background-color: var(--widgets-background-color-dim);
		border-radius: calc(var(--widgets-border-base-radius) * 0.5);

		.friend {
			display: flex;
			padding: calc(var(--base-padding) * 0.75);
			gap: calc(var(--base-gap) * 0.5);
			text-decoration: none;
			align-items: center;

			.text {
				display: flex;
				flex-direction: column;
				// gap: calc(var(--base-gap) * 0.25);
			}
		}
	}
</style>
