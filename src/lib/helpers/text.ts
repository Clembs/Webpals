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
	return new Intl.RelativeTimeFormat(locale, {
		style: 'long',
		numeric: 'auto'
	}).format(Math.round((date.getTime() - Date.now()) / 60000), 'minutes');
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
