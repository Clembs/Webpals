<script lang="ts">
	import { type Profile } from '$lib/db/types';
	import { formatDate, formatRelativeTime } from '$lib/helpers/text';
	import {
		PencilSimple,
		Cake,
		Circle,
		CircleDashed,
		Prohibit,
		UserPlus,
		DotsThree,
		Clock,
		Users
	} from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';
	import { page } from '$app/state';
	import Avatar from '$lib/components/Avatar.svelte';
	import { scale } from 'svelte/transition';
	import { RelationshipTypes } from '$lib/db/schema/profiles';

	let { profile, editing }: { profile: Profile; editing: boolean } = $props();
	let avatarInputEl = $state<HTMLInputElement>();
	let temporaryAvatarSrc = $state();

	let modalOpened = $state(false);
	let addFriendState = $state<null | 'loading' | 'error'>(null);

	// If the user set their status to something other than offline AND that the last heartbeat was within the IN (plus a second for safety)
	let isAlive = $derived(
		profile.status !== 'offline' &&
			profile.lastHeartbeat.getTime() > Date.now() - HEARTBEAT_INTERVAL + 1000
	);

	let relationship = $derived(
		page.data.currentProfile?.initiatedRelationships.find(
			(relationship) => relationship.recipientId === profile.id
		)?.status
	);
</script>

{#snippet nonInteractive()}
	<div class="less-important-stuff">
		<p class="line">
			{#if profile.status === 'online' && isAlive}
				<Circle color="var(--color-success)" />
				Currently <span class="darken"> online </span>
			{:else if profile.status === 'dnd' && isAlive}
				<Prohibit color="var(--color-urgent)" />
				Currently <span class="darken"> busy </span>
			{:else}
				<CircleDashed />
				Last seen
				<span class="darken">
					<!-- if the last heartbeat was less than a day ago, use relative time -->
					{#if profile.lastHeartbeat.getTime() > Date.now() - 24 * 60 * 60 * 1000}
						{formatRelativeTime(profile.lastHeartbeat, 'en-US')}
					{:else}
						on {formatDate(profile.lastHeartbeat, 'en-US')}
					{/if}
				</span>
			{/if}
		</p>
		<p class="line">
			<Cake />
			Joined on
			<span class="darken">
				{formatDate(profile.createdAt, 'en-US')}
			</span>
		</p>
	</div>
{/snippet}

<BaseWidget bind:isWidgetEditing={modalOpened} {profile} editingMode={editing}>
	{#snippet editMenu()}
		<form
			use:enhance={() =>
				({ update }) => {
					update({ reset: false, invalidateAll: true });
					modalOpened = false;
				}}
			class="update-profile"
			enctype="multipart/form-data"
			method="post"
			action="/api/profile?/editProfile"
		>
			<div class="important-stuff">
				<!-- TODO: work avatar upload out -->
				<input
					bind:this={avatarInputEl}
					type="file"
					id="avatar"
					name="avatar"
					accept="image/*"
					onchange={() => {
						if (avatarInputEl && avatarInputEl.files?.length) {
							const file = avatarInputEl.files[0];
							const reader = new FileReader();

							reader.onload = () => {
								if (!reader.result) return;
								temporaryAvatarSrc = reader.result.toString();
							};
							reader.readAsDataURL(file);
						}
					}}
				/>
				<label for="avatar" aria-label="Edit avatar">
					<span class="hover-text">
						<PencilSimple />
					</span>
					<Avatar user={profile} src={temporaryAvatarSrc} />
				</label>
				<div class="text-bits">
					<InlineTextInput
						type="text"
						id="display-name"
						name="display-name"
						placeholder="Display name"
						value={profile.displayName || profile.username}
						font-size="1.75rem"
						autofocus
						required
					/>
					<p class="username">
						<a href="/settings">
							@{profile.username}
						</a>

						&bull;

						<InlineTextInput
							type="text"
							id="pronouns"
							name="pronouns"
							placeholder="Set your pronouns"
							value={profile.pronouns || ''}
							required={false}
						/>
					</p>
				</div>
			</div>

			{@render nonInteractive()}

			<Button type="submit">Save</Button>
		</form>
	{/snippet}

	<div class="top-part">
		<div class="important-stuff">
			<Avatar user={profile} />
			<div class="text-bits">
				<h1>{profile.displayName || profile.username}</h1>
				<p class="username">
					@{profile.username}

					{#if profile.pronouns}
						&bull;
						{profile.pronouns}
					{/if}
				</p>
			</div>
		</div>
	</div>

	{@render nonInteractive()}

	{#if page.data.currentProfile}
		<div class="buttons-wrapper">
			<div class="buttons">
				<!-- TODO: adding friends, more options menu -->
				<Button inline icon variant="secondary">
					<DotsThree weight="regular" />
				</Button>
				{#if relationship === RelationshipTypes.FriendPending}
					<!-- TODO: remove request -->
					<Button variant="secondary" disabled>
						<Clock />
						Requested
					</Button>
				{:else if relationship === RelationshipTypes.Friend}
					<!-- TODO: unfriend -->
					<Button variant="secondary">
						<Users />
						Friends
					</Button>
				{:else if relationship === RelationshipTypes.Blocked}
					<!-- TODO: unblock -->
					<Button variant="secondary">
						<Prohibit />
						Blocked
					</Button>
				{:else}
					<form
						use:enhance={() => {
							addFriendState = 'loading';
							return async ({ result, update }) => {
								await update();
								if (result.type === 'error' || result.type === 'failure') {
									addFriendState = 'error';
								}
								addFriendState = null;
							};
						}}
						style="display: contents;"
						action="/api/relationships?/sendFriendRequest&id={profile.id}"
						method="post"
					>
						<Button
							type="submit"
							disabled={page.data.currentProfile.id === profile.id || addFriendState !== null}
						>
							<UserPlus />
							Add friend
						</Button>
					</form>
				{/if}
			</div>
			{#if page.form?.message}
				<div transition:scale class="error">
					{page.form.message}
				</div>
			{/if}
		</div>
	{/if}
</BaseWidget>

<style lang="scss">
	.update-profile {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		input#avatar {
			position: fixed;
			width: 1px;
			height: 1px;
			top: -10px;
			left: -10px;

			&:active + label .hover-text,
			&:focus-visible + label .hover-text {
				display: grid;
				place-items: center;
			}
		}

		label[for='avatar'] {
			cursor: pointer;
			border-radius: var(--avatar-border-radius);
			position: relative;
			flex-shrink: 0;

			&:hover .hover-text,
			&:active .hover-text,
			&:focus-visible .hover-text {
				display: grid;
				place-items: center;
			}

			.hover-text {
				display: none;
				position: absolute;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.6);
				color: white;
				border-radius: var(--avatar-border-radius);
			}
		}
	}

	.top-part {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.buttons {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
	}

	.important-stuff {
		display: flex;
		gap: var(--base-gap);
		align-items: center;

		.text-bits {
			display: flex;
			flex-direction: column;

			h1 {
				font-size: 1.75rem;
			}

			.username {
				font-size: 1rem;
			}
		}
	}

	.less-important-stuff {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) / 2);

		.line {
			display: flex;
			gap: calc(var(--base-gap) / 4);
			align-items: center;
		}
	}
</style>
