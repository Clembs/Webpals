import type { PublicUser } from '$lib/db/schema/users';

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
	content_type:
		| 'spotify'
		// | 'youtube'
		// | 'soundcloud'
		// | 'tidal'
		// | 'apple-music'
		// | 'deezer'
		// | 'bandcamp'
		// | `audio/${string}`
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

export type ConnectionProvider =
	| 'bluesky'
	| 'discord'
	| 'domain'
	| 'email'
	| 'facebook'
	| 'github'
	| 'instagram'
	| 'linkedin'
	| 'phone'
	| 'pretendo'
	| 'reddit'
	| 'signal'
	| 'spotify'
	| 'steam'
	| 'twitch'
	| 'twitter'
	| 'webpals'
	| 'youtube';

export type Connection = {
	provider: ConnectionProvider;
	label?: string | null;
	identifiable: string;
	url?: string | null;
	verified: boolean;
};

export type ConnectionsWidget = BaseDefaultWidget & {
	id: 'connections';
	connections: Connection[];
};

export type DefaultWidget =
	| MusicWidget
	| AboutMeWidget
	| FriendsWidget
	| PostsWidget
	| CommentsWidget
	| ConnectionsWidget;

export type AnyWidget = DefaultWidget | CustomWidget;

export type WidgetComponentProps<T extends AnyWidget> = {
	user: PublicUser;
	widget: T;
	editing: boolean;
};
