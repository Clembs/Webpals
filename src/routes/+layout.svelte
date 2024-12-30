<script lang="ts">
	import IconContext from 'phosphor-svelte/lib/IconContext';
	import '../styles/global.scss';
	// import { browser } from '$app/environment';
	// import { HEARTBEAT_INTERVAL } from '$lib/helpers/constants';
	import NavBar from '$lib/components/NavBar/NavBar.svelte';
	import DialogPortal from '$lib/portals/DialogPortal.svelte';

	let { data, children } = $props();

	// if the user is not purposely offline, send a heartbeat to keep them online
	// if (browser && data.currentUser && data.currentUser.status !== 'offline') {
	// 	// send a heartbeat every 3 minutes to keep the user online
	// 	setInterval(async () => {
	// 		await fetch('/api/heartbeat', {
	// 			method: 'POST'
	// 		});
	// 	}, HEARTBEAT_INTERVAL);
	// }
</script>

<IconContext
	values={{
		size: 24,
		weight: 'fill'
	}}
>
	<DialogPortal />

	<NavBar />

	{@render children()}
</IconContext>
