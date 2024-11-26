import type { PublicUser } from '$lib/db/schema/users';

export type BaseDefaultWidget = {
	id: string;
	position: number;
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
	content_url: string | undefined | null;
	content_type:
		| 'spotify'
		| 'youtube'
		| 'soundcloud'
		| 'tidal'
		| 'apple-music'
		| 'deezer'
		| 'bandcamp'
		| `audio/${string}`
		| undefined
		| null;
	title: string | undefined | null;
	artist: string | undefined | null;
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
	| 'twitter'
	| 'bluesky'
	| 'discord'
	| 'email'
	| 'domain'
	| 'github'
	| 'islands'
	| 'youtube'
	| 'steam'
	| 'pretendo'
	| (string & {});

export type Connection = {
	provider: ConnectionProvider;
	identifiable: string;
	verified: boolean;
	url?: string;
};

export type ConnectionsWidget = BaseDefaultWidget & {
	id: 'connections';
	connections: Connection[];
};

export type AnyWidget =
	| MusicWidget
	| AboutMeWidget
	| FriendsWidget
	| PostsWidget
	| CommentsWidget
	| ConnectionsWidget
	| CustomWidget;

export type WidgetComponentProps<T extends AnyWidget> = {
	user: PublicUser;
	widget: T;
	editing: boolean;
};
