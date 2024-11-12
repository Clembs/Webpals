type BorderProps = {
	radius: `${number}%` | number;
	width: number;
	color: string;
};

type ShadowProps = {
	color: string;
	x: number;
	y: number;
	blur: number;
	spread: number;
};

type BackgroundGradientProps = {
	type: 'gradient';
	gradient_colors: string[];
	gradient_direction?: number;
	gradient_type: 'linear' | 'radial' | 'conic';
};

type BackgroundImageProps = {
	type: 'image';
	image_url: string;
	image_position: 'center' | 'top' | 'bottom' | 'left' | 'right';
	image_size: 'cover' | 'contain';
};

type BackgroundColorProps = {
	type: 'color';
	color: string;
};

export type Theme = {
	background: BackgroundGradientProps | BackgroundImageProps | BackgroundColorProps;
	avatar: {
		size: number;
		border: BorderProps | null;
	};
	font: {
		family: string;
		color_paragraph: string;
		color_heading: string;
	};
	spacing: {
		padding: number;
		gap: number;
	};
	widgets: {
		color_background: string;
		color_background_dim: string;
		border: BorderProps;
		shadow: ShadowProps | null;
	};
	primary_buttons: {
		color_background: string;
		color_on_background: string;
		border: BorderProps;
		shadow: ShadowProps | null;
	};
	secondary_inputs: {
		color_background: string;
		color_on_background: string;
		border: BorderProps;
		shadow: ShadowProps | null;
	};
};
