<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { CustomWidget, WidgetComponentProps } from '../types';
	import LayoutBlockComponent from './LayoutBlockComponent.svelte';

	let {
		profile,
		widget,
		editing
	}: WidgetComponentProps<CustomWidget> & {
		profile: { id: string };
	} = $props();

	let modalOpened = $state(false);
</script>

<BaseWidget bind:isWidgetEditing={modalOpened} {widget} editingMode={editing}>
	{#snippet editMenu()}
		<form
			use:enhance={() =>
				({ update }) => {
					update({ reset: false });
					modalOpened = false;
				}}
			method="post"
			action="/api/profile?/editCustomWidget&id={widget.id}"
		>
			<LayoutBlockComponent edit user={profile} block={widget} />
			<Button type="submit">Save</Button>
		</form>
	{/snippet}
	<LayoutBlockComponent user={profile} block={widget} />
</BaseWidget>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
	}
</style>
