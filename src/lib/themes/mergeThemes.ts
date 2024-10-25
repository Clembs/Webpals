import { deepMerge } from '@std/collections';
import type { Theme } from './types';

export const plainTheme: Theme = {
	background: {
		type: 'color',
		color: 'var(--plain-80)'
	},
	avatar: {
		size: 80,
		border: {
			radius: '50%',
			width: 0,
			color: 'transparent'
		}
	},
	font: {
		family: 'var(--font-family)',
		color_paragraph: 'var(--plain-50)',
		color_heading: 'var(--plain-0)'
	},
	spacing: {
		gap: 1,
		padding: 1
	},
	widgets: {
		color_background: 'var(--plain-90)',
		color_background_dim: 'var(--plain-80)',
		border: {
			radius: 1,
			width: 1,
			color: 'var(--plain-60)'
		},
		shadow: {
			color: 'rgba(0, 0, 0, 0.1)',
			x: 0,
			y: 0,
			blur: 10,
			spread: 0
		}
	},
	primary_buttons: {
		color_background: 'var(--plain-0)',
		color_on_background: 'var(--plain-90)',
		border: {
			radius: 0.5,
			width: 1,
			color: 'var(--plain-0)'
		},
		shadow: null
	},
	secondary_inputs: {
		color_background: 'var(--plain-90)',
		color_on_background: 'var(--plain-0)',
		border: {
			radius: 0.5,
			width: 1,
			color: 'var(--plain-60)'
		},
		shadow: null
	}
};

type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
			? RecursivePartial<T[P]>
			: T[P];
};

export type PartialTheme = RecursivePartial<Theme>;

export function mergeThemes(baseTheme: Theme, partialTheme: PartialTheme): Theme {
	return deepMerge(baseTheme, partialTheme) as Theme;
}
