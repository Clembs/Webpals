import { db } from '$lib/db';
import { sessions, type Session } from '$lib/db/schema/auth';
import type { Cookies } from '@sveltejs/kit';

export async function createSession(cookies: Cookies, userAgent: string, userId: string) {
	// Expire the session in 30 days
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	let deviceType: Session['deviceType'];

	const browser = userAgent.match(/(edg|firefox|msie|chrome|safari|trident)/i);
	const os = userAgent.match(/(windows|mac|linux|android|iphone|ipad)/i);
	let browserName = 'Unknown';
	let osName = 'Unknown';

	switch (browser?.[0].toLowerCase()) {
		case 'edg':
			browserName = 'Edge';
			break;
		case 'firefox':
			browserName = 'Firefox';
			break;
		case 'msie':
			browserName = 'Internet Explorer';
			break;
		case 'chrome':
			browserName = 'Chrome';
			break;
		case 'safari':
			browserName = 'Safari';
			break;
		case 'trident':
			browserName = 'Internet Explorer';
			break;
		default:
			browserName = 'Unknown';
	}

	switch (os?.[0].toLowerCase()) {
		case 'android':
			osName = 'Android';
			deviceType = 'mobile';
			break;
		case 'iphone':
			osName = 'iOS';
			deviceType = 'mobile';
			break;
		case 'ipad':
			osName = 'iOS';
			deviceType = 'mobile';
			break;
		case 'linux':
			osName = 'Linux';
			deviceType = 'desktop';
			break;
		case 'windows':
			osName = 'Windows';
			deviceType = 'desktop';
			break;
		case 'mac':
			osName = 'Mac';
			deviceType = 'desktop';
			break;
		default:
			osName = 'Unknown';
			deviceType = 'other';
	}

	const [session] = await db
		.insert(sessions)
		.values({
			name: `${browserName} on ${osName}`,
			userId,
			deviceType,
			expiresAt
		})
		.returning();

	cookies.set('sessionId', session.id, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		priority: 'high',
		expires: expiresAt
	});
}
