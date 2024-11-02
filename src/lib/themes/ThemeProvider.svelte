<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Theme } from './types';

	let {
		theme,
		children
	}: {
		theme: Theme;
		children: Snippet;
	} = $props();

	function resolveBackground(theme: Theme) {
		switch (theme.background.type) {
			case 'color':
				return theme.background.color;
			case 'gradient': {
				if (theme.background.gradient_type === 'conic') {
					return `conic-gradient(from ${theme.background.gradient_direction}deg, ${theme.background.gradient_colors.join(', ')})`;
				} else if (theme.background.gradient_type === 'radial') {
					return `radial-gradient(circle at center, ${theme.background.gradient_colors.join(', ')})`;
				} else if (theme.background.gradient_type === 'linear') {
					return `linear-gradient(${theme.background.gradient_direction}deg, ${theme.background.gradient_colors.join(', ')})`;
				}
				break;
			}
			case 'image':
				return `url(${theme.background.image_url})`;
		}
	}
</script>

<theme-provider
	style="
  --avatar-size: {theme.avatar.size}px;
  --avatar-border-radius: {typeof theme.avatar.border?.radius === 'string'
		? theme.avatar.border?.radius
		: `${theme.avatar.border?.radius}rem`};
  --color-paragraph: {theme.font.color_paragraph};
  --color-heading: {theme.font.color_heading};
  color: {theme.font.color_paragraph};
  font-family: '{theme.font.family}', var(--font-family);
  --background: {resolveBackground(theme)};
  --base-padding: {theme.spacing.padding}rem;
  --base-gap: {theme.spacing.gap}rem;
  --widgets-background-color: {theme.widgets.color_background};
  --widgets-background-color-dim: {theme.widgets.color_background_dim};
  --widgets-border-width: {theme.widgets.border?.width}px;
  --widgets-border-color: {theme.widgets.border?.color};
  --widgets-border-base-radius: {theme.widgets.border?.radius}rem;
  --widgets-box-shadow-x: {theme.widgets.shadow?.x}px;
  --widgets-box-shadow-y: {theme.widgets.shadow?.y}px;
  --widgets-box-shadow-blur: {theme.widgets.shadow?.blur}px;
  --widgets-box-shadow-spread: {theme.widgets.shadow?.spread}px;
  --widgets-box-shadow-color: {theme.widgets.shadow?.color};
  "
>
	{@render children()}
</theme-provider>
