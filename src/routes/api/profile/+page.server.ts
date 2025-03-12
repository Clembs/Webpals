import type { Actions } from './$types';
import { addWidget } from './add-widget';
import { createConnection } from './create-connection';
import { deleteConnection } from './delete-connection';
import { deleteWidget } from './delete-widget';
import { editAboutMe } from './edit-about-me';
import { editClockTimezone } from './edit-clock-timezone';
import { editConnection } from './edit-connection';
import { editCustomWidget } from './edit-custom-widget';
import { setExternalMusic } from './set-external-music';
import { editProfile } from './edit-profile';
import { editTheme } from './edit-theme';
import { updateWidgetPosition } from './update-widget-position';
import { setLocalMusic } from './set-local-music';
import { editClockOptions } from './edit-clock-options';

export const actions: Actions = {
	// profile
	editProfile,

	// basic widget stuff
	addWidget,
	updateWidgetPosition,
	deleteWidget,

	// edit widgets
	editAboutMe,
	editCustomWidget,

	// clock
	editClockTimezone,
	editClockOptions,

	// music
	setExternalMusic,
	setLocalMusic,

	// connections
	createConnection,
	editConnection,
	deleteConnection,

	// theme
	editTheme
};
