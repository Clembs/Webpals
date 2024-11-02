<script lang="ts">
	import InlineTextInput from '$lib/components/InlineTextInput.svelte';
	import { parseMarkdown } from '$lib/helpers/text';
	import { replacePlaceholders } from '../placeholders';
	import type { KeyValueBlock } from '../types';

	let {
		edit,
		block,
		basePath,
		data = undefined
	}: {
		edit: boolean;
		block: KeyValueBlock;
		basePath: string;
		data?: unknown;
	} = $props();
</script>

<div class="key-value-block">
	<div class="heading">
		{replacePlaceholders(block.key, data)}
	</div>
	{#if !edit}
		<p class="subtext">
			{@html parseMarkdown(
				replacePlaceholders(block.value, data)
					// remove all HTML tags
					.replaceAll(/<\/?[^>]+(>|$)/g, ''),
				{
					renderer: {
						// remove all headings
						heading: ({ text }) => `<p>${text}</p>`
					}
				}
			)}
		</p>
	{:else}
		<InlineTextInput font-size="15px" name="{basePath}.value" value={block.value} />
	{/if}
</div>

<style lang="scss">
	.key-value-block {
		display: flex;
		flex-direction: column;
		gap: calc(var(--base-gap) * 0.25);
	}
</style>
