<script lang="ts">
	import type { IconContextProps } from 'phosphor-svelte';

	let { size = 24, ...restProps }: IconContextProps['values'] = $props();
</script>

<svg
	role="img"
	height={size}
	width={size}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	{...restProps}
>
	<path
		d="M22.957 7.21c-.004-3.064-2.391-5.576-5.191-6.482-3.478-1.125-8.064-.962-11.384.604C2.357 3.231 1.093 7.391 1.046 11.54c-.039 3.411.302 12.396 5.369 12.46 3.765.047 4.326-4.804 6.068-7.141 1.24-1.662 2.836-2.132 4.801-2.618 3.376-.836 5.678-3.501 5.673-7.031Z"
		fill="currentColor"
	/>
</svg>
