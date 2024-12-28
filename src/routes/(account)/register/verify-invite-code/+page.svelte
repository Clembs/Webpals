<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Numpad } from 'phosphor-svelte';

	let { data: initialData, form } = $props();
	let isLoading = $state(false);

	// do that so you can bind the value to the input
	let data = $state(initialData);
</script>

{#snippet numpadIcon(size: number)}
	<Numpad {size} weight="regular" />
{/snippet}

<div class="header">
	<div class="eyebrow">Create an account - Step 2/3</div>
	<h1>Enter your invite code</h1>

	<p>
		Before Islands releases, an invite code is required to register.<br />
		Please enter the 5 characters-long code you were given.
	</p>
</div>

<form
	use:enhance={() => {
		isLoading = true;

		return ({ update }) => {
			isLoading = false;

			update({
				reset: false
			});
		};
	}}
	action="?/validateInviteCode"
	method="post"
>
	<TextInput
		name="invite-code"
		prefixIcon={numpadIcon}
		label="Invite code"
		inputmode="numeric"
		minlength={5}
		maxlength={5}
		tabindex={1}
		autofocus
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

		<Button disabled={isLoading} type="submit" tabindex={2}>
			{isLoading ? 'Loading...' : 'Verify invite code'}
		</Button>
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
