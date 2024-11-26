<!--
  Remixed from https://github.com/n3r4zzurr0/svg-spinners/blob/main/svg-css/90-ring.svg?short_path=74838c2
	by Utkarsh Verma under MIT License
-->

<script lang="ts">
	import type { IconContextProps } from 'phosphor-svelte';

	let { size = 24, ...restProps }: IconContextProps['values'] = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
	{...restProps}
>
	<style>
		.spinner_P7sC {
			transform-origin: center;
			animation: spinner_svv2 0.75s infinite linear;
		}
		@keyframes spinner_svv2 {
			100% {
				transform: rotate(360deg);
			}
		}
	</style>
	<path
		d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
		class="spinner_P7sC"
		fill="currentColor"
	/>
</svg>
