import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { normalizeCoverImage } from './image-processing';

describe('cover image normalization', () => {
	it('decodes and re-encodes uploaded images as metadata-free WebP', async () => {
		const onePixelPng = await sharp({
			create: { width: 1, height: 1, channels: 3, background: '#ffffff' }
		})
			.png()
			.toBuffer();
		const file = new File([onePixelPng], 'avatar.png', { type: 'image/png' });
		const result = await normalizeCoverImage(file);

		expect(result.mimeType).toBe('image/webp');
		expect(result.filename).toBe('avatar.webp');
		expect(result.data.subarray(0, 4).toString()).toBe('RIFF');
		expect(result.data.subarray(8, 12).toString()).toBe('WEBP');
	});

	it('rejects spoofed image signatures that cannot be decoded', async () => {
		const spoofed = new File([Buffer.from('RIFF0000WEBP<script>alert(1)</script>')], 'bad.webp', {
			type: 'image/webp'
		});
		await expect(normalizeCoverImage(spoofed)).rejects.toThrow(/valid/i);
	});

	it('rejects unsupported media types before decoding', async () => {
		const svg = new File(['<svg onload="alert(1)"></svg>'], 'bad.svg', {
			type: 'image/svg+xml'
		});
		await expect(normalizeCoverImage(svg)).rejects.toThrow(/JPG, PNG, atau WebP/);
	});
});
