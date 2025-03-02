<script lang="ts">
	import { onMount } from 'svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { ClockWidget, WidgetComponentProps } from '../types';
	import { Globe, MagnifyingGlass } from 'phosphor-svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { enhance } from '$app/forms';
	import { type CityData } from 'city-timezones';
	import Button from '$lib/components/Button.svelte';
	import Spinner from '$icons/Spinner.svelte';

	let { profile, widget, editing }: WidgetComponentProps<ClockWidget> = $props();

	let modalOpened = $state(false);
	let date = $state(new Date());

	let timeParts = $derived(
		new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: widget.hour_format === '12h',
			timeZoneName: 'short',
			timeZone: widget.timezone
		}).formatToParts(date)
	);

	let timeString = $derived(
		`${timeParts.find(({ type }) => type === 'hour')?.value}:${timeParts.find(({ type }) => type === 'minute')?.value}`
	);

	let dayPeriod = $derived(
		timeParts.find(({ type }) => type === 'dayPeriod')!.value as 'AM' | 'PM'
	);

	let cities = $state<CityData[]>([]);
	let error = $state('');
	let isLoading = $state(false);

	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<BaseWidget bind:isWidgetEditing={modalOpened} {profile} {widget} editingMode={editing}>
	{#snippet editMenu()}
		<div id="clock-edit-menu">
			<h2>Clock Settings</h2>

			<form
				use:enhance={() => {
					error = '';
					isLoading = true;
					return async ({ update, result }) => {
						await update({ reset: false });
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
				<TextInput placeholder="Search cities, countries" name="query" value={widget.city} {error}>
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
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/snippet}

	<div class="clock">
		<time datetime={date.toISOString()}>
			<span class="time-string">
				{timeString}
			</span>
			{#if widget.hour_format === '12h'}
				<span class="day-period">{dayPeriod}</span>
			{/if}
		</time>

		<div class="region">
			<Globe />

			<span class="city-country">
				{widget.city}, {widget.country}
			</span>
		</div>
	</div>
</BaseWidget>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	#clock-edit-menu {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);

		ul {
			@include mixins.fancy-list;
			color: var(--color-heading);
			max-height: 400px;
			overflow-y: scroll;

			li {
				display: flex;
				padding: var(--base-padding);
				justify-content: space-between;
				align-items: center;

				.city-left {
					display: flex;
					flex-direction: column;
				}

				.city-time {
					font-size: 1.25rem;
				}
			}
		}
	}

	.clock {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.75);
		align-items: center;

		time {
			color: var(--color-heading);

			.time-string {
				font-size: 3.25rem;
				letter-spacing: 0.05em;
			}

			.day-period {
				font-weight: 700;
				font-size: 1.25rem;
			}
		}

		.region {
			display: flex;
			gap: calc(var(--base-gap) * 0.5);
			align-items: center;
			color: var(--color-heading);
		}
	}
</style>
