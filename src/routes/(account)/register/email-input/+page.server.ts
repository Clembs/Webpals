import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { EMAIL_REGEX } from 'valibot';
import { USERNAME_REGEX } from '$lib/helpers/constants';
import { sendEmail } from '$lib/helpers/email';
import { db } from '$lib/db';
import { authCodes } from '$lib/db/schema/auth';
import { randomInt } from 'crypto';

export const load: PageServerLoad = async ({ url }) => {
	const username = url.searchParams.get('username')?.toString();

	if (!username || !USERNAME_REGEX.test(username)) {
		throw redirect(302, '/register');
	}
};

export const actions: Actions = {
	async validateEmail({ request, fetch }) {
		const formData = await request.formData();
		const originUrl = new URL(request.headers.get('referer')!);

		if (!originUrl) {
			return fail(400, {
				message: 'Invalid request.'
			});
		}

		const username = originUrl.searchParams.get('username')?.toString();
		const email = formData.get('email')?.toString();

		if (!email || !EMAIL_REGEX.test(email)) {
			return fail(400, {
				message: 'Invalid email address. Check the requirements and try again.'
			});
		}

		if (!username || !USERNAME_REGEX.test(username)) {
			return fail(400, {
				message: 'Your username was changed and is invalid. Go back and try again.'
			});
		}

		const [{ code }] = await db
			.insert(authCodes)
			.values({
				code: randomInt(0, 999999).toString().padStart(6, '0'),
				email,
				expiresAt: new Date(Date.now() + 10 * 60 * 1000)
			})
			.returning();

		await sendEmail({
			address: email,
			subject: 'Islands Email Verification',
			bodyHTML: `
				<p>Enter the code below on the website to verify your email address and continue with your registration:</p>
				<h1>${code}</h1>
							`,
			fetch
		});

		throw redirect(302, `/register/verify-otp?username=${username}&email=${email}`);
	}
};
