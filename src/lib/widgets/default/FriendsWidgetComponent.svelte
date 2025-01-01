<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import { RelationshipTypes, type PublicUser, type Relationship } from '$lib/db/schema/users';
	import BaseWidget from '../BaseWidget.svelte';
	import type { FriendsWidget, WidgetComponentProps } from '../types';

	let {
		user,
		widget,
		editing
	}: WidgetComponentProps<FriendsWidget> & {
		user: PublicUser & {
			initiatedRelationships: (Relationship & {
				recipient: PublicUser;
			})[];
		};
	} = $props();

	let friends = $derived(
		user.initiatedRelationships
			.filter((r) => r.status === RelationshipTypes.Friend)
			.map((r) => r.recipient)
	);
</script>

<BaseWidget {user} {widget} editingMode={editing}>
	<h2>Friends ({friends.length})</h2>

	<div class="friends-wrapper">
		<ul class="friends">
			{#each friends.slice(0, 6) as friend}
				<li class="friend">
					<a class="friend-el" href="/{friend.username}">
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
				</li>
			{/each}
		</ul>
		<!-- TODO: make clickable -->
		{#if friends.length > 6}
			<li class="all-friends">
				<div class="friend-el" aria-disabled={true}>
					<div class="display-name heading">All friends</div>
				</div>
			</li>
		{/if}
	</div>
</BaseWidget>

<style lang="scss">
	.friends-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--inputs-border-width);
		background-color: var(--widgets-border-color);
		border-radius: calc(var(--widgets-border-base-radius) * 0.5);
		overflow: hidden;

		.all-friends {
			// TODO: make clickable
			.friend-el {
				cursor: not-allowed;
				opacity: 0.75;
				padding: var(--base-padding);
			}
		}
	}

	.friends {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

		gap: var(--inputs-border-width);
		list-style: none;
	}

	.friend-el {
		background-color: var(--widgets-background-color-dim);
		display: flex;
		align-items: center;
		padding: calc(var(--base-padding) * 0.5) calc(var(--base-padding) * 0.75);
		gap: calc(var(--base-gap) * 0.5);
		text-decoration: none;
		align-items: center;
		height: 100%;

		&:hover {
			filter: brightness(0.95);
		}

		.text {
			display: flex;
			flex-direction: column;
			gap: calc(var(--base-gap) * 0.125);
		}
	}
</style>
