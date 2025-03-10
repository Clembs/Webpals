import type {
	AboutMeWidget,
	ClockWidget,
	CommentsWidget,
	ConnectionsWidget,
	AnyDefaultWidget,
	FriendsWidget,
	MusicWidget
} from './types';
import { findFromCityStateProvince, lookupViaCity } from 'city-timezones';
import type { FullProfile } from '$lib/db/types';
import type { MaybePromise } from 'valibot';

export type WidgetSpawnProps = {
	clientAddress: string;
	profile: FullProfile;
};

export type DefaultWidgetInfo<T extends AnyDefaultWidget, NoSpawnProps extends boolean = true> = {
	id: string;
	label: string;
	description: string;
	amountAllowedAtOnce?: 1 | 'multiple' | undefined;
	generateDefault: NoSpawnProps extends true
		? () => T
		: (props: WidgetSpawnProps) => MaybePromise<T>;
};

export const defaultMusicWidget: DefaultWidgetInfo<MusicWidget> = {
	id: 'music',
	label: 'Music',
	description: 'TODO',
	amountAllowedAtOnce: 1,
	generateDefault: () => ({
		id: 'music',
		content_url: null,
		provider: null,
		title: null,
		artist: null,
		album_art_url: null,
		external_url: null
	})
};

export const defaultAboutMeWidget: DefaultWidgetInfo<AboutMeWidget> = {
	id: 'about_me',
	label: 'About me',
	description: 'TOOD',
	generateDefault: () => ({
		id: 'about_me',
		content: 'Hello, Webpals!'
	})
};

export const defaultFriendsWidget: DefaultWidgetInfo<FriendsWidget> = {
	id: 'friends',
	label: 'Friends',
	description: '',
	generateDefault: () => ({
		id: 'friends'
	})
};

export const defaultCommentsWidget: DefaultWidgetInfo<CommentsWidget> = {
	id: 'comments',
	label: 'Comments',
	description: '',
	generateDefault: () => ({
		id: 'comments'
	})
};

export const defaultConnectionsWidget: DefaultWidgetInfo<ConnectionsWidget> = {
	id: 'connections',
	label: 'Connections',
	description: '',
	generateDefault: () => ({
		id: 'connections'
	})
};

export const defaultClockWidget: DefaultWidgetInfo<ClockWidget, false> = {
	id: 'clock',
	label: 'Clock',
	description: '',
	generateDefault: async ({ clientAddress }) => {
		const defaultNonPersonalizedClock: ClockWidget = {
			id: 'clock',
			city: 'Unknown',
			country: 'Unknown',
			hour_format: '24h',
			show_seconds: false,
			timezone: 'Europe/Paris'
		};

		if (!clientAddress || clientAddress === '::1') {
			return defaultNonPersonalizedClock;
		}

		const ipLookup = await import('geoip-lite2').then((m) => m.lookup);

		const ipInfo = ipLookup(clientAddress);

		if (!ipInfo) {
			return defaultNonPersonalizedClock;
		}

		const timezoneCity = ipInfo?.timezone.split('/')[1];
		const [{ city, country }] = findFromCityStateProvince(timezoneCity);

		return {
			id: 'clock',
			city,
			country,
			hour_format: '24h',
			show_seconds: false,
			timezone: ipInfo.timezone
		};
	}
};

export const defaultWidgets: DefaultWidgetInfo<AnyDefaultWidget, boolean>[] = [
	defaultMusicWidget,
	defaultAboutMeWidget,
	defaultFriendsWidget,
	defaultCommentsWidget,
	defaultConnectionsWidget,
	defaultClockWidget
];
