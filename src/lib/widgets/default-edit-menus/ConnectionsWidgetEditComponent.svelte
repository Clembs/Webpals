<script lang="ts">
	import ConnectionEdit from './WidgetEditConnectionItem.svelte';
	import ConnectionCreate from './ConnectionCreate.svelte';
	import type { PublicUser } from '$lib/db/schema/types';

	let {
		user
	}: {
		user: PublicUser;
	} = $props();

	let editingConnectionId = $state<string>();
</script>

<div class="connections-widget-edit">
	<h2>Connections</h2>

	<ul class="connections-list">
		{#each user.connections as connection, index}
			<ConnectionEdit bind:editingConnectionId {connection} />
		{/each}
	</ul>

	<ConnectionCreate />
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
