import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/db';
import { eq, or, sql } from 'drizzle-orm';
import { EMAIL_REGEX } from 'valibot';
import { profiles, USERNAME_REGEX } from '$lib/db/schema/users';
import { authUsers } from 'drizzle-orm/supabase';

// This function:
// Checks if the user exists (if not, onboard them)
// Checks if the user has a passkey & the browser supports them
// - If true, generates a challenge for the user to log in
// - Otherwise, generate an OTP and email it
export async function handleAuthFlow({ request, locals: { supabase } }: RequestEvent) {
	const formData = await request.formData();
	const login = formData?.get('login')?.toString();

	if (!login || !(EMAIL_REGEX.test(login) || USERNAME_REGEX.test(login))) {
		return fail(400, {
			message: 'Invalid email address or username.'
		});
	}

	const [user] = await db
		.select({
			username: profiles.username,
			email: authUsers.email
		})
		.from(authUsers)
		.leftJoin(profiles, eq(profiles.id, authUsers.id))
		.where(
			or(eq(sql`LOWER(${profiles.username})`, login.toLowerCase()), eq(authUsers.email, login))
		);

	// If the user is not found, register them
	if (!user) {
		if (EMAIL_REGEX.test(login)) {
			redirect(307, `/register?email=${login}`);
		} else {
			redirect(307, `/register?username=${login}`);
		}
	}

	// const browserSupportsPasskeys = formData.get('browserSupportsPasskeys') === 'true';
	// const userHasPasskeys = user.passkeys.length > 0;

	// If the user has passkeys and the browser supports them, generate a challenge
	// if (browserSupportsPasskeys && userHasPasskeys) {
	// const options = await generateAuthenticationOptions({
	// 	rpID: url.hostname,
	// 	allowCredentials: user.passkeys.map((p) => ({
	// 		id: p.credentialId
	// 	})),
	// 	timeout: 60000,
	// 	userVerification: 'preferred'
	// });

	// await db
	// 	.update(profiles)
	// 	.set({
	// 		challenge: options.challenge,
	// 		challengeExpiresAt: new Date(Date.now() + options.timeout!)
	// 	})
	// 	.where(eq(profiles.id, user.id));

	// return {
	// 	authType: 'webauthn',
	// 	...options
	// };
	// } else {

	const { data, error } = await supabase.auth.signInWithOtp({
		email: user.email!,
		options: {
			shouldCreateUser: false
		}
	});

	console.log(user, data, error);

	if (!data || error) {
		// If the login is invalid, suggest the user to register
		if (!USERNAME_REGEX.test(login) && !EMAIL_REGEX.test(login)) {
			redirect(307, '/register');
		}

		return fail(400, {
			message: 'Error sending OTP. Please try again later.'
		});
	}

	redirect(303, `/login/verify-otp?login=${login}`);
	// }
}
