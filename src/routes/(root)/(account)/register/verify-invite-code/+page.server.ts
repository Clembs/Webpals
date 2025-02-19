import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { USERNAME_REGEX } from '$lib/db/schema/profiles';

export const load: PageServerLoad = async ({ url }) => {
	const username = url.searchParams.get('username')?.toString();

	if (!username || !USERNAME_REGEX.test(username)) {
		throw redirect(302, '/register');
	}
};

export async function _getValidInviteCode(inputCode: string) {
	const dbInviteCode = await db.query.inviteCodes.findFirst({
		where: ({ code, claimedAt }, { isNull, eq, and }) => and(eq(code, inputCode), isNull(claimedAt))
	});

	return dbInviteCode;
}

export const actions: Actions = {
	async validateInviteCode({ request, cookies }) {
		const formData = await request.formData();
		const originUrl = new URL(request.headers.get('referer')!);

		if (!originUrl) {
			return fail(400, {
				message: 'Invalid request.'
			});
		}
		const username = originUrl.searchParams.get('username')?.toString();
		const email = originUrl.searchParams.get('email')?.toString();
		const inputCode = formData.get('invite-code')?.toString();

		if (!inputCode) {
			return fail(400, {
				message: 'Invalid invite code. Check the requirements and try again.'
			});
		}

		const inviteCode = await _getValidInviteCode(inputCode);

		if (!inviteCode) {
			return fail(404, {
				message: 'Cannot find this invite code. Try again with a valid code.'
			});
		}

		if (!username || !USERNAME_REGEX.test(username)) {
			return fail(400, {
				message: 'Your username was changed and is invalid. Go back and try again.'
			});
		}

		cookies.set('invite-code', inviteCode.code, {
			path: '/',
			httpOnly: true
		});

		redirect(307, `/register/email-input?username=${username}${email ? `&email=${email}` : ''}`);
	}
};
