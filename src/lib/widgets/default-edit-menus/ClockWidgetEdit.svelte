<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Spinner from '$icons/Spinner.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { enhance } from '$app/forms';
	import { type CityData } from 'city-timezones';
	import type { ClockWidget, WidgetComponentProps } from '../types';
	import { ArrowLeft, CaretLeft, CaretRight, Globe, MagnifyingGlass } from 'phosphor-svelte';

	let {
		widget,
		modalOpened = $bindable(false)
	}: WidgetComponentProps<ClockWidget> & {
		modalOpened: boolean;
	} = $props();

	let date = $state(new Date());
	let cities = $state<CityData[]>([]);
	let error = $state('');
	let isLoading = $state(false);

	let stepsWrapperEl = $state<HTMLElement>();
	let stepOptionsEl = $state<HTMLElement>();
	let stepTimezoneEl = $state<HTMLElement>();
	let timezoneFieldEl = $state<HTMLInputElement | HTMLTextAreaElement>();
	let optionsFormEl = $state<HTMLFormElement>();

	const stepWidth = 700;

	function nextStep() {
		if (!stepsWrapperEl || !stepOptionsEl || !stepTimezoneEl) return;

		error = '';

		stepsWrapperEl.scroll({
			left: stepWidth,
			behavior: 'smooth'
		});

		const stepsWrapperRect = stepsWrapperEl.getBoundingClientRect();
		stepsWrapperEl.style.height = `${stepsWrapperRect.height}px`;

		resizeStepsWrapper(stepTimezoneEl!);

		stepsWrapperEl.addEventListener(
			'transitionend',
			() => {
				stepsWrapperEl!.style.transition = '';
				timezoneFieldEl?.focus();
			},
			{ once: true }
		);
	}

	function previousStep() {
		if (!stepsWrapperEl || !stepOptionsEl || !stepTimezoneEl) return;

		stepsWrapperEl.scroll({
			left: 0,
			behavior: 'smooth'
		});

		const stepsWrapperRect = stepsWrapperEl.getBoundingClientRect();
		stepsWrapperEl.style.height = `${stepsWrapperRect.height}px`;

		resizeStepsWrapper(stepOptionsEl!);

		stepsWrapperEl.addEventListener(
			'transitionend',
			() => {
				stepsWrapperEl!.style.transition = '';
				// stepsWrapperEl!.style.height = '';
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
</script>

<div id="steps-wrapper" bind:this={stepsWrapperEl} style:--step-width="{stepWidth}px">
	<div class="step-options" bind:this={stepOptionsEl}>
		<h2>Edit Clock</h2>

		<form
			use:enhance={() => {
				error = '';
				return async ({ result, update }) => {
					await update({ reset: false, invalidateAll: true });
					if (result.type === 'failure' && typeof result.data?.message === 'string') {
						error = result.data.message;
					}
				};
			}}
			bind:this={optionsFormEl}
			action="/api/profile?/editClockOptions"
			method="post"
		>
			<label for="show-seconds">
				Show seconds

				<Switch
					required={false}
					name="show-seconds"
					onchange={() => optionsFormEl?.requestSubmit()}
					checked={widget.show_seconds}
				/>
			</label>
			<label for="24-hour-format">
				24-hour format

				<Switch
					required={false}
					name="24-hour-format"
					onchange={() => optionsFormEl?.requestSubmit()}
					checked={widget.hour_format === '24h'}
				/>
			</label>
		</form>
		<button onclick={nextStep}>
			<div class="text">
				<div class="heading">Edit timezone</div>
				<div class="subtext" aria-label="Current timezone: {widget.timezone}">
					{widget.timezone}
				</div>
			</div>

			<CaretRight weight="regular" />
		</button>
	</div>

	<div class="step-timezone" bind:this={stepTimezoneEl}>
		<div class="header">
			<button onclick={previousStep} aria-label="Back to options">
				<CaretLeft weight="regular" />
			</button>
			<h2>Edit timezone</h2>
		</div>

		<form
			use:enhance={() => {
				error = '';
				isLoading = true;
				return async ({ update, result }) => {
					await update({ reset: false });
					resizeStepsWrapper(stepTimezoneEl!);

					if (
						result.type === 'success' &&
						result.data &&
						'cities' in result.data &&
						Array.isArray(result.data.cities)
					) {
						cities = result.data.cities;
					} else if (
						result.type === 'failure' &&
						result.data &&
						'message' in result.data &&
						typeof result.data.message === 'string'
					) {
						error = result.data.message;
					}
					isLoading = false;
				};
			}}
			action="/api/search/places"
			method="post"
		>
			<TextInput
				placeholder="Search cities or countries to set the clock"
				name="query"
				defaultValue={widget.city}
				{error}
				oninput={() => {
					error = '';
					resizeStepsWrapper(stepTimezoneEl!);
				}}
			>
				{#snippet prefixIcon()}
					<Globe />
				{/snippet}
				{#snippet suffixButton()}
					<Button size="small" icon type="submit" disabled={isLoading}>
						{#if isLoading}
							<Spinner />
						{:else}
							<MagnifyingGlass weight="regular" />
						{/if}
					</Button>
				{/snippet}
			</TextInput>
		</form>
		{#if cities.length}
			<ul class="cities">
				{#each cities as city}
					<li>
						<form
							use:enhance={() =>
								async ({ result, update }) => {
									console.log(result);
									await update({ reset: false });
									if (result.type === 'success') {
										modalOpened = false;
									}
								}}
							action="/api/profile?/editClockTimezone"
							method="post"
						>
							<button type="submit">
								<input type="hidden" name="city" value={city.city} />
								<div class="city-left">
									<div class="city-country">
										{city.city}, {city.country}
									</div>

									<div class="timezone subtext">
										{new Intl.DateTimeFormat('en-US', {
											timeZoneName: 'shortOffset',
											timeZone: city.timezone
										})
											.formatToParts(date)
											.find(({ type }) => type === 'timeZoneName')?.value}
									</div>
								</div>

								<time class="city-time" datetime={date.toISOString()}>
									{date.toLocaleTimeString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										timeZone: city.timezone,
										hour12: true
									})}
								</time>
							</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#steps-wrapper {
		display: flex;

		max-width: var(--step-width);
		margin: calc(0px - var(--base-padding));
		overflow: hidden;

		.step-options,
		.step-timezone {
			flex-shrink: 0;
			width: var(--step-width);
			max-width: 100%;
			padding: var(--base-padding);
			// padding-bottom: 0;
			height: fit-content;
		}

		.step-options {
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);

			form {
				display: flex;
				flex-direction: column;
				gap: var(--base-gap);
			}

			label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: var(--base-gap);
				cursor: pointer;
			}

			button {
				cursor: pointer;
				appearance: none;
				border: none;
				background-color: transparent;
				display: flex;
				justify-content: space-between;
				align-items: center;
				text-align: left;
				padding: calc(var(--base-padding) * 0.5);
				margin: calc(0px - var(--base-padding) * 0.5);
				border-radius: calc(var(--inputs-border-base-radius) * 0.5);

				.text {
					display: flex;
					flex-direction: column;
					gap: calc(var(--base-gap) * 0.25);
				}

				&:hover {
					backdrop-filter: brightness(0.95);
				}
			}
		}

		.step-timezone {
			display: flex;
			flex-direction: column;
			gap: var(--base-gap);

			.header {
				display: flex;
				align-items: center;
				gap: calc(var(--base-gap) * 0.75);

				button {
					cursor: pointer;
					appearance: none;
					border: none;
					background-color: transparent;
					margin: -1rem;
					padding: 1rem;
				}
			}

			ul {
				@include mixins.fancy-list;
				color: var(--color-heading);
				max-height: 400px;
				overflow-y: scroll;

				li {
					form {
						display: contents;

						button {
							display: flex;
							padding: var(--base-padding);
							justify-content: space-between;
							align-items: center;
							cursor: pointer;
							appearance: none;
							border: none;
							background-color: transparent;
							width: 100%;
							text-align: left;

							.city-left {
								display: flex;
								flex-direction: column;
							}

							.city-time {
								font-size: 1.25rem;
							}

							&:hover {
								backdrop-filter: brightness(0.95);
							}
						}
					}
				}
			}
		}
	}
</style>
