import { literal, nullable, object, parse, strictObject, string } from 'valibot';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import {
	verifyAuthenticationResponse,
	type VerifiedAuthenticationResponse
} from '@simplewebauthn/server';
import { type AuthenticationResponseJSON } from '@simplewebauthn/browser';
import { users } from '$lib/db/schema/users';
import { eq } from 'drizzle-orm';
import { createSession } from '$lib/helpers/sessions';
import type { RequestEvent } from './$types';
import { passkeys } from '$lib/db/schema/auth';

export async function verifyPasskeyChallenge({ request, url, cookies }: RequestEvent) {
	const formData = await request.formData();

	const authDataValidation = strictObject({
		login: string(),
		credential: object({
			id: string(),
			rawId: string(),
			authenticatorAttachment: nullable(string()),
			response: object({
				clientDataJSON: string(),
				authenticatorData: string(),
				signature: string(),
				userHandle: nullable(string())
			}),
			type: literal('public-key')
		})
	});

	const data = parse(authDataValidation, formData.entries());

	if (!data) {
		return fail(400, {
			message: 'Invalid request.'
		});
	}

	const user = await db.query.users.findFirst({
		where: ({ email, username }, { or, eq }) => or(eq(email, data.login), eq(username, data.login)),
		with: {
			passkeys: true
		}
	});

	if (!user || !user.passkeys.length || !user.challenge) {
		return fail(404, {
			message: 'User not found or no passkeys were found.'
		});
	}

	const passkey = user.passkeys.find((p) => p.credentialId === data.credential.id);

	if (!passkey) {
		return fail(404, {
			message: 'Passkey not found.'
		});
	}

	let verification: VerifiedAuthenticationResponse;

	try {
		verification = await verifyAuthenticationResponse({
			expectedChallenge: user.challenge,
			expectedRPID: url.hostname,
			expectedOrigin: url.origin,
			response: data.credential as AuthenticationResponseJSON,
			authenticator: {
				counter: passkey?.counter || 0,
				credentialID: passkey?.credentialId,
				credentialPublicKey: Uint8Array.from(Buffer.from(passkey?.publicKey, 'base64'))
			},
			requireUserVerification: true
		});

		if (verification.verified && verification.authenticationInfo) {
			await db.update(users).set({ challenge: null }).where(eq(users.id, user.id));

			await db.update(passkeys).set({
				counter: passkey.counter + 1
			});

			const userAgent = request.headers.get('user-agent') || '';

			await createSession(cookies, userAgent, user.id);

			return { success: true, username: user.username };
		}
	} catch (e) {
		console.error(e);
		return fail(500, { message: String(e) });
	}
}
