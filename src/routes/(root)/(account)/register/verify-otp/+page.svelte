<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let { data: initialData, form } = $props();

	// do that so you can bind the value to the input
	let data = $state(initialData);

	let isLoading = $state(false);
</script>

<div class="header">
	<div class="eyebrow">Create an account - Step 3/3</div>
	<h1>Verify your email address</h1>

	<p>
		The verification code has been sent to your inbox. Type it below to verify your email address.
	</p>
</div>

<form
	use:enhance={() => {
		isLoading = true;
		return ({ update }) => {
			update({ reset: false });
			isLoading = false;
		};
	}}
	action="?/verifyOTP"
	method="post"
>
	<TextInput
		name="otp"
		inputmode="numeric"
		autocomplete="one-time-code"
		pattern={`\\d\{6\}`}
		minlength={6}
		maxlength={6}
		label="Verfiication code"
		tabindex={1}
		autofocus
		error={form?.message}
	/>

	<div class="buttons">
		<Button
			type="button"
			variant="secondary"
			href="/register/email-input?username={data.username}&email={data.email}"
			tabindex={3}
		>
			Back
		</Button>

		<Button type="submit" tabindex={2} disabled={isLoading}>
			{isLoading ? 'Loading...' : 'Verify email address'}
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
