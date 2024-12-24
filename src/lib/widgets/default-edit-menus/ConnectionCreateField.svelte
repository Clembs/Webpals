<script lang="ts">
	import { Island, Plus, QuestionMark, TextAlignLeft, X } from 'phosphor-svelte';
	import { connectionProvidersArray } from '../connections';
	import Button from '$lib/components/Button.svelte';
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Spinner from '$icons/Spinner.svelte';

	let identifiable = $state('');
	let provider = $state('');
	let predictedProvider = $state<(typeof connectionProvidersArray)[number] | undefined | 'text'>();

	let providerInputEl = $state<HTMLInputElement>();
	let identifiableInputEl = $state<HTMLInputElement>();
	let combinedInputEl = $state<HTMLInputElement>();

	let showExpandedInputs = $state(false);

	let loading = $state(false);
	let error = $state();

	let showExpandedProvidersList = $state(false);

	function resetInputs() {
		predictedProvider = undefined;
		showExpandedInputs = false;
		requestAnimationFrame(() => combinedInputEl?.focus());
	}

	function oncombinedinput() {
		error = '';

		const matchingProvider = connectionProvidersArray
			.filter(({ matchingPattern }) => matchingPattern && matchingPattern.test(identifiable))
			// sort domain matching last
			.sort((a, b) => (a.id === 'domain' ? 1 : 0) - (b.id === 'domain' ? 1 : 0))?.[0];

		// if the user is typing something matching the pattern of a provider, show the identifiable input
		if (matchingProvider) {
			predictedProvider = matchingProvider;
			provider = matchingProvider.name;
			// if the user is not typing a URL
		} else {
			showExpandedInputs = true;
			predictedProvider = 'text';
			provider = '';
			requestAnimationFrame(() => identifiableInputEl?.focus());
		}
	}

	function onproviderinput() {
		error = '';

		const strictMatchingProvider = connectionProvidersArray.find(
			({ matchingPattern, id, name }) =>
				!matchingPattern &&
				(id.toLowerCase() === provider.toLowerCase() ||
					name.toLowerCase() === provider.toLowerCase())
		);

		// if there's a strict match, show the identifiable input
		if (strictMatchingProvider) {
			predictedProvider = strictMatchingProvider;
			provider = strictMatchingProvider.name;
		} else if (!provider.length && !identifiable.length) {
			// collapse inputs if both are empty
			resetInputs();
		} else {
			predictedProvider = 'text';
		}
	}

	function onidentifiableinput() {
		error = '';

		const matchingProvider = connectionProvidersArray.find(
			({ matchingPattern, name }) =>
				matchingPattern?.test(identifiable) ||
				(!matchingPattern && identifiable.toLowerCase().includes(name.toLowerCase()))
		);
		const strictMatchingProvider = connectionProvidersArray.find(
			({ matchingPattern, id }) =>
				!matchingPattern && id.toLowerCase() === identifiable.toLowerCase()
		);

		if (!provider.length && strictMatchingProvider) {
			showExpandedInputs = true;
			predictedProvider = strictMatchingProvider;
			provider = strictMatchingProvider.name;
			identifiable = '';
		} else if (matchingProvider) {
			showExpandedInputs = false;
			predictedProvider = matchingProvider;
			provider = matchingProvider.name;
			requestAnimationFrame(() => combinedInputEl?.focus());
		} else if (!identifiable.length && !provider.length) {
			// collapse inputs if both are empty
			resetInputs();
		}
	}
</script>

<form
	use:enhance={() => {
		loading = true;
		return async ({ result, update }) => {
			loading = false;
			if (result.type === 'error') {
				error = result.error;
			} else if (result.type === 'failure' && result.data && 'message' in result.data) {
				error = result.data.message;
			} else if (result.type === 'success') {
				provider = '';
				identifiable = '';
				resetInputs();
				await update({ reset: true });
			}
		};
	}}
	method="post"
	action="/api/profile?/createConnection"
