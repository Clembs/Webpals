import { USERNAME_REGEX } from '$lib/db/schema/profiles';

export function match(param) {
	return USERNAME_REGEX.test(param);
}
