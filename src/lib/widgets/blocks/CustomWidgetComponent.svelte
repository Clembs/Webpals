<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import BaseWidget from '../BaseWidget.svelte';
	import type { CustomWidget, WidgetComponentProps } from '../types';
	import LayoutBlockComponent from './LayoutBlockComponent.svelte';

	let {
		user,
		widget,
		editing
	}: WidgetComponentProps<CustomWidget> & {
		user: { id: string };
	} = $props();

	let modalOpened = $state(false);
</script>

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
		<LayoutBlockComponent edit {user} block={widget} />
		<Button type="submit">Save</Button>
	</form>
{/snippet}

<BaseWidget bind:modalOpened {editMenu} {user} {widget} {editing}>
	<LayoutBlockComponent {user} block={widget} />
</BaseWidget>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--base-gap);
	}
</style>
