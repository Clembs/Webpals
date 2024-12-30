import {
	number,
	strictObject,
	hexColor,
	pipe,
	string,
	union,
	array,
	literal,
	url,
	nullable,
	picklist,
	regex,
	optional,
	omit,
	minValue,
	maxValue
} from 'valibot';

const HexColorStructure = pipe(string(), hexColor());

const BorderStructure = strictObject({
	radius: union([pipe(string(), regex(/^(\d+)%$/)), pipe(number(), minValue(0), maxValue(3))]),
	width: pipe(number(), minValue(0), maxValue(10)),
	color: HexColorStructure
});

const ShadowStructure = strictObject({
	color: HexColorStructure,
	x: number(),
	y: number(),
	blur: number(),
	spread: number()
});

const BackgroundGradientStructure = union([
	strictObject({
		type: literal('gradient'),
		gradient_colors: array(HexColorStructure),
		gradient_direction: nullable(number()),
		gradient_type: picklist(['linear', 'radial', 'conic']),

		color: optional(HexColorStructure),
		image_url: optional(pipe(string(), url())),
		image_position: optional(picklist(['center', 'top', 'bottom', 'left', 'right'])),
		image_size: optional(picklist(['cover', 'contain']))
	}),
	strictObject({
		type: literal('color'),
		color: HexColorStructure,

		gradient_colors: optional(array(HexColorStructure)),
		gradient_direction: optional(nullable(number())),
		gradient_type: optional(picklist(['linear', 'radial', 'conic'])),
		image_url: optional(pipe(string(), url())),
		image_position: optional(picklist(['center', 'top', 'bottom', 'left', 'right'])),
		image_size: optional(picklist(['cover', 'contain']))
	}),
	strictObject({
		type: literal('image'),
		image_url: pipe(string(), url()),
		image_position: picklist(['center', 'top', 'bottom', 'left', 'right']),
		image_size: picklist(['cover', 'contain']),

		gradient_colors: optional(array(HexColorStructure)),
		gradient_direction: optional(nullable(number())),
		gradient_type: optional(picklist(['linear', 'radial', 'conic'])),
		color: optional(HexColorStructure)
	})
]);

export const ThemeStructure = strictObject({
	background: BackgroundGradientStructure,
	avatar: strictObject({
		size: number(),
		border: nullable(BorderStructure)
	}),
	font: strictObject({
		family: string(),
		color_paragraph: HexColorStructure,
		color_heading: HexColorStructure
	}),
	spacing: strictObject({
		padding: pipe(number(), minValue(0.25), maxValue(2)),
		gap: pipe(number(), minValue(0.25), maxValue(2))
	}),
	widgets: strictObject({
		color_background: HexColorStructure,
		color_background_dim: HexColorStructure,
		border: BorderStructure,
		shadow: nullable(ShadowStructure)
	}),
	primary_buttons: strictObject({
		color_background: HexColorStructure,
		color_on_background: HexColorStructure,
		border: omit(BorderStructure, ['radius', 'width']),
		shadow: nullable(ShadowStructure)
	}),
	secondary_inputs: strictObject({
		color_background: HexColorStructure,
		color_on_background: HexColorStructure,
		border: BorderStructure,
		shadow: nullable(ShadowStructure)
	})
});
