import { USERNAME_REGEX } from '$lib/helpers/constants';
import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { users } from '$lib/db/schema/users';
import { eq, sql } from 'drizzle-orm';
import { randomInt } from 'crypto';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { EMAIL_REGEX } from 'valibot';
import { sendEmail } from '$lib/helpers/email';
import { authCodes } from '$lib/db/schema/auth';

// This function:
// Checks if the user exists (if not, onboard them)
// Checks if the user has a passkey & the browser supports them
// - If true, generates a challenge for the user to log in
// - Otherwise, generate an OTP and email it
export async function handleAuthFlow({ request, url }: RequestEvent) {
	const formData = await request.formData();
	const login = formData?.get('login')?.toString();

	if (!login || !(EMAIL_REGEX.test(login) || USERNAME_REGEX.test(login))) {
		return fail(400, {
			message: 'Invalid email address or username.'
		});
	}

	const user = await db.query.users.findFirst({
		where: ({ email, username }, { or, eq }) =>
			or(eq(email, login), eq(sql`LOWER(${username})`, login.toLowerCase())),
		with: {
			passkeys: true
		}
	});

	// If the user is not found, register them
	if (!user) {
		if (EMAIL_REGEX.test(login)) {
			redirect(307, `/register?email=${login}`);
		} else {
			redirect(307, `/register?username=${login}`);
		}
	}

	const browserSupportsPasskeys = formData.get('browserSupportsPasskeys') === 'true';
	const userHasPasskeys = user.passkeys.length > 0;

	// If the user has passkeys and the browser supports them, generate a challenge
	if (browserSupportsPasskeys && userHasPasskeys) {
		const options = await generateAuthenticationOptions({
			rpID: url.hostname,
			allowCredentials: user.passkeys.map((p) => ({
				id: p.credentialId
			})),
			timeout: 60000,
			userVerification: 'preferred'
		});

		await db
			.update(users)
			.set({
				challenge: options.challenge,
				challengeExpiresAt: new Date(Date.now() + options.timeout!)
			})
			.where(eq(users.id, user.id));

		return {
			authType: 'webauthn',
			...options
		};
	} else {
		// Generate an OTP and email it
		const authCode = randomInt(0, 999999).toString().padStart(6, '0');
		const expiresAt = new Date(Date.now() + 60000 * 10); // 10 minutes

		const [{ code }] = await db
			.insert(authCodes)
			.values({ email: user.email, code: authCode, expiresAt: expiresAt })
			.returning();

		await sendEmail({
			address: user.email,
			subject: 'Your Islands one-time password',
			bodyHTML: `
				<p>Enter the code below on the website to login to Islands:</p>
				<h1>${code}</h1>
							`,
			fetch
		});

		// If the login is invalid, suggest the user to register
		if (!USERNAME_REGEX.test(login) && !EMAIL_REGEX.test(login)) {
			redirect(307, '/register');
		}

		redirect(303, `/login/verify-otp?login=${user.email}`);
	}
}
