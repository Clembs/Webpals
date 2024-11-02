<script lang="ts">
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import { replacePlaceholders } from '../placeholders';
	import type { TextBlock } from '../types';
	import { parseMarkdown } from '$lib/helpers/text';

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

{#snippet blockContent()}
	{#if block.editable}
		{@html parseMarkdown(replacePlaceholders(block.content, data))}
	{:else}
		{replacePlaceholders(block.content, data)}
	{/if}
{/snippet}

{#if !block.editable || !edit}
	{#if block.text_type === 'paragraph'}
		{@render blockContent()}
	{:else if block.text_type === 'subtext'}
		<span class="subtext">
			{@render blockContent()}
		</span>
	{:else}
		<svelte:element this={block.text_type} style="font-size: {fontSize}">
			{@render blockContent()}
		</svelte:element>
	{/if}
{:else}
	<InlineTextInput font-size={fontSize} name="{basePath}.content" value={block.content} />
{/if}
