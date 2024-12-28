<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let { data, form } = $props();
</script>

<main>
	<Card min-width="500px">
		<div class="header">
			<h1>Log in using an email one-time password</h1>

			<p>A 6-digit code has been sent to your inbox. Type it below to log in.</p>
		</div>

		<form
			use:enhance={() =>
				({ update }) => {
					update({ reset: false });
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
				label="One-time password"
				tabindex={1}
				autofocus
				error={form?.message}
			/>

			<div class="buttons">
				<Button type="submit" variant="secondary" href="/login?login={data.login}" tabindex={3}>
					Back
				</Button>

				<Button type="submit" tabindex={2}>Log in</Button>
			</div>
		</form>
	</Card>
</main>

<style lang="scss">
	main {
		display: grid;
		place-items: center;
		height: 100vh;

		h1 {
			font-size: 1.5rem;
			margin-bottom: 0.5rem;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			container-type: inline-size;
		}

		.buttons {
			display: flex;
			gap: 0.5rem;
			width: 100%;
		}
	}

	@container (max-width: 430px) {
		.buttons {
			flex-direction: column-reverse;
		}
	}
</style>
