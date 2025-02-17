import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter({
			maxDuration: 60,
			runtime: 'nodejs22.x'
		}),
		alias: {
			$icons: 'src/icons'
		}
	}
};

export default config;
