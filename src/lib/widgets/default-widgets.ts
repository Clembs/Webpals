import type {
	AboutMeWidget,
	CommentsWidget,
	ConnectionsWidget,
	FriendsWidget,
	MusicWidget
} from './types';

export const defaultMusicWidget: MusicWidget = {
	id: 'music',
	content_url: null,
	content_type: null,
	title: null,
	artist: null,
	album_art_url: null,
	external_url: null
};

export const defaultAboutMeWidget: AboutMeWidget = {
	id: 'about_me',
	content: 'Hello, Webpals!'
};

export const defaultFriendsWidget: FriendsWidget = {
	id: 'friends'
};

export const defaultCommentsWidget: CommentsWidget = {
	id: 'comments'
};

export const defaultConnectionsWidget: ConnectionsWidget = {
	id: 'connections'
};

export const defaultWidgets = [
	defaultMusicWidget,
	defaultAboutMeWidget,
	defaultFriendsWidget,
	defaultCommentsWidget,
	defaultConnectionsWidget
];
