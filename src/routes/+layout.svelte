<script lang="ts">
	import IconContext from 'phosphor-svelte/lib/IconContext';
	import '../styles/global.scss';

	let { children } = $props();
</script>

<IconContext
	values={{
		size: 24,
		weight: 'fill'
	}}
>
	{@render children()}
</IconContext>
