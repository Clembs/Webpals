<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Envelope } from 'phosphor-svelte';

	let { data: initialData, form } = $props();

	// do that so you can bind the value to the input
	let data = $state(initialData);
</script>

{#snippet emailIcon(size: number)}
	<Envelope {size} weight="regular" />
{/snippet}

<div class="header">
	<div class="eyebrow">Create an account - Step 3/3</div>
	<h1>Verify your email address</h1>

	<p>To combat spam and secure your account, your email address needs to be verified.</p>
</div>

<form
	use:enhance={() =>
		({ update }) => {
			update({ reset: false });
		}}
	action="?/validateEmail"
	method="post"
>
	<TextInput
		name="email"
		oninput={() => replaceState(`?username=${data.username}&email=${data.email}`, {})}
		prefixIcon={emailIcon}
		type="email"
		label="Email address"
		placeholder="clembs@clembs.com"
		tabindex={1}
		autofocus
		bind:value={data.email}
		error={form?.message}
	/>

	<div class="buttons">
		<Button
			type="button"
			variant="secondary"
			href="/register?username={data.username}{data.email ? `&email=${data.email}` : ''}"
			tabindex={3}
		>
			Back
		</Button>

		<Button type="submit" tabindex={2}>Send verification code</Button>
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		container-type: inline-size;
	}

	.eyebrow {
		font-size: 0.815rem;
		font-weight: 500;
		color: #656565;
		margin-bottom: 0.5rem;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.buttons {
		display: flex;
		gap: 0.5rem;
		width: 100%;
	}

	@container (max-width: 430px) {
		.buttons {
			flex-direction: column-reverse;
		}
	}
</style>
