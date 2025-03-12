<script lang="ts">
	import { onMount } from 'svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { ClockWidget, WidgetComponentProps } from '../types';
	import { Globe } from 'phosphor-svelte';
	import ClockWidgetEdit from '../default-edit-menus/ClockWidgetEdit.svelte';

	let { widget, editing }: WidgetComponentProps<ClockWidget> = $props();

	let modalOpened = $state(false);
	let date = $state(new Date());

	let timeParts = $derived(
		new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			...(widget.show_seconds ? { second: 'numeric' } : {}),
			hour12: widget.hour_format === '12h',
			timeZoneName: 'short',
			timeZone: widget.timezone
		}).formatToParts(date)
	);

	let timeString = $derived(
		timeParts.find(({ type }) => type === 'hour')?.value +
			':' +
			timeParts.find(({ type }) => type === 'minute')?.value +
			`${widget.show_seconds ? ':' + timeParts.find(({ type }) => type === 'second')?.value : ''}`
	);

	let dayPeriod = $derived(
		timeParts.find(({ type }) => type === 'dayPeriod')?.value as 'AM' | 'PM' | undefined
	);

	onMount(() => {
		const interval = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<BaseWidget bind:isWidgetEditing={modalOpened} {widget} editingMode={editing}>
	{#snippet editMenu()}
		<ClockWidgetEdit bind:modalOpened {widget} {editing} />
	{/snippet}

	<div class="clock">
		<time datetime={date.toISOString()}>
			<span class="time-string">
				{timeString}
			</span>
			{#if widget.hour_format === '12h' && dayPeriod}
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
				letter-spacing: -0.05em;
				font-family: 'JetBrains Mono', monospace;
				margin-right: 0.1em;
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
