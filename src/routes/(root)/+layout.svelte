<script lang="ts">
	import NavBar from '$lib/components/NavBar/NavBar.svelte';

	let { children } = $props();
</script>

<NavBar />

{@render children()}
