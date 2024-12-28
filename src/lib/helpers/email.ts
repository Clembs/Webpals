import { SENDGRID_API_KEY } from '$env/static/private';

export async function sendEmail({
	address,
	subject,
	bodyHTML,
	fetch
}: {
	address: string;
	subject: string;
	bodyHTML: string;
	fetch: typeof globalThis.fetch;
}) {
	const response = await fetch(`https://api.sendgrid.com/v3/mail/send`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${SENDGRID_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			personalizations: [
				{
					to: [
						{
							email: address
						}
					],
					subject
				}
			],
			from: {
				email: 'islands@clembs.com',
				name: 'Webpals'
			},
			content: [
				{
					type: 'text/html',
					value: bodyHTML
				}
			]
		})
	});

	if (!response.ok) {
		console.error(await response.text());

		throw new Error('Failed to send email.');
	}

	return response;
}
