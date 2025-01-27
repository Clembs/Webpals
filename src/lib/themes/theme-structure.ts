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
	omit,
	minValue,
	maxValue,
	type InferOutput,
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
	image_url: pipe(string(), url()),
	image_position: picklist(['center', 'top', 'bottom', 'left', 'right']),
	image_size: picklist(['auto', 'cover', 'contain']),
	image_repeat: picklist(['no-repeat', 'repeat']),
	image_rendering: picklist(['smooth', 'pixelated'])
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

const truc: InferOutput<typeof ThemeStructure> = {
	background: {
		type: 'image',
		color: '#f2f2f2',
		image_url:
			'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAPAA8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD48s/2P/Hnxg+Pfxo/a1vfgB43/am+NX7fX/CwP2rv2VfCPi+5/Zv8VarrH7KPjy5/ZY8bfs2eBdP1/wDbI+BP7Un7N3wo/wCFc/CX4jfHrwh+0hrmv+BPEd58E/Gf7N37Jv7P3w1+Lfwn8GftbfBq0/bS++PgL+yZ8JPgh+0/8SviR+35/wAE2v2dfgh+x/41+FmgaF/wvv8Aaf8AhZ/wTc074UeD/jZoesWXiDwp4X8D/CP9mbTPGnhD9jr4Wa/ceO/jr4Tk8d/tLfHb9orxb8V5vDP7Kfwv1/8AaTX4pf8ACI+CPiR+Z/8AwTQ/4KdftXf8FDNK/bK/YS0/9pr/AIZF/ax/ar8b/Er9oX9kLxt8KfhlZ6d8LrbxVrfgzxhr/wAf/wBnDU7uC18Z658EPBHifQ9Kf4s+D/ir8MNF8PfGbSvi6fi38efGnxj+Jnxj8VHwj8XfnX4D/wDBJP8A4KreGP22/hP8c/27Yf2wfBviT4ia54p8HaJ8VvgP+2J8D9T/AG2/ix8QrH4DePZtG8AfCf4u+IPjD4l0Dw7rmm/CnwL4p8Q+KdY+NXjX4feBp/gN8NfHvw+8O+L734l678LPht4352nqpNRslprdqyatqlZWtez1Tv5aK2jV3d76aPRO++r33W+h/9k=',
		image_size: 'auto',
		image_position: 'right',
		image_repeat: 'repeat',
		image_rendering: 'pixelated'
	},
	avatar: {
		size: 80,
		border: { radius: '50%', width: 0, color: '#ffffff00' }
	},
	font: {
		family: 'var(--font-family)',
		color_paragraph: '#656565',
		color_heading: '#000'
	},
	spacing: { gap: 1, padding: 1 },
	widgets: {
		color_background: '#fff',
		color_background_dim: '#f2f2f2',
		background_blur: 0,
		border: { radius: 1, width: 1, color: '#999' },
		shadow: { color: '#00000001', x: 0, y: 0, blur: 10, spread: 0 }
	},
	primary_buttons: {
		color_background: '#000',
		color_on_background: '#fff',
		border: { color: '#000' },
		shadow: null
	},
	secondary_inputs: {
		color_background: '#fff',
		color_on_background: '#000',
		border: { radius: 0.5, width: 1, color: '#999' },
		shadow: null
	}
};

console.log(truc);
