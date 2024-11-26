<script lang="ts">
	import { connectionProviders } from '../connections';
	import type { ConnectionsWidget } from '../types';
	import ConnectionCreateField from './ConnectionCreateField.svelte';
	import ConnectionEdit from './ConnectionEdit.svelte';

	let {
		widget
	}: {
		widget: ConnectionsWidget;
	} = $props();

	let selectedConnectionIndex = $state<number>();
</script>

<div class="connections-widget-edit">
	<h2>Connections</h2>

	<ul class="connections-list">
		{#each widget.connections as connection, index}
			<ConnectionEdit bind:selectedConnectionIndex {connection} {index} />
		{/each}

		<li>
			<ConnectionCreateField />
		</li>
	</ul>
</div>

<style lang="scss">
	@use '../../../styles/mixins.scss';

	.connections-widget-edit {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 1.25);

		h2 {
			font-size: 1.5rem;
		}

		.connections-list {
			@include mixins.fancy-list;
			overflow: hidden;
		}
	}
</style>
