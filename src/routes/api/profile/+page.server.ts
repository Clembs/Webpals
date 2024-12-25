import type { Actions } from './$types';
import { addWidget } from './add-widget';
import { createConnection } from './create-connection';
import { deleteConnection } from './delete-connection';
import { deleteWidget } from './delete-widget';
import { editAboutMe } from './edit-about-me';
import { editConnection } from './edit-connection';
import { editCustomWidget } from './edit-custom-widget';
import { editMusic } from './edit-music';
import { editProfile } from './edit-profile';
import { updateWidgetPosition } from './update-widget-position';

export const actions: Actions = {
	// profile
	editProfile,

	// basic widget stuff
	addWidget,
	updateWidgetPosition,
	deleteWidget,

	// edit widgets
	editAboutMe,
	editMusic,
	editCustomWidget,

	// connections
	createConnection,
	editConnection,
	deleteConnection
};
