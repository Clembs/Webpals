// note: all of the REGEX has been AI-generated and im kind of ashamed of myself but regex is so fking hard and i mean ive tested a few edge cases for each and they work fine.
// if you're a regex wizard reading this and something doesn't work, help me by submitting an issue.

import type { ConnectionProvider } from './types';
import {
	Butterfly,
	Envelope,
	GithubLogo,
	Globe,
	Island,
	SteamLogo,
	XLogo,
	YoutubeLogo,
	type IconContextProps
} from 'phosphor-svelte';
import DiscordLogo from '$icons/DiscordLogo.svelte';
import { EMAIL_REGEX } from 'valibot';
import PretendoNetworkId from '$icons/PretendoNetworkID.svelte';

export const connectionProviders: Record<
	ConnectionProvider,
	{
		name: string;
		icon: typeof XLogo | typeof DiscordLogo;
		iconProps?: IconContextProps['values'];
		matchingPattern?: RegExp;
		identifiableHint?: string;
		hasUrl: boolean;
		verifiable: boolean;
	}
> = {
	twitter: {
		name: 'X/Twitter',
		icon: XLogo,
		iconProps: { weight: 'regular' },
		// works for twitter.com & x.com URLs. group 1 is the handle
		matchingPattern: /^(?:https?:\/\/)?(?:x\.com|twitter\.com)\/([a-zA-Z0-9_]{1,15})(?:\?.*)?$/,
		hasUrl: true,
		verifiable: true
	},
	bluesky: {
		name: 'Bluesky',
		icon: Butterfly,
		// works for bsky.app URLs and did:plc: URLs. group 1 is the handle, group 2 is the DID
		// this MIGHT not work as intended. if you're reading this because it doesn't work, please lmk through an issue.
		matchingPattern:
			/^(?:https?:\/\/)?bsky\.app\/profile\/((?:[a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+|did:(?:plc|web):[a-zA-Z0-9]+)$|^(did:(?:plc|web):[a-zA-Z0-9]+)$/,
		hasUrl: true,
		verifiable: true
	},
	discord: {
		name: 'Discord',
		icon: DiscordLogo,
		identifiableHint: 'Enter your Discord username (e.g. clembs)',
		hasUrl: false,
		verifiable: true
	},
	pretendo: {
		name: 'Pretendo Network ID',
		icon: PretendoNetworkId,
		identifiableHint: 'Enter your Pretendo Network ID (e.g. Clembs)',
		hasUrl: false,
		verifiable: false
	},
	email: {
		name: 'Email',
		icon: Envelope,
		// i trust valibot devs. their brains are bigger than mine
		matchingPattern: EMAIL_REGEX,
		hasUrl: false,
		verifiable: true
	},
	github: {
		name: 'GitHub',
		icon: GithubLogo,
		// works for github.com URLs. group 1 is the username
		matchingPattern:
			/^(?:https?:\/\/)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(?:\?.*)?$/,
		hasUrl: true,
		verifiable: true
	},
	webpals: {
		name: 'Webpals',
		icon: Island,
		// works for webpals.me, webpals.vercel.com, and webpals.clembs.com URLs. group 1 is the handle
		// this should work unless i break smth. i'd be very dumb
		matchingPattern:
			/^(?:https?:\/\/)?(?:webpals\.me|webpals\.vercel\.app|webpals\.clembs\.com)\/([a-zA-Z0-9_]{2,24})(?:\?.*)?$/,
		hasUrl: true,
		verifiable: true
	},
	youtube: {
		name: 'YouTube',
		icon: YoutubeLogo,
		// works for youtube.com URLs. group 1 is the channelId. group 2 is the handle or username
		// modified from https://stackoverflow.com/a/65726047 (ty)
		matchingPattern:
			/^(?:https?:\/\/)(?:www\.|m\.)?youtube\.com\/(?:channel\/(UC[\w-]{21}[AQgw])|(?:c\/|user\/)?([\w@-]+))$/,
		hasUrl: true,
		verifiable: true
	},
	steam: {
		name: 'Steam',
		icon: SteamLogo,
		// works for steamcommunity.com URLs. group 1 is the SteamID or profile URL
		matchingPattern:
			/^(?:https?:\/\/)?steamcommunity\.com\/(?:id|profiles)\/([a-zA-Z0-9_-]+)(?:\?.*)?$/,
		hasUrl: true,
		verifiable: true
	},
	// domains are last because they're supposed to be generic and the fallback pattern
	domain: {
		name: 'Website',
		icon: Globe,
		// group 1 is the domain
		// honestly tho idk why i called this "domain" when it's literally just a website
		// modified from https://uibakery.io/regex-library/url to group the domain
		matchingPattern:
			/^(?:https?:\/\/)?((?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
		hasUrl: true,
		verifiable: true
	}
};

export const connectionProvidersArray = Object.entries(connectionProviders).map(([id, rest]) => ({
	id,
	...rest
}));
