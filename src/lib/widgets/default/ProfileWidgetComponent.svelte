<script lang="ts">
	import type { PublicUser } from '$lib/db/schema/users';
	import { formatDate } from '$lib/helpers/text';
	import { snowflakeToDate } from '$lib/helpers/users';
	import { PencilSimple, Cake, Circle } from 'phosphor-svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';

	let { user, editing }: { user: PublicUser; editing: boolean } = $props();

	let modalOpened = $state(false);
</script>

{#snippet nonInteractive()}
	<div class="less-important-stuff">
		<p class="line">
			<Cake />
			Joined on
			<span class="darken">
				{formatDate(snowflakeToDate(user.id), 'en-US')}
			</span>
		</p>
		<p class="line">
			{#if user.status === 'online'}
				<Circle />
				<span class="darken"> Currently online </span>
			{:else if user.status === 'offline'}
				<Circle />
				Last online on
				<span class="darken">
					{formatDate(user.last_online, 'en-US')}
				</span>
			{/if}
		</p>
	</div>
{/snippet}

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
			<!-- TODO: work avatar upload out -->
			<input type="file" id="avatar" name="avatar" accept="image/*" />
			<label for="avatar" aria-label="Edit avatar">
				<span class="hover-text">
					<PencilSimple />
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
					font-size="1.75rem"
					autofocus
					required
				/>
				<p class="username">
					<a href="/settings">
						@{user.username}
					</a>

					&bull;

					<InlineTextInput
						type="text"
						id="pronouns"
						name="pronouns"
						placeholder="Set your pronouns"
						value={user.pronouns || ''}
						required={false}
					/>
				</p>
			</div>
		</div>

		{@render nonInteractive()}

		<Button type="submit">Save</Button>
	</form>
{/snippet}

<BaseWidget bind:modalOpened {editMenu} {user} {editing}>
	<div class="top-part">
		<div class="important-stuff">
			<img src={user.avatar} alt="{user.username}'s avatar" />
			<div class="text-bits">
				<h1>{user.displayName || user.username}</h1>
				<p class="username">
					@{user.username}

					{#if user.pronouns}
						&bull;
						{user.pronouns}
					{/if}
				</p>
			</div>
		</div>

		<!-- TODO: adding friends, more options menu -->
		<!-- <div class="buttons">
			<Button icon inline variant="secondary">
				<DotsThreeOutline />
			</Button>

			<Button inline>Add friend</Button>
		</div> -->
	</div>

	{@render nonInteractive()}
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

		img {
			width: var(--avatar-size);
			height: var(--avatar-size);
			border-radius: var(--avatar-border-radius);
		}

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
