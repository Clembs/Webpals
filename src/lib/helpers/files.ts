// heavily remixed from this solution by Victor (www.vitim.us)

// List of known signature patterns and masks
// Sourced from https://en.wikipedia.org/wiki/List_of_file_signatures and https://mimesniff.spec.whatwg.org
const signatures = [
	{
		mime: 'image/jpeg',
		pattern: [0xff, 0xd8, 0xff],
		mask: [0xff, 0xff, 0xff]
	},
	{
		mime: 'image/png',
		pattern: [0x89, 0x50, 0x4e, 0x47],
		mask: [0xff, 0xff, 0xff, 0xff]
	},
	{
		// audio files
		mime: 'audio/mpeg',
		pattern: [0x49, 0x44, 0x33],
		mask: [0xff, 0xff, 0xff]
	},
	{
		mime: 'audio/ogg',
		pattern: [0x4f, 0x67, 0x67, 0x53],
		mask: [0xff, 0xff, 0xff, 0xff]
	},
	// the following three audio/mpeg patterns are for MPEG-1 Layer 3 files without ID3 tags or a ID3v1 tag
	{
		mime: 'audio/mpeg',
		pattern: [0xff, 0xfb],
		mask: [0xff, 0xff]
	},
	{
		mime: 'audio/mpeg',
		pattern: [0xff, 0xf3],
		mask: [0xff, 0xff]
	},
	{
		mime: 'audio/mpeg',
		pattern: [0xff, 0xf2],
		mask: [0xff, 0xff]
	},
	{
		mime: 'audio/flac',
		pattern: [0x66, 0x4c, 0x61, 0x43],
		mask: [0xff, 0xff, 0xff, 0xff]
	},
	// all aliases for wav files
	{
		mime: 'audio/wav',
		pattern: [0x52, 0x49, 0x46, 0x46],
		mask: [0xff, 0xff, 0xff, 0xff]
	},
	{
		mime: 'audio/x-wav',
		pattern: [0x52, 0x49, 0x46, 0x46],
		mask: [0xff, 0xff, 0xff, 0xff]
	},
	{
		mime: 'audio/vnd.wav',
		pattern: [0x52, 0x49, 0x46, 0x46],
		mask: [0xff, 0xff, 0xff, 0xff]
	},
	{
		mime: 'audio/vnd.wave',
		pattern: [0x52, 0x49, 0x46, 0x46],
		mask: [0xff, 0xff, 0xff, 0xff]
	}
] as const;

export type MimeTypes = (typeof signatures)[number]['mime'];

export function validateFileSignatures(file: File, mimes: MimeTypes[]): Promise<boolean> {
	const signaturesToCheck = signatures.filter((s) => mimes.includes(s.mime));

	return new Promise(async (resolve) => {
		if (signaturesToCheck.length === 0) {
			resolve(false);
			return;
		}

		// get the biggest pattern of all signatures
		const maxBytes = Math.max(...signaturesToCheck.map((s) => s.pattern.length));
		const buffer = new Uint8Array(await file.arrayBuffer()).slice(0, maxBytes);

		for (const signature of signaturesToCheck) {
			const { pattern, mask } = signature;
			// skip if we don't have enough bytes to check this pattern
			if (buffer.length < pattern.length) continue;

			// check if the signature matches
			let match = true;
			for (let i = 0; i < pattern.length; i++) {
				if ((buffer[i] & mask[i]) !== pattern[i]) {
					match = false;
					break;
				}
			}

			if (match) {
				resolve(true);
				return;
			}
		}

		resolve(false);
	});
}
