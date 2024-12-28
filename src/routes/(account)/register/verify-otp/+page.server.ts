import { USERNAME_REGEX } from '$lib/helpers/constants';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { EMAIL_REGEX } from 'valibot';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { generateSnowflake } from '$lib/helpers/users';
import { createSession } from '$lib/helpers/sessions';
import { _getValidInviteCode } from '../verify-invite-code/+page.server';
import { inviteCodes } from '$lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const username = url.searchParams.get('username')?.toString();
	const email = url.searchParams.get('email')?.toString();

	if (!username || !USERNAME_REGEX.test(username)) {
		throw redirect(302, '/register');
	}

	if (!email || !EMAIL_REGEX.test(email)) {
		throw redirect(302, `/register/email-input?username=${username}`);
	}
};

export const actions: Actions = {
	// TODO
	async resendOTP() {},
	async verifyOTP({ cookies, request }) {
		const formData = await request.formData();
		const originUrl = new URL(request.headers.get('referer')!);

		const username = originUrl.searchParams.get('username')?.toString();
		const email = originUrl.searchParams.get('email')?.toString();
		const otp = formData.get('otp')?.toString();

		if (!otp || !/\d{6}$/.test(otp)) {
			return fail(400, {
				message: 'Invalid OTP. It must be a 6-digit number.'
			});
		}

		if (!username || !USERNAME_REGEX.test(username)) {
			return fail(400, {
				message: 'Your username was changed and is invalid. Go back and try again.'
			});
		}

		if (!email || !EMAIL_REGEX.test(email)) {
			return fail(400, {
				message: 'Invalid email address. Check the requirements and try again.'
			});
		}

		const inviteCodeCookie = cookies.get('invite-code');

		if (!inviteCodeCookie || !_getValidInviteCode(inviteCodeCookie)) {
			return fail(400, {
				message: "Missing an invite code, or it's invalid. Go back and try again."
			});
		}

		const code = await db.query.authCodes.findFirst({
			where: ({ code, email: dbEmail }, { eq, and }) => and(eq(code, otp), eq(dbEmail, email))
		});

		if (!code || code.expiresAt < new Date()) {
			return fail(400, {
				message: 'Invalid or expired OTP. Please check your email and try again.'
			});
		}

		const [newUser] = await db
			.insert(users)
			.values({
				id: generateSnowflake(),
				email,
				username
			})
			.returning();

		// mark the invite code as claimed
		await db
			.update(inviteCodes)
			.set({
				status: 'claimed'
			})
			.where(eq(inviteCodes.code, inviteCodeCookie));

		const userAgent = request.headers.get('user-agent') || '';

		await createSession(cookies, userAgent, newUser.id);

		throw redirect(302, `/${username}`);
	}
};
