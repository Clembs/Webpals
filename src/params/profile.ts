import { USERNAME_REGEX } from '$lib/helpers/constants';

export function match(param) {
	return USERNAME_REGEX.test(param);
}
