import type {
	AboutMeWidget,
	CommentsWidget,
	ConnectionsWidget,
	FriendsWidget,
	MusicWidget
} from './types';

export const defaultMusicWidget: MusicWidget = {
	id: 'music',
	content_url: undefined,
	content_type: undefined,
	title: undefined,
	artist: undefined,
	album_art_url: undefined
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
	id: 'connections',
	connections: []
};

export const defaultWidgets = [
	defaultMusicWidget,
	defaultAboutMeWidget,
	defaultFriendsWidget,
	defaultCommentsWidget,
	defaultConnectionsWidget
];
