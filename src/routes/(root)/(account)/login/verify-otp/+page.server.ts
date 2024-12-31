import { db } from '$lib/db';
import { USERNAME_REGEX } from '$lib/helpers/constants';
import { createSession } from '$lib/helpers/sessions';
import { EMAIL_REGEX } from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { authCodes } from '$lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { login } = await parent();

	if (!login) redirect(302, '/login');

	return { login };
};

export const actions: Actions = {
	// TODO
	async resendOTP() {},
	async verifyOTP({ cookies, request }) {
		const formData = await request.formData();
		const originUrl = new URL(request.headers.get('referer')!);

		const login = originUrl.searchParams.get('login')?.toString();
		const otp = formData.get('otp')?.toString();

		if (!otp || !/\d{6}$/.test(otp)) {
			return fail(400, {
				message: 'Invalid OTP. It must be a 6-digit number.'
			});
		}

		if (!login || (!EMAIL_REGEX.test(login) && !USERNAME_REGEX.test(login))) {
			return fail(400, {
				message: 'Invalid email address or username. Go back and try again.'
			});
		}

		const user = await db.query.users.findFirst({
			where: ({ email, username }, { or, eq }) => or(eq(email, login), eq(username, login))
		});

		if (!user) {
			if (EMAIL_REGEX.test(login) || USERNAME_REGEX.test(login)) {
				throw redirect(
					307,
					USERNAME_REGEX.test(login) ? `/register?username=${login}` : `/register?email=${login}`
				);
			} else {
				throw fail(400, {
					message: 'Invalid email address or username. Go back and try again.'
				});
			}
		}

		const code = await db.query.authCodes.findFirst({
			where: ({ code, email: dbEmail }, { eq, and }) => and(eq(code, otp), eq(dbEmail, user?.email))
		});

		if (!code || code.expiresAt < new Date()) {
			return fail(400, {
				message: 'Invalid or expired OTP. Please check your email and try again.'
			});
		}

		await db.delete(authCodes).where(eq(authCodes.id, code.id));

		const userAgent = request.headers.get('user-agent') || '';

		await createSession(cookies, userAgent, user.id);

		throw redirect(302, `/${user.username}`);
	}
};
