import { deepMerge } from '@std/collections';
import type { Theme } from './types';

export const plainTheme: Theme = {
	background: {
		type: 'color',
		color: '#f2f2f2'
	},
	avatar: {
		size: 80,
		border: {
			radius: '50%',
			width: 0,
			color: '#ffffff00'
		}
	},
	font: {
		color_paragraph: '#656565',
		color_heading: '#000',
		style_heading: 'Public Sans',
		style_paragraph: 'Public Sans'
	},
	spacing: {
		gap: 1,
		padding: 1
	},
	widgets: {
		color_background: '#fff',
		color_background_dim: '#f2f2f2',
		background_blur: 0,
		border: {
			radius: 1,
			width: 1,
			color: '#999'
		},
		shadow: {
			color: '#00000001',
			x: 0,
			y: 0,
			blur: 10,
			spread: 0
		}
	},
	primary_buttons: {
		color_background: '#000',
		color_on_background: '#fff',
		border: {
			color: '#000'
		},
		shadow: null
	},
	secondary_inputs: {
		color_background: '#fff',
		color_on_background: '#000',
		border: {
			radius: 0.5,
			width: 1,
			color: '#999'
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
