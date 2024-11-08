import insane from 'insane';
import { marked, type MarkedExtension } from 'marked';

export function formatDate(date: Date, locale: string): string {
	return date.toLocaleDateString(locale, {
		...(date.getFullYear() !== new Date().getFullYear() && { year: 'numeric' }),
		month: 'long',
		day: 'numeric'
	});
}

export function formatRelativeTime(date: Date, locale: string): string {
	let amount: number = Math.round((date.getTime() - Date.now()) / 60000);
	let unit: Intl.RelativeTimeFormatUnit = 'minute';

	if (Math.abs(date.getTime() - Date.now()) > 60 * 60 * 1000) {
		amount = Math.round(amount / 60);
		unit = 'hour';
	} else if (Math.abs(date.getTime() - Date.now()) > 24 * 60 * 60 * 1000) {
		amount = Math.round(amount / 60 / 24);
		unit = 'day';
	}

	return new Intl.RelativeTimeFormat(locale, {
		style: 'long',
		numeric: 'auto'
	}).format(amount, unit);
}

export function parseMarkdown(text: string, ...markedExtensions: MarkedExtension[]): string {
	const insaneOptions: insane.SanitizeOptions = {
		allowedAttributes: {
			a: ['href', 'target', 'rel']
		}
	};

	return insane(
		marked
			.use(...markedExtensions, {
				renderer: {
					link: ({ href, title, text }) =>
						`<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a>`
				}
			})
			.parse(text, {
				async: false,
				gfm: true,
				breaks: true
			}),
		insaneOptions
	);
}
