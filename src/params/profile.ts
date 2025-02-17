import { USERNAME_REGEX } from '$lib/db/schema/users';

export function match(param) {
	return USERNAME_REGEX.test(param);
}
