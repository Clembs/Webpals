<script lang="ts">
	import BaseEditBarMenu from './BaseEditBarMenu.svelte';

	let {
		menuOpen = $bindable(false),
		editBarEl,
		editBarWrapperEl
	}: {
		menuOpen: boolean;
		editBarEl: HTMLDivElement | undefined;
		editBarWrapperEl: HTMLDivElement | undefined;
	} = $props();
</script>

<BaseEditBarMenu name="Matt" {editBarEl} {editBarWrapperEl} bind:menuOpen>
	<div class="matt">
		Welcome to the Matt menu. This menu is related to Matt, the greatest human to ever be. Which
		Matt you may be asking? The Matt. It's Matt. Matt.
	</div>
</BaseEditBarMenu>

<style lang="scss">
	.matt {
		padding: 1rem;
	}
</style>
