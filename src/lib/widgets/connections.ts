// note: some of the more complex regex has been AI-generated and im kind of ashamed of myself but regex is kinda hard and i mean ive tested a few edge cases for each and they work fine.
// if you're a regex wizard reading this and something doesn't work, help me by submitting an issue.

import type { ConnectionProvider } from './types';
import { Envelope, Globe, Island, Phone, type IconContextProps } from 'phosphor-svelte';
import DiscordLogo from '$icons/brands/DiscordLogo.svelte';
import { EMAIL_REGEX } from 'valibot';
import PretendoLogo from '$icons/brands/PretendoLogo.svelte';
import BlueskyLogo from '$icons/brands/BlueskyLogo.svelte';
import XLogo from '$icons/brands/XLogo.svelte';
import SteamLogo from '$icons/brands/SteamLogo.svelte';
import YouTubeLogo from '$icons/brands/YouTubeLogo.svelte';
import GitHubLogo from '$icons/brands/GitHubLogo.svelte';
import FacebookLogo from '$icons/brands/FacebookLogo.svelte';
import RedditLogo from '$icons/brands/RedditLogo.svelte';
import SignalLogo from '$icons/brands/SignalLogo.svelte';
import SpotifyLogo from '$icons/brands/SpotifyLogo.svelte';
import TwitchLogo from '$icons/brands/TwitchLogo.svelte';
import InstagramLogo from '$icons/brands/InstagramLogo.svelte';
import LinkedInLogo from '$icons/brands/LinkedInLogo.svelte';
import KoFiLogo from '$icons/brands/KoFiLogo.svelte';
import LastFmLogo from '$icons/brands/LastFmLogo.svelte';
import MastodonLogo from '$icons/brands/MastodonLogo.svelte';
import PatreonLogo from '$icons/brands/PatreonLogo.svelte';
import StartGgLogo from '$icons/brands/StartGgLogo.svelte';
import ThreadsLogo from '$icons/brands/ThreadsLogo.svelte';
import { USERNAME_REGEX } from '$lib/db/schema/users';

export const connectionProviders: Record<
	ConnectionProvider,
	{
		name: string;
		icon: typeof Globe | typeof DiscordLogo;
		iconProps?: IconContextProps['values'];
		identifiablePattern?: RegExp; // the regex pattern to match the identifiable part of the connection
		identifiablePlaceholder?: string; // the placeholder for the identifiable input
		identifiablePrefix?: string;
		hasUrl: boolean; // true the connection links to a webpage, false if it's just text
		verifiable: boolean; // whether the connection can be oauth verified
	}
