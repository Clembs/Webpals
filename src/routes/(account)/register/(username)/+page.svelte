<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { USERNAME_REGEX } from '$lib/helpers/constants';

	let { data: initialData, form } = $props();
	let isLoading = $state(false);

	// do that so you can bind the value to the input
	let data = $state(initialData);
</script>

{#snippet usernameIcon(size: number)}
	<svg
		width={size}
		height={size}
		viewBox="0 0 22 22"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M11 2.0625C8.62963 2.0625 6.35634 3.00413 4.68023 4.68023C3.00413 6.35634 2.0625 8.62963 2.0625 11C2.0625 13.3704 3.00413 15.6437 4.68023 17.3198C6.35634 18.9959 8.62963 19.9375 11 19.9375C12.8485 19.9375 14.7898 19.3806 16.1932 18.4482C16.2684 18.3982 16.3331 18.3339 16.3834 18.2589C16.4338 18.1839 16.4689 18.0998 16.4867 18.0112C16.5045 17.9227 16.5048 17.8315 16.4874 17.7429C16.47 17.6543 16.4353 17.5699 16.3853 17.4947C16.3353 17.4195 16.271 17.3549 16.196 17.3045C16.121 17.2542 16.0369 17.2191 15.9483 17.2012C15.8598 17.1834 15.7686 17.1832 15.68 17.2006C15.5913 17.218 15.507 17.2527 15.4318 17.3027C14.2656 18.0795 12.5649 18.5625 11 18.5625C9.50428 18.5625 8.04215 18.119 6.7985 17.288C5.55485 16.457 4.58555 15.2759 4.01316 13.894C3.44077 12.5122 3.29101 10.9916 3.58281 9.52463C3.87461 8.05765 4.59487 6.71014 5.65251 5.65251C6.71014 4.59487 8.05765 3.87461 9.52463 3.58281C10.9916 3.29101 12.5122 3.44077 13.894 4.01316C15.2759 4.58555 16.457 5.55485 17.288 6.7985C18.119 8.04215 18.5625 9.50428 18.5625 11C18.5625 13.273 17.6275 13.75 16.8438 13.75C16.06 13.75 15.125 13.273 15.125 11V7.5625C15.125 7.38016 15.0526 7.2053 14.9236 7.07636C14.7947 6.94743 14.6198 6.875 14.4375 6.875C14.2552 6.875 14.0803 6.94743 13.9514 7.07636C13.8224 7.2053 13.75 7.38016 13.75 7.5625V7.92859C13.133 7.37544 12.3638 7.02092 11.5424 6.91121C10.7211 6.80151 9.88578 6.94171 9.14527 7.31355C8.40476 7.68539 7.7934 8.27163 7.39084 8.9959C6.98827 9.72017 6.81317 10.5489 6.88834 11.3741C6.96351 12.1993 7.28547 12.9828 7.81226 13.6224C8.33906 14.262 9.04628 14.7281 9.84179 14.96C10.6373 15.192 11.4842 15.1789 12.2722 14.9226C13.0602 14.6663 13.7527 14.1786 14.2596 13.5231C14.7752 14.5544 15.6647 15.125 16.8438 15.125C18.7808 15.125 19.9375 13.5833 19.9375 11C19.935 8.6304 18.9926 6.35856 17.317 4.683C15.6414 3.00743 13.3696 2.065 11 2.0625ZM11 13.75C10.4561 13.75 9.92442 13.5887 9.47218 13.2865C9.01995 12.9844 8.66747 12.5549 8.45933 12.0524C8.25119 11.5499 8.19673 10.9969 8.30284 10.4635C8.40895 9.93005 8.67086 9.44005 9.05546 9.05546C9.44005 8.67086 9.93005 8.40895 10.4635 8.30284C10.9969 8.19673 11.5499 8.25119 12.0524 8.45933C12.5549 8.66747 12.9844 9.01995 13.2865 9.47218C13.5887 9.92442 13.75 10.4561 13.75 11C13.75 11.7293 13.4603 12.4288 12.9445 12.9445C12.4288 13.4603 11.7293 13.75 11 13.75Z"
			fill="currentColor"
		/>
	</svg>
{/snippet}

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
			replaceState(`?username=${data.username}${data.email && `&email=${data.email}`}`, {});
		}}
		prefixIcon={usernameIcon}
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
