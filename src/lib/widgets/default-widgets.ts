import type {
	AboutMeWidget,
	CommentsWidget,
	ConnectionsWidget,
	FriendsWidget,
	MusicWidget
} from './types';

export const defaultMusicWidget: MusicWidget = {
	id: 'music',
	position: 1,
	content_url: null,
	content_type: null,
	title: null,
	artist: null
};

export const defaultAboutMeWidget: AboutMeWidget = {
	id: 'about_me',
	content: 'Hello, Islands!',
	position: 1
};

export const defaultFriendsWidget: FriendsWidget = {
	id: 'friends',
	position: 2
};

export const defaultCommentsWidget: CommentsWidget = {
	id: 'comments',
	position: 3
};

export const defaultConnectionsWidget: ConnectionsWidget = {
	id: 'connections',
	connections: [],
	position: 4
};

export const defaultWidgets = [
	defaultMusicWidget,
	defaultAboutMeWidget,
	defaultFriendsWidget,
	defaultCommentsWidget,
	defaultConnectionsWidget
];
