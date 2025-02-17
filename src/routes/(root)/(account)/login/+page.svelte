<script lang="ts">
	import { enhance } from '$app/forms';
	// import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { onMount } from 'svelte';
	// import { object, string, array, literal, parse } from 'valibot';

	let { data } = $props();
	let browserSupportsPasskeys = $state(false);

	let isLoading = $state(false);

	onMount(() => {
		browserSupportsPasskeys = !!(navigator.credentials && navigator.credentials.create);
	});
</script>

<main>
	<Card min-width="500px">
		<h1>Create an account or log in</h1>
		<form
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					isLoading = false;

					// if (result.type === 'success' && result.data && result.data.authType === 'webauthn') {
					// 	const resultValidation = object({
					// 		authType: literal('webauthn'),
					// 		options: object({
					// 			challenge: string(),
					// 			timeout: literal(60000),
					// 			rpId: string(),
					// 			allowCredentials: array(
					// 				object({
					// 					id: string(),
					// 					type: literal('public-key')
					// 				})
					// 			),
					// 			userVerification: literal('required')
					// 		})
					// 	});

					// 	const resultData = parse(resultValidation, result.data);

					// 	const { startAuthentication } = await import('@simplewebauthn/browser');

					// 	const credential = await startAuthentication(resultData.options);

					// 	const formData = new FormData();
					// 	formData.append('login', data.login!);
					// 	formData.append('credential', JSON.stringify(credential));

					// 	const req = await fetch('/login?/verifyPasskeyChallenge', {
					// 		method: 'POST',
					// 		body: formData
					// 	});

					// 	if (req.ok) {
					// 		const verificationJson = await req.json();

					// 		if (verificationJson.type === 'success') {
					// 			await goto(`/${verificationJson.data.username}`, {
					// 				invalidateAll: true
					// 			});
					// 		}
					// 	}
					// } else {
					await update({
						invalidateAll: false
					});
					// }
				};
			}}
			action="?/handleAuthFlow"
			method="post"
		>
			<TextInput
				autocomplete="email webauthn"
				label="Email or username"
				name="login"
				type="text"
				autofocus
				bind:value={data.login}
			/>

			<Button disabled={isLoading} type="submit">
				{isLoading ? 'Loading...' : 'Continue'}
			</Button>
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
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
