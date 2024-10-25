<script lang="ts">
	import BaseWidget from '$lib/widgets/BaseWidget.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { User } from '$lib/db/schema/users';
	import type { AboutMeWidget } from '../types';
	import { enhance } from '$app/forms';

	let {
		user,
		widget,
		edit = false
	}: {
		user: Partial<User>;
		widget: AboutMeWidget;
		edit?: boolean;
	} = $props();

	let modalOpened = $state(false);
</script>

{#snippet editMenu()}
	<!--TODO: add form action endpoint  -->
	<form use:enhance class="about-me-edit" action="/api/profile?/editAboutMe" method="post">
		<h2>About me</h2>
		<textarea class:big-text={modalOpened} name="content" value={widget.content}></textarea>
		<Button type="submit">Save</Button>
	</form>
{/snippet}

<BaseWidget bind:modalOpened {editMenu} {edit} {user} {widget}>
	<div class="about-me">
		<h2>About me</h2>
		<p>{widget.content}</p>
	</div>
</BaseWidget>

<style lang="scss">
	.about-me {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
	}
	h2 {
		font-size: 1.25rem;
	}

	.about-me-edit {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		textarea {
			color: var(--color-paragraph);
			border: none;
			outline: none;
			font-size: 0.9rem;
			transition: font-size 200ms;
			resize: vertical;

			&.big-text {
				font-size: 1.1rem;
			}
		}
	}
</style>
