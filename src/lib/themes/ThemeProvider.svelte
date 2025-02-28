<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Theme } from './types';
	import { PUBLIC_STORAGE_BASE_URL } from '$env/static/public';

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
				return theme.background.image_url
					? `url(${theme.background.image_url?.startsWith('blob') ? theme.background.image_url : `${PUBLIC_STORAGE_BASE_URL}/${theme.background.image_url}`})`
					: 'none';
		}
	}
</script>

<theme-provider
	style="
	display: contents;
	--background: {resolveBackground(theme)};
	{theme.background.type === 'image'
		? `
	--background-size: ${theme.background.image_size};
	--background-position: ${theme.background.image_position};
	--background-repeat: ${theme.background.image_repeat};
	--background-rendering: ${theme.background.image_rendering};
	--background-attachment: ${theme.background.image_attachment};
	`
		: ''}

	--avatar-size: {theme.avatar.size}px;
  --avatar-border-radius: {typeof theme.avatar.border?.radius === 'string'
		? theme.avatar.border?.radius
		: `${theme.avatar.border?.radius}rem`};
  
	--color-paragraph: {theme.font.color_paragraph};
  --color-heading: {theme.font.color_heading};
  color: {theme.font.color_paragraph};
	--font-paragraph: '{theme.font.style_paragraph}', var(--font-fallbacks);
	--font-heading: '{theme.font.style_heading}', var(--font-fallbacks);
	font-family: var(--font-paragraph); /* idk why this is needed, but it is */
	
	--base-padding: {theme.spacing.padding}rem;
  --base-gap: {theme.spacing.gap}rem;
  
	--widgets-background-color: {theme.widgets.color_background};
  --widgets-background-color-dim: {theme.widgets.color_background_dim};
	--widgets-background-blur: {theme.widgets.background_blur}px;
  --widgets-border-width: {theme.widgets.border.width}px;
  --widgets-border-color: {theme.widgets.border.color};
  --widgets-border-base-radius: {theme.widgets.border.radius}rem;
  --widgets-box-shadow-x: {theme.widgets.shadow?.x || 0}px;
  --widgets-box-shadow-y: {theme.widgets.shadow?.y || 0}px;
  --widgets-box-shadow-blur: {theme.widgets.shadow?.blur || 0}px;
  --widgets-box-shadow-spread: {theme.widgets.shadow?.spread || 0}px;
  --widgets-box-shadow-color: {theme.widgets.shadow?.color || 'transparent'};
	
	--buttons-primary-background-color: {theme.primary_buttons.color_background};
	--buttons-primary-on-background-color: {theme.primary_buttons.color_on_background};
	--buttons-primary-border-color: {theme.primary_buttons.border.color};
	--buttons-primary-box-shadow-x: {theme.primary_buttons.shadow?.x || 0}px;
	--buttons-primary-box-shadow-y: {theme.primary_buttons.shadow?.y || 0}px;
	--buttons-primary-box-shadow-blur: {theme.primary_buttons.shadow?.blur || 0}px;
	--buttons-primary-box-shadow-spread: {theme.primary_buttons.shadow?.spread || 0}px;
	--buttons-primary-box-shadow-color: {theme.primary_buttons.shadow?.color || 'transparent'};
	
	--inputs-border-width: {theme.secondary_inputs.border.width}px;
	--inputs-border-base-radius: {theme.secondary_inputs.border.radius}rem;

	--inputs-background-color: {theme.secondary_inputs.color_background};
	--inputs-on-background-color: {theme.secondary_inputs.color_on_background};
	--inputs-border-color: {theme.secondary_inputs.border.color};
	--inputs-box-shadow-x: {theme.secondary_inputs.shadow?.x || 0}px;
	--inputs-box-shadow-y: {theme.secondary_inputs.shadow?.y || 0}px;
	--inputs-box-shadow-blur: {theme.secondary_inputs.shadow?.blur || 0}px;
	--inputs-box-shadow-spread: {theme.secondary_inputs.shadow?.spread || 0}px;
	--inputs-box-shadow-color: {theme.secondary_inputs.shadow?.color || 'transparent'};
  "
>
	{@render children()}
</theme-provider>
