<script lang="ts">
	import TextBlockComponent from './TextBlockComponent.svelte';
	import type { LayoutBlock, CustomWidget } from '../types';
	import KeyValueBlockComponent from './KeyValueBlockComponent.svelte';
	import LayoutBlockComponent from './LayoutBlockComponent.svelte';

	import { onMount } from 'svelte';

	let {
		edit = false,
		user,
		block,
		basePath
	}: {
		edit?: boolean;
		user: { id: string };
		block: CustomWidget | LayoutBlock;
		basePath: string;
	} = $props();

	let loading = $state(false);
	let data = $state<unknown>();
	let error = $state<string>();

	async function fetchData() {
		if (!('json_endpoint' in block) || !block.json_endpoint) return;

		loading = true;
		const response = await fetch(block.json_endpoint.replace('{userid}', user.id));

		if (!response.ok) {
			error = await response.text();
			return;
		}

		if (response.headers.get('Content-Type')?.includes('application/json') === false) {
			error = 'Response is not JSON';
			return;
		}

		loading = false;
		data = await response.json();
	}

	onMount(fetchData);
</script>

<div class="blocks">
	{#if error}
		<p>{error}</p>
	{:else if loading}
		<p>Loading data...</p>
	{:else}
		{#each block.blocks as b, i}
			{#if b.type === 'text'}
				<TextBlockComponent basePath="{basePath}[{i}]" {edit} block={b} {data} />
			{:else if b.type === 'key_value'}
				<KeyValueBlockComponent basePath="{basePath}[{i}]" {edit} block={b} {data} />
			{:else if b.type === 'layout'}
				<LayoutBlockComponent basePath="{basePath}[{i}].blocks" {edit} {user} block={b} />
			{/if}
		{/each}
	{/if}
</div>

<style lang="scss">
	.blocks {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
