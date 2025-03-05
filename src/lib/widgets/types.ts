import type { Profile } from '$lib/db/types';
import type { MusicProvider } from '$lib/helpers/music';

export type BaseDefaultWidget = {
	id: string;
};

export type CustomWidget = BaseDefaultWidget & {
	blocks: AnyBlock[];
};

export type Block = {
	json_endpoint?: string;
};

export type TextBlock = Block & {
	type: 'text';
	content: string;
	editable?: boolean;
	text_type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'paragraph' | 'subtext';
};

export type LayoutBlock = Block & {
	type: 'layout';
	blocks: AnyBlock[];
};

export type KeyValueBlock = Block & {
	type: 'key_value';
	key: string;
	value: string;
};

export type AnyBlock = TextBlock | LayoutBlock | KeyValueBlock;

export type MusicWidget = BaseDefaultWidget & {
	id: 'music';
	content_url: string | null;
	provider:
		| MusicProvider
		// | 'youtube'
		// | 'soundcloud'
		// | 'tidal'
		// | 'apple-music'
		// | 'deezer'
		// | 'bandcamp'
		| null;
	title: string | null;
	artist: string | null;
	album_art_url: string | null;
	external_url: string | null;
};

export type AboutMeWidget = BaseDefaultWidget & {
	id: 'about_me';
	content: string;
};

export type FriendsWidget = BaseDefaultWidget & {
	id: 'friends';
};

export type PostsWidget = BaseDefaultWidget & {
	id: 'posts';
};

export type CommentsWidget = BaseDefaultWidget & {
	id: 'comments';
};

export const connectionProviderKeys = [
	'bluesky',
	'discord',
	'domain',
	'email',
	'facebook',
	'github',
	'instagram',
	'kofi',
	'lastfm',
	'linkedin',
	'mastodon',
	'patreon',
	// 'pixelfed',
	'phone',
	'pretendo',
	'reddit',
	'signal',
	'spotify',
	'startgg',
	'steam',
	'threads',
	'twitch',
	'twitter',
	'webpals',
	'youtube'
] as const;

export type ConnectionProvider = (typeof connectionProviderKeys)[number];

export type ConnectionsWidget = BaseDefaultWidget & {
	id: 'connections';
};

export type ClockWidget = BaseDefaultWidget & {
	timezone: string;
	show_seconds: boolean;
	hour_format: '12h' | '24h';
	city: string;
	country: string;
};

export type DefaultWidget =
	| MusicWidget
	| AboutMeWidget
	| FriendsWidget
	| PostsWidget
	| CommentsWidget
	| ConnectionsWidget
	| ClockWidget;

export type AnyWidget = DefaultWidget | CustomWidget;

export type WidgetComponentProps<T extends AnyWidget> = {
	profile?: Profile;
	widget: T;
	editing: boolean;
};
