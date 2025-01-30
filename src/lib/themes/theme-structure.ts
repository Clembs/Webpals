import {
	number,
	strictObject,
	hexColor,
	pipe,
	string,
	union,
	array,
	literal,
	nullable,
	picklist,
	regex,
	omit,
	minValue,
	maxValue,
	partial
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

const ImageBackgroundStructure = strictObject({
	image_url: string(),
	image_position: picklist(['center', 'top', 'bottom', 'left', 'right']),
	image_size: picklist(['auto', 'cover', 'contain']),
	image_repeat: picklist(['no-repeat', 'repeat']),
	image_rendering: picklist(['smooth', 'pixelated']),
	image_attachment: picklist(['scroll', 'fixed'])
});

const ColorBackgroundStructure = strictObject({
	color: HexColorStructure
});

const GradientBackgroundStructure = strictObject({
	gradient_colors: array(HexColorStructure),
	gradient_direction: nullable(number()),
	gradient_type: picklist(['linear', 'radial', 'conic'])
});

const BackgroundStructure = union([
	strictObject({
		type: literal('gradient'),
		...GradientBackgroundStructure.entries,
		...partial(ColorBackgroundStructure).entries,
		...partial(ImageBackgroundStructure).entries
	}),
	strictObject({
		type: literal('color'),
		...ColorBackgroundStructure.entries,
		...partial(GradientBackgroundStructure).entries,
		...partial(ImageBackgroundStructure).entries
	}),
	strictObject({
		type: literal('image'),
		...ImageBackgroundStructure.entries,
		...partial(ColorBackgroundStructure).entries,
		...partial(GradientBackgroundStructure).entries
	})
]);

export const ThemeStructure = strictObject({
	background: BackgroundStructure,
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
		shadow: nullable(ShadowStructure),
		background_blur: pipe(number(), minValue(0), maxValue(10))
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
