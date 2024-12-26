import { redirect } from '@sveltejs/kit';

// TODO: eventually, make a home page lol
export async function GET() {
	redirect(302, '/login');
}
