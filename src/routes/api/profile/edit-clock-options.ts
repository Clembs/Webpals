import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { type RequestEvent, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function editClockOptions({ locals: { getCurrentProfile }, request }: RequestEvent) {
	const currentProfile = getCurrentProfile();

	if (!currentProfile) redirect(302, '/login');

	const formData = await request.formData();

	const isTwentyFourHourFormat = formData.get('24-hour-format')?.toString();
	const showSecondsRaw = formData.get('show-seconds')?.toString();

	console.log({ isTwentyFourHourFormat, showSecondsRaw });

	const hourFormat = isTwentyFourHourFormat === 'on' ? '24h' : '12h';
	const showSeconds = showSecondsRaw === 'on';

	console.log({ hourFormat, showSeconds });
	await db
		.update(profiles)
		.set({
			widgets: currentProfile.widgets.map((column) =>
				column.map((w) => {
					if (w.id === 'clock') {
						return {
							...w,
							hour_format: hourFormat,
							show_seconds: showSeconds
						};
					}
					return w;
				})
			)
		})
		.where(eq(profiles.id, currentProfile.id));

	return {};
}