> = {
	bluesky: {
		name: 'Bluesky',
		icon: BlueskyLogo,
		// works for domain names, DID PLC identities and Web DID identities.
		identifiablePattern:
			// wrote this regex myself. proud of it.
			/^((?:[a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+|^(?:did:plc:[a-zA-Z0-9]{24})$|^(?:did:web:[a-zA-Z0-9.]+))$/,
		identifiablePlaceholder: 'bluesky handle/did',
		identifiablePrefix: 'bsky.app/profile/',
		hasUrl: true,
		verifiable: true
	},
	discord: {
		name: 'Discord',
		icon: DiscordLogo,
		identifiablePattern: /^([a-zA-Z0-9._]{2,32})$/,
		identifiablePlaceholder: 'discord username',
		identifiablePrefix: '@',
		hasUrl: false,
		verifiable: true
	},
	email: {
		name: 'Email',
		icon: Envelope,
		identifiablePattern: EMAIL_REGEX,
		identifiablePlaceholder: 'email address',
		hasUrl: false,
		verifiable: true
	},
	facebook: {
		name: 'Facebook',
		icon: FacebookLogo,
		identifiablePattern: /^([a-zA-Z0-9.]{5,50})$/,
		identifiablePrefix: 'facebook.com/',
		identifiablePlaceholder: 'facebook username',
		hasUrl: true,
		verifiable: true
	},
	github: {
		name: 'GitHub',
		icon: GitHubLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,39})$/,
		identifiablePlaceholder: 'github username',
		identifiablePrefix: 'github.com/',
		hasUrl: true,
		verifiable: true
	},
	instagram: {
		name: 'Instagram',
		icon: InstagramLogo,
		identifiablePattern: /^([a-zA-Z0-9._]{1,30})$/,
		identifiablePlaceholder: 'instagram handle',
		identifiablePrefix: 'instagram.com/',
		hasUrl: true,
		verifiable: true
	},
	kofi: {
		name: 'Ko-fi',
		icon: KoFiLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiablePrefix: 'ko-fi.com/',
		identifiablePlaceholder: 'ko-fi username',
		hasUrl: true,
		verifiable: false
	},
	lastfm: {
		name: 'Last.fm',
		icon: LastFmLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiablePrefix: 'last.fm/user/',
		identifiablePlaceholder: 'last.fm username',
		hasUrl: true,
		verifiable: false
	},
	linkedin: {
		name: 'LinkedIn',
		icon: LinkedInLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiablePlaceholder: 'linkedin username',
		identifiablePrefix: 'linkedin.com/in/',
		hasUrl: true,
		verifiable: true
	},
	mastodon: {
		name: 'Mastodon',
		icon: MastodonLogo,
		// taken from https://regex101.com/r/ac4fG5/2, thank you very much
		identifiablePattern: /^@?\b(?:[a-zA-Z0-9._%+-]+)@(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b$/,
		identifiablePrefix: 'mastodon.social/@',
		identifiablePlaceholder: 'mastodon full handle (e.g. @clembs@mastodon.social)',
		hasUrl: true,
		verifiable: false
	},
	patreon: {
		name: 'Patreon',
		icon: PatreonLogo,
		identifiablePattern: /^([a-zA-Z0-9-]{1,50})$/,
		identifiablePrefix: 'patreon.com/',
		identifiablePlaceholder: 'patreon username',
		hasUrl: true,
		verifiable: false
	},
	phone: {
		name: 'Phone',
		icon: Phone,
		identifiablePattern: /^(\+?[0-9]{1,3}-?[0-9]{3,14})$/,
		identifiablePlaceholder: 'phone number',
		hasUrl: false,
		verifiable: false
	},
	pretendo: {
		name: 'Pretendo Network ID',
		icon: PretendoLogo,
		identifiablePlaceholder: 'pretendo network id',
		hasUrl: false,
		verifiable: false
	},
	reddit: {
		name: 'Reddit',
		icon: RedditLogo,
		identifiablePattern: /^([a-zA-Z0-9_]{3,20})$/,
		identifiablePlaceholder: 'reddit username',
		identifiablePrefix: 'reddit.com/u/',
		hasUrl: true,
		verifiable: true
	},
	signal: {
		name: 'Signal',
		icon: SignalLogo,
		identifiablePattern: /^([a-zA-Z0-9_]{3,32}\.\d{2})$/,
		identifiablePlaceholder: 'signal username',
		hasUrl: false,
		verifiable: false
	},
	spotify: {
		name: 'Spotify',
		icon: SpotifyLogo,
		identifiablePattern: /^([0-9A-Za-z-]{2,32})$/,
		identifiablePrefix: 'open.spotify.com/user/',
		identifiablePlaceholder: 'spotify username',
		hasUrl: true,
		verifiable: true
	},
	startgg: {
		name: 'Start.gg',
		icon: StartGgLogo,
		identifiablePattern: /^([a-zA-Z0-9]{8})$/,
		identifiablePrefix: 'start.gg/user/',
		identifiablePlaceholder: 'start.gg user ID',
		hasUrl: true,
		verifiable: true
	},
	steam: {
		name: 'Steam',
		icon: SteamLogo,
		// works for steamcommunity.com URLs. group 1 is the SteamID or profile URL
		identifiablePattern: /^((?:id|profiles)\/[a-zA-Z0-9_-]+)(?:\?.*)?$/,
		identifiablePrefix: 'steamcommunity.com/',
		identifiablePlaceholder: 'steam profile id/url',
		hasUrl: true,
		verifiable: true
	},
	threads: {
		name: 'Threads',
		icon: ThreadsLogo,
		identifiablePattern: /^([a-zA-Z0-9._]{1,30})$/,
		identifiablePrefix: 'threads.net/@',
		identifiablePlaceholder: 'threads/instagram handle',
		hasUrl: true,
		verifiable: false
	},
	twitch: {
		name: 'Twitch',
		icon: TwitchLogo,
		identifiablePattern: /^([a-zA-Z0-9_]{4,25})$/,
		identifiablePlaceholder: 'twitch username',
		identifiablePrefix: 'twitch.tv/',
		hasUrl: true,
		verifiable: true
	},
	twitter: {
		name: 'X/Twitter',
		icon: XLogo,
		iconProps: { weight: 'regular' },
		identifiablePattern: /^([a-zA-Z0-9_]{1,15})$/,
		identifiablePlaceholder: 'twitter handle',
		identifiablePrefix: 'x.com/',
		hasUrl: true,
		verifiable: true
	},
	webpals: {
		name: 'Webpals',
		icon: Island,
		identifiablePattern: USERNAME_REGEX,
		identifiablePrefix: 'webpals.me/',
		identifiablePlaceholder: 'webpals username',
		hasUrl: true,
		verifiable: true
	},
	youtube: {
		name: 'YouTube',
		icon: YouTubeLogo,
		// works for youtube.com URLs. group 1 is the channelId. group 2 is the handle or username
		// modified from https://stackoverflow.com/a/65726047 (ty)
		identifiablePattern: /^(?:channel\/(UC[\w-]{21}[AQgw])|(?:c\/|user\/)?([\w@-]+))$/,
		identifiablePlaceholder: 'username/handle/channel id',
		identifiablePrefix: 'youtube.com/',
		hasUrl: true,
		verifiable: true
	},
	// domains are last because they're supposed to be generic and the fallback pattern
	domain: {
		name: 'Website',
		icon: Globe,
		// honestly tho idk why i called this "domain" when it can be any website
		// modified from https://uibakery.io/regex-library/url to group the domain
		identifiablePattern:
			/^(?:https?:\/\/)?((?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
		identifiablePlaceholder: 'website url',
		hasUrl: true,
		verifiable: true
	}
};

export const connectionProvidersArray = Object.entries(connectionProviders).map(([id, rest]) => ({
	id: id as ConnectionProvider,
	...rest
}));
