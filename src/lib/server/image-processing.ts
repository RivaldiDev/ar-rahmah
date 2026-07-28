import sharp from 'sharp';
import { FormValidationError } from '$lib/server/forms';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const allowedTypes = new Map([
	['image/jpeg', { extensions: ['.jpg', '.jpeg'], format: 'jpeg' }],
	['image/png', { extensions: ['.png'], format: 'png' }],
	['image/webp', { extensions: ['.webp'], format: 'webp' }]
]);

function safeWebpFilename(filename: string) {
	const basename = filename
		.replace(/\.[^.]+$/, '')
		.normalize('NFKD')
		.replace(/[^a-zA-Z0-9._-]+/g, '-')
		.replace(/(^[-.]+|[-.]+$)/g, '')
		.slice(0, 120);
	return `${basename || 'cover'}.webp`;
}

export async function normalizeCoverImage(file: File) {
	if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
		throw new FormValidationError('Ukuran gambar maksimal 5 MB');
	}
	const expected = allowedTypes.get(file.type);
	const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
	if (!expected || !extension || !expected.extensions.includes(extension)) {
		throw new FormValidationError('Format gambar harus JPG, PNG, atau WebP');
	}

	try {
		const source = Buffer.from(await file.arrayBuffer());
		const pipeline = sharp(source, {
			failOn: 'error',
			limitInputPixels: MAX_INPUT_PIXELS,
			animated: false
		});
		const metadata = await pipeline.metadata();
		if (metadata.format !== expected.format || (metadata.pages ?? 1) !== 1) {
			throw new Error('Unexpected image format');
		}
		const data = await pipeline
			.rotate()
			.resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 82, effort: 4 })
			.toBuffer();
		return { data, filename: safeWebpFilename(file.name), mimeType: 'image/webp' as const };
	} catch {
		throw new FormValidationError('Isi berkas gambar tidak valid');
	}
}
