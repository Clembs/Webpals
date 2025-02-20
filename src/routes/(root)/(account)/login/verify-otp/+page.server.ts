import { db } from '$lib/db';
import { EMAIL_REGEX } from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { eq, or, sql } from 'drizzle-orm';
import { profiles, USERNAME_REGEX } from '$lib/db/schema/profiles';
import type { User } from '@supabase/supabase-js';
import { authUsers } from 'drizzle-orm/supabase';

export const load: PageServerLoad = async ({ parent }) => {
	const { login } = await parent();

	if (!login) redirect(302, '/login');

	return { login };
};

export const actions: Actions = {
	// TODO
	async resendOTP() {},
	async verifyOTP({ locals: { supabase }, request }) {
		const formData = await request.formData();
		const originUrl = new URL(request.headers.get('referer')!);

		const login = originUrl.searchParams.get('login')?.toString();
		const otp = formData.get('otp')?.toString();
		const loginType: 'email' | 'username' | undefined = login
			? EMAIL_REGEX.test(login)
				? 'email'
				: USERNAME_REGEX.test(login)
					? 'username'
					: undefined
			: undefined;

		if (!otp || !/\d{6}$/.test(otp)) {
			return fail(400, {
				message: 'Invalid OTP. It must be a 6-digit number.'
			});
		}

		if (!login || !loginType) {
			return fail(400, {
				message: 'Invalid email address or username. Go back and try again.'
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

		if (!user) {
			if (loginType) {
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

		const { data, error } = await supabase.auth.verifyOtp({
			email: user.email!,
			type: 'email',
			token: otp
		});

		if (!data || !data.user || error) {
			return fail(400, {
				message: 'Invalid or expired OTP. Please check your email and try again.'
			});
		}

		redirect(302, `/${user.username!}`);
	}
};
