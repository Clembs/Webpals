import type { Actions } from './$types';
import { addWidget } from './add-widget';
import { createConnection } from './create-connection';
import { deleteWidget } from './delete-widget';
import { editAboutMe } from './edit-about-me';
import { editCustomWidget } from './edit-custom-widget';
import { editProfile } from './edit-profile';

export const actions: Actions = {
	editAboutMe,
	editProfile,
	createConnection,
	editCustomWidget,
	deleteWidget,
	addWidget
};
