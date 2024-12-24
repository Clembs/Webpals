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

	<ul class="friends">
		{#each friends as friend}
			<li class="friend">
				<a href="/{friend.username}">
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
</BaseWidget>

<style lang="scss">
	.friends {
		display: grid;
		// grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: var(--base-gap);
		background-color: var(--widgets-background-color-dim);
		border-radius: calc(var(--widgets-border-base-radius) * 0.5);
		list-style: none;

		.friend a {
			display: flex;
			padding: calc(var(--base-padding) * 0.5) calc(var(--base-padding) * 0.75);
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
