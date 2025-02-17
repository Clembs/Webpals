import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { sveltePhosphorOptimize } from 'phosphor-svelte/vite';

export default defineConfig({
	plugins: [sveltePhosphorOptimize(), sveltekit()],
	optimizeDeps: {
		exclude: ['phosphor-svelte']
	}
});
