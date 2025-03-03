import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { EMAIL_REGEX } from 'valibot';
import { db } from '$lib/db';
import { _getValidInviteCode } from '../verify-invite-code/+page.server';
import { inviteCodes } from '$lib/db/schema/auth';
import { count, eq } from 'drizzle-orm';
import { profiles, USERNAME_REGEX } from '$lib/db/schema/profiles';
import { DISCORD_WEBHOOK_URL } from '$env/static/private';
import { PUBLIC_STORAGE_BASE_URL } from '$env/static/public';

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
	async verifyOTP({ locals: { supabase }, cookies, request, fetch, url }) {
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

		const { data, error } = await supabase.auth.verifyOtp({
			email,
			type: 'email',
			token: otp
		});

		if (!data || !data.user || error) {
			return fail(400, {
				message: 'Invalid or expired OTP. Please check your email and try again.'
			});
		}

		// insert the profile
		await db.insert(profiles).values({
			id: data.user.id,
			username
		});

		// mark the invite code as claimed
		await db
			.update(inviteCodes)
			.set({
				claimedById: data.user.id,
				claimedAt: new Date()
			})
			.where(eq(inviteCodes.code, inviteCodeCookie));

		// delete the invite code cookie
		cookies.delete('invite-code', {
			path: '/'
		});

		const [{ count: profileCount }] = await db
			.select({
				count: count()
			})
			.from(profiles);

		const ordinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
		const ordinals = new Map([
			['one', 'st'],
			['two', 'nd'],
			['few', 'rd'],
			['other', 'th']
		]);
		const ordinal = ordinals.get(ordinalRules.select(profileCount));

		// post to the community's discord webhook
		await fetch(DISCORD_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				embeds: [
					{
						title: `${username} joined Webpals!`,
						url: `${url.origin}/${username}`,
						description: `Welcome to the community, ${username}.\nYou're the ${profileCount}${ordinal} member to join Webpals!`,
						color: 0xffffff,
						timestamp: new Date().toISOString(),
						thumbnail: {
							url: `${PUBLIC_STORAGE_BASE_URL}/static/logo-simplified.png`
						}
					}
				]
			})
		});

		redirect(302, `/${username}`);
	}
};
