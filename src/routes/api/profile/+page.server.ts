import type { Actions } from './$types';
import { addWidget } from './add-widget';
import { createConnection } from './create-connection';
import { deleteConnection } from './delete-connection';
import { deleteWidget } from './delete-widget';
import { editAboutMe } from './edit-about-me';
import { editConnection } from './edit-connection';
import { editCustomWidget } from './edit-custom-widget';
import { setExternalMusic } from './set-external-music';
import { editProfile } from './edit-profile';
import { editTheme } from './edit-theme';
import { updateWidgetPosition } from './update-widget-position';
import { setLocalMusic } from './set-local-music';

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
