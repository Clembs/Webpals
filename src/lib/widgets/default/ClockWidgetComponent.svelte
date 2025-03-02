<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { ClockWidget, WidgetComponentProps } from '../types';
	import { Globe } from 'phosphor-svelte';

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

	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<BaseWidget bind:isWidgetEditing={modalOpened} {profile} {widget} editingMode={editing}>
	{#snippet editMenu()}{/snippet}

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
