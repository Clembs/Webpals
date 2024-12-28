<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	let { children } = $props();
</script>

<main>
	<Card max-width="500px">
		{@render children()}
	</Card>
</main>

<style lang="scss">
	main {
		display: grid;
		place-items: center;
		flex: 1;
		padding: 0 calc(var(--base-padding) * 0.5);
	}
</style>
