import type { Actions } from './$types';
import { acceptFriendRequest } from './accept-friend-request';
import { sendFriendRequest } from './send-friend-request';

export const actions: Actions = {
	sendFriendRequest,
	acceptFriendRequest
};
