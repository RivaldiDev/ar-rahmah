import { describe, expect, it } from 'vitest';
import {
	FormValidationError,
	hasMeaningfulArticleContent,
	parseJakartaDate,
	parseJakartaDateTime,
	parseRupiahAmount,
	requiredString,
	safeFormMessage,
	validateCategory
} from './forms';

describe('server form validation', () => {
	it('accepts only configured article categories', () => {
		expect(validateCategory('Fikih', ['Fikih', 'Akhlak'])).toBe('Fikih');
		expect(() => validateCategory('Admin<script>', ['Fikih', 'Akhlak'])).toThrow(
			FormValidationError
		);
	});

	it('rejects files and oversized values where text is required', () => {
		const fileForm = new FormData();
		fileForm.set('title', new File(['x'], 'x.txt', { type: 'text/plain' }));
		expect(() => requiredString(fileForm, 'title', 20)).toThrow(FormValidationError);

		const longForm = new FormData();
		longForm.set('title', 'x'.repeat(21));
		expect(() => requiredString(longForm, 'title', 20)).toThrow(FormValidationError);
	});

	it('rejects impossible Jakarta dates instead of normalizing them', () => {
		expect(() => parseJakartaDateTime('2026-02-30T10:00')).toThrow(FormValidationError);
		expect(() => parseJakartaDateTime('not-a-date')).toThrow(FormValidationError);
		expect(parseJakartaDateTime('2026-02-28T10:00').toISOString()).toBe('2026-02-28T03:00:00.000Z');
	});

	it('validates finance dates and whole-rupiah amounts', () => {
		expect(parseJakartaDate('2026-07-23').toISOString()).toBe('2026-07-23T05:00:00.000Z');
		expect(() => parseJakartaDate('2026-02-30')).toThrow(FormValidationError);
		expect(parseRupiahAmount('1.250.000')).toBe(1_250_000);
		expect(() => parseRupiahAmount('-1000')).toThrow(FormValidationError);
		expect(() => parseRupiahAmount('0')).toThrow(FormValidationError);
	});

	it('requires meaningful text after rich-text sanitization', () => {
		expect(hasMeaningfulArticleContent('<p><br></p>')).toBe(false);
		expect(hasMeaningfulArticleContent('<p>Nasihat yang baik.</p>')).toBe(true);
	});

	it('does not expose unexpected internal errors to users', () => {
		expect(safeFormMessage(new FormValidationError('Input salah.'), 'Gagal.')).toBe('Input salah.');
		expect(safeFormMessage(new Error('SQLITE_CONSTRAINT users'), 'Gagal.')).toBe('Gagal.');
	});
});