>
	<label for="connection-identifiable">
		{#if !identifiable && !provider}
			<Island />
		{:else if predictedProvider}
			{#if predictedProvider === 'text'}
				<TextAlignLeft />
			{:else}
				<!-- svelte-ignore svelte_component_deprecated -->
				<svelte:component this={predictedProvider.icon} {...predictedProvider.iconProps} />
			{/if}
		{:else}
			<QuestionMark weight="regular" />
		{/if}
	</label>

	<div class="inputs">
		{#if showExpandedInputs}
			<!-- add delay to allow for smooth uninterrupted URL typing -->
			<div in:slide={{ delay: 1250, duration: 200, axis: 'y' }}>
				<input
					oninput={onproviderinput}
					type="text"
					name="connection-provider"
					id="connection-provider"
					bind:value={provider}
					placeholder="Service (e.g. Discord, Nintendo Network...)"
					bind:this={providerInputEl}
					required
				/>
			</div>
			<input
				oninput={onidentifiableinput}
				type="text"
				name="connection-identifiable"
				id="connection-identifiable"
				bind:value={identifiable}
				placeholder={typeof predictedProvider === 'string'
					? 'Enter your @handle, friend code, profile ID...'
					: predictedProvider?.identifiableHint || 'Enter your @handle, friend code, profile ID...'}
				bind:this={identifiableInputEl}
			/>
		{:else}
			<input
				type="hidden"
				name="connection-provider"
				id="connection-provider"
				bind:value={provider}
			/>
			<input
				oninput={oncombinedinput}
				type="text"
				name="connection-identifiable"
				id="connection-identifiable"
				bind:value={identifiable}
				placeholder="Enter a social media link, username, email, friend code..."
				bind:this={combinedInputEl}
				required
			/>
		{/if}

		{#if !identifiable && !provider}
			<button
				onclick={() => (showExpandedProvidersList = !showExpandedProvidersList)}
				class="subtext hint"
				class:expanded={showExpandedProvidersList}
				type="button"
			>
				{#if !showExpandedProvidersList}
					Supports
					{#each connectionProvidersArray
						.toSorted(() => Math.random() - 0.5)
						.slice(0, 6) as { icon, iconProps }}
						<!-- svelte-ignore svelte_component_deprecated -->
						<svelte:component this={icon} {...iconProps} size={16} />
					{/each} and more! (click to expand)
				{:else}
					<ul class="subtext providers-list">
						Supports
						{#each connectionProvidersArray as { icon, iconProps, name }, i}
							<li>
								{#if i === connectionProvidersArray.length - 1}
									and
								{/if}
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component this={icon} {...iconProps} size={16} />
								{name}{#if i < connectionProvidersArray.length - 2},{/if}
								{' '}
							</li>
						{/each}
						(click to minimize)
					</ul>
				{/if}
			</button>
		{/if}

		{#if error}
			<div class="error">
				{error}
			</div>
		{/if}
	</div>

	<Button
		aria-label="Clear fields"
		type="button"
		variant="secondary"
		icon
		size="small"
		inline
		onclick={() => {
			provider = '';
			identifiable = '';
			showExpandedInputs = false;
			predictedProvider = undefined;
			requestAnimationFrame(() => combinedInputEl?.focus());
		}}
		disabled={identifiable.length < 1 || loading}
	>
		<X weight="regular" />
	</Button>
	<Button
		aria-label="Add connection"
		type="submit"
		icon
		size="small"
		inline
		disabled={identifiable.length < 1 || loading}
	>
		{#if !loading}
			<Plus weight="regular" />
		{:else}
			<Spinner />
		{/if}
	</Button>
</form>

<style lang="scss">
	form {
		display: flex;
		gap: calc(var(--base-gap) * 0.75);
		align-items: center;
		padding: calc(var(--base-padding) * 0.75);
		min-height: calc(var(--base-padding) * 5);

		&:has(.hint) {
			padding-bottom: 0;
		}
	}

	label {
		flex-shrink: 0;
		color: var(--color-paragraph);
	}

	.inputs {
		display: flex;
		flex-direction: column;
		width: 100%;

		input {
			width: 100%;
			font-size: 15px;
			background-color: transparent;
			border: none;
			border-bottom: 1px solid transparent;

			&:not(:placeholder-shown) {
				border-bottom: 1px solid var(--widgets-border-color);
			}

			&[name='connection-provider'] {
				font-weight: 500;
				margin-bottom: calc(var(--base-gap) * 0.25);
			}

			&:focus {
				outline: none;
				border-bottom: 1px solid var(--buttons-primary-background-color);
			}
		}
	}

	.hint {
		display: flex;
		gap: calc(var(--base-gap) * 0.25);
		font-size: 12px;
		margin: calc(var(--base-gap) * 0.5) 0;
		background-color: transparent;
		border: none;
		cursor: zoom-in;

		&.expanded {
			cursor: zoom-out;
		}
	}

	.providers-list {
		display: inline-flex;
		flex-wrap: wrap;
		list-style: none;
		font-size: 12px;
		column-gap: calc(var(--base-gap) * 0.25);
		row-gap: calc(var(--base-gap) * 0.25);

		li {
			display: flex;
			gap: calc(var(--base-gap) * 0.125);
		}
	}
</style>
