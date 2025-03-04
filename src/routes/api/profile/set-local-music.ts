import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { validateFileSignatures, type MimeTypes } from '$lib/helpers/files';
import { db } from '$lib/db';
import { profiles } from '$lib/db/schema/profiles';
import { eq } from 'drizzle-orm';
import { parseWebStream } from 'music-metadata';
import type { MusicWidget } from '$lib/widgets/types';

export async function setLocalMusic({
	locals: { getCurrentProfile, supabase },
	request,
	url
}: RequestEvent) {
	const currentProfile = getCurrentProfile();

	if (!currentProfile) redirect(401, '/login');

	const formData = await request.formData();
	const audioFile = formData.get('audio-file');
	const title = formData.get('title')?.toString();
	const artist = formData.get('artist')?.toString();

	if (!title || !artist) {
		return fail(400, {
			message: 'Missing required fields'
		});
	}

	const musicWidget = currentProfile.widgets
		.find((column) => column.some((w) => w.id === 'music'))
		?.find((w) => w.id === 'music') as MusicWidget | undefined;

	if (!musicWidget) {
		return fail(400, {
			message: 'Music widget not found.'
		});
	}

	// get the user's music files
	const previousAudioFilesData = await supabase.storage.from('music').list(currentProfile.id);

	if (previousAudioFilesData?.error) {
		console.error(previousAudioFilesData.error);
		return fail(500, {
			message: 'Failed to check if the user has existing audio files.'
		});
	}

	// if the user hasn't uploaded an audio file and no previous audio file exists, return an error
	if (
		(!(audioFile instanceof File) || audioFile.size <= 0) &&
		!previousAudioFilesData?.data.length
	) {
		return fail(400, {
			message: 'Missing audio file.'
		});
	}

	// if the user is uploading a new audio file, validate it
	if (audioFile && audioFile instanceof File && audioFile.size > 0) {
		// delete the previous audio file if it exists
		if (previousAudioFilesData.data.length > 0) {
			const { error: deleteError } = await supabase.storage
				.from('music')
				.remove(previousAudioFilesData.data.map((f) => f.name));

			if (deleteError) {
				console.error(deleteError);
				return fail(500, {
					message: 'Failed to delete previous audio file.'
				});
			}
		}

		if (!audioFile.type.startsWith('audio/')) {
			return fail(400, {
				message: 'Invalid file type.'
			});
		}

		const mimeTypes: MimeTypes[] = [
			'audio/mpeg',
			'audio/wav',
			'audio/flac',
			// 'audio/ogg',
			'audio/x-wav'
		];

		const isValidMimeSignature = await validateFileSignatures(audioFile, mimeTypes);

		if (!isValidMimeSignature) {
			return fail(400, {
				message: 'Invalid file type.'
			});
		}

		// check if the file is too large (>3MB)
		if (audioFile.size > 3 * 1024 * 1024) {
			return fail(400, {
				message: 'File must be less than 3 MB in size.'
			});
		}

		// check if the music's duration is above 10 minutes
		const metadata = await parseWebStream(audioFile.stream());

		if (metadata.format?.duration && metadata.format.duration > 600) {
			return fail(400, {
				message: 'Music must be less than 10 minutes in duration.'
			});
		}

		const { data, error } = await supabase.storage
			.from('music')
			.upload(`${currentProfile.id}/${audioFile.name}`, audioFile, {
				cacheControl: 'public, max-age=31536000, immutable',
				metadata: {
					title,
					artist
				},
				upsert: true
			});

		if (error) {
			console.error(error);
			return fail(500, {
				message: 'Failed to upload file.'
			});
		}

		// change the content URL to the new file's path
		musicWidget.content_url = data.fullPath;
	}

	musicWidget.provider = 'local';
	musicWidget.title = title;
	musicWidget.artist = artist;
	musicWidget.external_url = null;
	musicWidget.album_art_url = null;

	await db
		.update(profiles)
		.set({
			widgets: currentProfile.widgets.map((column) =>
				column.map((w) => {
					if (w.id === 'music') {
						return {
							...w,
							...musicWidget
						};
					}
					return w;
				})
			)
		})
		.where(eq(profiles.id, currentProfile.id));

	return {};
}
