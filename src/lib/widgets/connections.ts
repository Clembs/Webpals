import type { ConnectionsWidget } from './types';
import {
	Butterfly,
	Envelope,
	GithubLogo,
	Globe,
	XLogo,
	type IconContextProps
} from 'phosphor-svelte';
import DiscordLogo from '$icons/DiscordLogo.svelte';

export const connectionProviders: Record<
	ConnectionsWidget['connections'][number]['provider'],
	{
		name: string;
		icon: typeof XLogo;
		iconProps?: IconContextProps['values'];
	}
> = {
	twitter: { name: 'X/Twitter', icon: XLogo, iconProps: { weight: 'regular' } },
	bluesky: { name: 'Bluesky', icon: Butterfly },
	discord: { name: 'Discord', icon: DiscordLogo },
	email: { name: 'Email', icon: Envelope },
	domain: { name: 'Domain', icon: Globe },
	github: { name: 'GitHub', icon: GithubLogo }
};
