<script lang="ts">
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import { replacePlaceholders } from '../placeholders';
	import type { TextBlock } from '../types';

	let {
		edit,
		block,
		basePath,
		data = undefined
	}: {
		edit: boolean;
		block: TextBlock;
		basePath: string;
		data?: unknown;
	} = $props();

	let fontSize: string;

	switch (block.text_type) {
		case 'h1':
			fontSize = '1.75rem';
			break;
		case 'h2':
			fontSize = '1.5rem';
			break;
		case 'h3':
			fontSize = '1.375rem';
			break;
		case 'h4':
			fontSize = '1.25rem';
			break;
		case 'h5':
			fontSize = '1.125rem';
			break;
		case 'h6':
			fontSize = '1rem';
			break;
		case 'paragraph':
			fontSize = '1rem';
			break;
		case 'subtext':
			fontSize = '0.9rem';
			break;
	}
</script>

{#if !block.editable || !edit}
	{#if block.text_type === 'paragraph'}
		<p>{replacePlaceholders(block.content, data)}</p>
	{:else if block.text_type === 'subtext'}
		<span class="subtext">
			{replacePlaceholders(block.content, data)}
		</span>
	{:else}
		<svelte:element this={block.text_type} style="font-size: {fontSize}">
			{replacePlaceholders(block.content, data)}
		</svelte:element>
	{/if}
{:else}
	<InlineTextInput font-size={fontSize} name="{basePath}.content" value={block.content} />
{/if}
