<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { CustomWidget } from '../types';
	import LayoutBlockComponent from './LayoutBlockComponent.svelte';

	let { user, widget }: { user: { id: string }; widget: CustomWidget } = $props();
</script>

{#snippet editMenu()}
	<form use:enhance method="post" action="/api/profile?/editCustomWidget&id={widget.id}">
		<LayoutBlockComponent edit {user} block={widget} />
		<Button type="submit">Save</Button>
	</form>
{/snippet}

<BaseWidget {widget} {editMenu} {user}>
	<LayoutBlockComponent {user} block={widget} />
</BaseWidget>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
	}
</style>
