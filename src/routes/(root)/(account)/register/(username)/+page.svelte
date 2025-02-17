<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { USERNAME_REGEX } from '$lib/db/schema/users';
	import { At } from 'phosphor-svelte';

	let { data: initialData, form } = $props();
	let isLoading = $state(false);

	// do that so you can bind the value to the input
	let data = $state(initialData);
</script>

<header>
	<div class="eyebrow">Create an account - Step 1/3</div>

	<h1>Choose a username</h1>

	<p>
		A username helps identify you. It must be between 2 and 32 characters and contain only roman
		letters, numbers, dots and underscores.
	</p>
</header>

<form
	use:enhance={() => {
		isLoading = true;
		return ({ update }) => {
			isLoading = false;
			update({ reset: false });
		};
	}}
	method="post"
	action="?/validateUsername&email={data.email}"
>
	<TextInput
		name="username"
		oninput={() => {
			form = { message: '' };
			replaceState(`?username=${data.username}${data.email ? `&email=${data.email}` : ''}`, {});
		}}
		label="Username"
		placeholder="Clembs"
		minlength={2}
		maxlength={32}
		pattern={USERNAME_REGEX.source}
		tabindex={1}
		autofocus
		bind:value={data.username}
		error={form?.message}
	/>
	{#snippet prefixIcon(size: number)}
		<At {size} weight="regular" />
	{/snippet}

	<div class="buttons">
		<Button variant="secondary" href="/login" tabindex={3}>Back to login</Button>
		<Button disabled={isLoading} type="submit" tabindex={2}>
			{isLoading ? 'Loading...' : 'Continue'}
		</Button>
	</div>
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.5);
	}

	.eyebrow {
		font-size: 0.815rem;
		font-weight: 500;
		color: var(--color-paragraph);
		margin-bottom: calc(var(--base-gap) * 0.5);
	}

	h1 {
		margin-bottom: calc(var(--base-gap) * 0.5);
	}

	.buttons {
		display: flex;
		gap: calc(var(--base-gap) * 0.5);
	}
</style>
