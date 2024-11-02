import insane from 'insane';
import { marked, type MarkedExtension } from 'marked';

export function formatDate(date: Date, locale: string): string {
	return date.toLocaleDateString(locale, {
		...(date.getFullYear() !== new Date().getFullYear() && { year: 'numeric' }),
		month: 'long',
		day: 'numeric'
	});
}

export function parseMarkdown(text: string, ...markedExtensions: MarkedExtension[]): string {
	const insaneOptions: insane.SanitizeOptions = {
		allowedAttributes: {
			a: ['href', 'target', 'rel']
		}
	};

	return insane(
		marked.use(...markedExtensions).parse(text, {
			async: false,
			gfm: true,
			breaks: true
		}),
		insaneOptions
	);
}
