import type { Actions } from './$types';
import { deleteAllNotifications } from './delete-all-notifications';
import { deleteNotification } from './delete-notification';
import { markAllAsRead } from './mark-all-as-read';

export const actions: Actions = {
	markAllAsRead,
	deleteNotification,
	deleteAllNotifications
};
