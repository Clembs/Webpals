import type { Actions } from './$types';
import { deleteWidget } from './delete-widget';
import { editAboutMe } from './edit-about-me';
import { editCustomWidget } from './edit-custom-widget';
import { editProfile } from './edit-profile';

export const actions: Actions = {
	editAboutMe,
	editProfile,
	editCustomWidget,
	deleteWidget
};
