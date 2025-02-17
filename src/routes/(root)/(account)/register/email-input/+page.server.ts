import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { EMAIL_REGEX } from 'valibot';
import { db } from '$lib/db';
import { _getValidInviteCode } from '../verify-invite-code/+page.server';
import { authUsers } from 'drizzle-orm/supabase';
import { eq } from 'drizzle-orm';
import { USERNAME_REGEX } from '$lib/db/schema/users';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const username = url.searchParams.get('username')?.toString();

	if (!username || !USERNAME_REGEX.test(username)) {
		redirect(302, '/register');
	}

	const inviteCodeCookie = cookies.get('invite-code');

	if (!inviteCodeCookie || !(await _getValidInviteCode(inviteCodeCookie))) {
		redirect(302, '/register');
	}
};

export const actions: Actions = {
	async validateEmail({ locals: { supabase }, request }) {
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

		const [userWithEmail] = await db.select().from(authUsers).where(eq(authUsers.email, email));

		if (userWithEmail) {
			return fail(400, {
				message: `A user already exists with this email address. If you meant to login, please go back.`
			});
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true
			}
		});

		if (error) {
			return fail(400, {
				message: 'Error sending OTP. Please try again later.'
			});
		}

		redirect(302, `/register/verify-otp?username=${username}&email=${email}`);
	}
};
