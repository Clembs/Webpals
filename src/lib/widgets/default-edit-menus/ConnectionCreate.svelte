<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { dialogPortal } from '$lib/portals/dialog.svelte';
	import { Funnel, Plus } from 'phosphor-svelte';
	import { connectionProvidersArray } from '../connections';
	import TextInput from '$lib/components/TextInput.svelte';
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import { enhance } from '$app/forms';
	import Spinner from '$icons/Spinner.svelte';

	let filter = $state('');
	let selectedProvider = $state<(typeof connectionProvidersArray)[number]>();

	let stepsWrapperEl = $state<HTMLElement>();
	let stepProviderEl = $state<HTMLElement>();
	let stepInfoEl = $state<HTMLElement>();
	let fieldEl = $state<HTMLInputElement | HTMLTextAreaElement>();

	let isCreating = $state(false);
	let error = $state('');

	const stepWidth = 500;

	function nextStep() {
		if (!stepsWrapperEl || !stepInfoEl || !stepProviderEl) return;

		error = '';

		stepsWrapperEl.scroll({
			left: stepWidth,
			behavior: 'smooth'
		});

		const stepsWrapperRect = stepsWrapperEl.getBoundingClientRect();
		stepsWrapperEl.style.height = `${stepsWrapperRect.height}px`;

		resizeStepsWrapper(stepInfoEl!);

		stepsWrapperEl.addEventListener(
			'transitionend',
			() => {
				stepsWrapperEl!.style.transition = '';
				fieldEl?.focus();
			},
			{ once: true }
		);
	}

	function previousStep() {
		if (!stepsWrapperEl || !stepInfoEl || !stepProviderEl) return;

		stepsWrapperEl.scroll({
			left: 0,
			behavior: 'smooth'
		});

		const stepsWrapperRect = stepsWrapperEl.getBoundingClientRect();
		stepsWrapperEl.style.height = `${stepsWrapperRect.height}px`;

		resizeStepsWrapper(stepProviderEl!);

		stepsWrapperEl.addEventListener(
			'transitionend',
			() => {
				stepsWrapperEl!.style.transition = '';
				stepsWrapperEl!.style.height = '';
			},
			{ once: true }
		);
	}

	function resizeStepsWrapper(el: HTMLElement) {
		if (!stepsWrapperEl) return;

		requestAnimationFrame(() => {
			stepsWrapperEl!.style.transition = 'height 300ms ease';
			stepsWrapperEl!.style.height = `${el.clientHeight}px`;
		});
	}

	$effect(() => {
		if (!dialogPortal.current) {
			selectedProvider = undefined;
		}
	});
</script>

{#snippet providerDialog()}
	<div id="provider-dialog">
		<h2>Add connection</h2>

		<form
			id="steps-wrapper"
			style:--step-width="{stepWidth}px"
			use:enhance={() => {
				isCreating = true;

				return async ({ result, update }) => {
					error = '';
					if (
						result.type === 'failure' &&
						result.data?.message &&
						typeof result.data.message === 'string'
					) {
						error = result.data.message;
						resizeStepsWrapper(stepInfoEl!);
					}

					if (result.type === 'success') {
						dialogPortal.closeDialog();
					}

					await update({
						invalidateAll: true,
						reset: false
					});
					isCreating = false;
				};
			}}
			action="/api/profile?/createConnection"
			method="post"
			bind:this={stepsWrapperEl}
		>
			<div class="step-provider" inert={!!selectedProvider} bind:this={stepProviderEl}>
				{#snippet filterIcon(size: number)}
					<Funnel {size} />
				{/snippet}

				<TextInput
					placeholder="Filter connections"
					name="filter"
					bind:value={filter}
					prefixIcon={filterIcon}
					required={false}
				/>

				<ul id="provider-list">
					{#each connectionProvidersArray
						.sort((a, b) => a.name.localeCompare(b.name))
						.filter(({ name, id }) => name
									.toLowerCase()
									.includes(filter.toLowerCase()) || id.includes(filter.toLowerCase())) as provider}
						<li>
							<label for="provider-{provider.id}">
								<input
									id="provider-{provider.id}"
									type="radio"
									name="connection-provider"
									value={provider.id}
									hidden
									onchange={() => {
										selectedProvider = provider;
										nextStep();
									}}
								/>
								<provider.icon {...provider.iconProps} />
								<span>{provider.name}</span>
							</label>
						</li>
					{/each}
				</ul>
			</div>

			<div class="step-info" inert={!selectedProvider} bind:this={stepInfoEl}>
				{#if selectedProvider}
					<label for="connection-identifiable" class="connection">
						<selectedProvider.icon {...selectedProvider.iconProps} />
						<div class="text-and-error">
							<div class="text">
								{#if selectedProvider.identifiablePrefix}
									<span class="subtext">
										{selectedProvider.identifiablePrefix}
									</span>
								{/if}

								<InlineTextInput
									bind:ref={fieldEl}
									oninput={() => {
										error = '';
										resizeStepsWrapper(stepInfoEl!);
									}}
									name="connection-identifiable"
									placeholder={selectedProvider.identifiablePlaceholder}
									required
								/>
							</div>
							{#if error}
								<div class="subtext error">{error}</div>
							{/if}
						</div>
					</label>
				{/if}

				<div class="buttons">
					<Button
						onclick={() => {
							selectedProvider = undefined;
							previousStep();
						}}
						type="button"
						variant="secondary"
						disabled={isCreating}
					>
						Back
					</Button>

					<Button type="submit" disabled={isCreating}>
						{#if isCreating}
							<Spinner /> Loading...
						{:else}
							Looks good!
						{/if}
					</Button>
				</div>
			</div>
		</form>
	</div>
{/snippet}

<Button onclick={() => dialogPortal.openDialog(providerDialog)}>
	<Plus weight="regular" /> Add connection
</Button>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#provider-dialog {
		#steps-wrapper {
			display: flex;

			max-width: var(--step-width);
			margin: 0 calc(0px - var(--base-padding));
			overflow: hidden;

			.step-provider,
			.step-info {
				flex-shrink: 0;
				width: var(--step-width);
				max-width: 100%;
				padding: var(--base-padding);
				padding-bottom: 0;
				height: fit-content;
			}

			.step-provider {
				display: flex;
				flex-direction: column;
				gap: var(--base-gap);

				#provider-list {
					@include mixins.fancy-list;
					max-height: 300px;
					overflow-y: auto;

					li {
						label {
							display: flex;
							align-items: center;
							padding: calc(var(--base-padding) * 0.75);
							gap: calc(var(--base-gap) * 0.75);
							cursor: pointer;

							border: none;
							background-color: transparent;
							width: 100%;
						}
					}
				}
			}

			.step-info {
				display: flex;
				flex-direction: column;
				gap: calc(var(--base-gap) * 0.75);

				.connection {
					display: flex;
					padding: var(--base-padding) calc(var(--base-padding) * 0.75);
					gap: calc(var(--base-gap) * 0.75);
					color: var(--color-heading);
					background-color: var(--widgets-background-color-dim);
					border-radius: var(--inputs-border-base-radius);
					width: 100%;
					align-items: center;

					.text-and-error {
						display: flex;
						flex-direction: column;
						width: 100%;
					}

					.text {
						display: flex;

						.subtext {
							display: flex;
							align-items: center;
							gap: calc(var(--base-gap) * 0.25);
							white-space: nowrap;
						}
					}
				}

				.error {
					color: var(--color-urgent);
				}

				.buttons {
					display: flex;
					gap: calc(var(--base-gap) * 0.5);
				}
			}
		}
	}
</style>
