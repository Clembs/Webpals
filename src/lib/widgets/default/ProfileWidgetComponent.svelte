<script lang="ts">
	import type { PublicUser } from '$lib/db/schema/users';
	import { formatDate } from '$lib/helpers/text';
	import { snowflakeToDate } from '$lib/helpers/users';
	import { PencilIcon } from 'lucide-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';

	let { user }: { user: PublicUser } = $props();

	let modalOpened = $state(false);
</script>

{#snippet editMenu()}
	<form
		use:enhance={() =>
			({ update }) => {
				update({ reset: false });
				modalOpened = false;
			}}
		enctype="multipart/form-data"
		method="post"
		action="/api/profile?/editProfile"
	>
		<div class="important-stuff">
			<!-- TODO: work this out -->
			<input type="file" id="avatar" name="avatar" accept="image/*" />
			<label for="avatar" aria-label="Edit avatar">
				<span class="hover-text">
					<PencilIcon />
				</span>
				<img src={user.avatar} alt="{user.username}'s avatar" />
			</label>
			<div class="text-bits">
				<InlineTextInput
					type="text"
					id="display-name"
					name="display-name"
					placeholder="Display name"
					value={user.displayName || user.username}
					font-size="1.5rem"
					autofocus
					required
				/>
				<p>
					@{user.username}
					<span class="pro-tip" class:open={modalOpened}>
						(Pro tip: change this in user settings)
					</span>
				</p>
			</div>
		</div>

		<div class="less-important-stuff">
			<p>
				Joined on {formatDate(snowflakeToDate(user.id), 'en-US')}
				&bull;

				<InlineTextInput
					type="text"
					id="pronouns"
					name="pronouns"
					placeholder="Set your pronouns"
					value={user.pronouns || ''}
				/>
			</p>
			{#if user.status === 'online'}
				<p>🟢 Currently online</p>
			{:else if user.status === 'offline'}
				<p>⚫ Last online: {formatDate(user.last_online, 'en-US')}</p>
			{/if}
		</div>

		<Button type="submit">Save</Button>
	</form>
{/snippet}

<BaseWidget bind:modalOpened {editMenu} {user}>
	<div class="important-stuff">
		<img src={user.avatar} alt="{user.username}'s avatar" />
		<div class="text-bits">
			<h1>{user.displayName || user.username}</h1>
			<p>@{user.username}</p>
		</div>
	</div>

	<div class="less-important-stuff">
		<p>
			Joined on {formatDate(snowflakeToDate(user.id), 'en-US')}
			{#if user.pronouns}
				&bull; {user.pronouns}
			{/if}
		</p>
		{#if user.status === 'online'}
			<p>🟢 Currently online</p>
		{:else if user.status === 'offline'}
			<p>⚫ Last online: {formatDate(user.last_online, 'en-US')}</p>
		{/if}
	</div>
</BaseWidget>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 1.5);

		.pro-tip {
			opacity: 0;
			transition: opacity 200ms;

			&.open {
				opacity: 1;
			}
		}

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

	.important-stuff {
		display: flex;
		gap: var(--base-gap);
		align-items: center;

		img {
			width: var(--avatar-size);
			height: var(--avatar-size);
			border-radius: var(--avatar-border-radius);
		}

		.text-bits {
			display: flex;
			flex-direction: column;
			gap: calc(var(--base-gap) / 4);

			h1 {
				font-size: 1.5rem;
			}
		}
	}

	.less-important-stuff {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) / 2);
	}
</style>
