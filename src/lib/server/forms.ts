import sanitizeHtml from 'sanitize-html';

export const articleCategories = [
	'Fikih',
	'Akhlak',
	'Aqidah',
	'Muamalah',
	'Sirah',
	'Tafsir',
	'Kurban',
	'Puasa & Ramadan',
	'Hari Besar Islam',
	'Sosial & Yatim'
];

export class FormValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'FormValidationError';
	}
}

function hasInvalidControlCharacter(value: string) {
	return [...value].some((character) => {
		const codePoint = character.codePointAt(0)!;
		return (
			codePoint <= 8 ||
			codePoint === 11 ||
			codePoint === 12 ||
			(codePoint >= 14 && codePoint <= 31) ||
			codePoint === 127
		);
	});
}

function textEntry(formData: FormData, name: string) {
	const entry = formData.get(name);
	if (typeof entry !== 'string') throw new FormValidationError(`${name} tidak valid`);
	const value = entry.normalize('NFC').trim();
	if (hasInvalidControlCharacter(value)) throw new FormValidationError(`${name} tidak valid`);
	return value;
}

export function requiredString(formData: FormData, name: string, maxLength = 5000) {
	const value = textEntry(formData, name);
	if (!value || value.length > maxLength) throw new FormValidationError(`${name} tidak valid`);
	return value;
}

export function optionalString(formData: FormData, name: string, maxLength = 5000) {
	const value = textEntry(formData, name);
	if (value.length > maxLength) throw new FormValidationError(`${name} terlalu panjang`);
	return value;
}

export function sanitizeArticleContent(value: string) {
	return sanitizeHtml(value, {
		allowedTags: ['p', 'br', 'h2', 'h3', 'blockquote', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a'],
		allowedAttributes: { a: ['href'] },
		allowedSchemes: ['http', 'https', 'mailto'],
		allowProtocolRelative: false,
		transformTags: {
			a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
		}
	});
}

export function hasMeaningfulArticleContent(value: string) {
	return (
		sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).replaceAll('\u00a0', ' ').trim()
			.length > 0
	);
}

export function validateCategory(value: string, allowedCategories: string[]) {
	const normalized = value.normalize('NFC').trim();
	if (!allowedCategories.includes(normalized)) {
		throw new FormValidationError('Kategori artikel tidak valid.');
	}
	return normalized;
}

export function parseJakartaDateTime(value: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
	if (!match) throw new FormValidationError('Tanggal dan waktu tidak valid');
	const [, yearText, monthText, dayText, hourText, minuteText] = match;
	const [year, month, day, hour, minute] = [yearText, monthText, dayText, hourText, minuteText].map(
		Number
	);
	const calendarDate = new Date(Date.UTC(year, month - 1, day));
	const validCalendarDate =
		year >= 2000 &&
		year <= 2100 &&
		calendarDate.getUTCFullYear() === year &&
		calendarDate.getUTCMonth() === month - 1 &&
		calendarDate.getUTCDate() === day &&
		hour >= 0 &&
		hour <= 23 &&
		minute >= 0 &&
		minute <= 59;
	if (!validCalendarDate) throw new FormValidationError('Tanggal dan waktu tidak valid');
	const parsed = new Date(`${value}:00+07:00`);
	if (Number.isNaN(parsed.getTime()))
		throw new FormValidationError('Tanggal dan waktu tidak valid');
	return parsed;
}

export function parseJakartaDate(value: string) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) throw new FormValidationError('Tanggal transaksi tidak valid');
	const [, yearText, monthText, dayText] = match;
	const [year, month, day] = [yearText, monthText, dayText].map(Number);
	const calendarDate = new Date(Date.UTC(year, month - 1, day));
	if (
		year < 2000 ||
		year > 2100 ||
		calendarDate.getUTCFullYear() !== year ||
		calendarDate.getUTCMonth() !== month - 1 ||
		calendarDate.getUTCDate() !== day
	) {
		throw new FormValidationError('Tanggal transaksi tidak valid');
	}
	return new Date(`${value}T12:00:00+07:00`);
}

export function parseRupiahAmount(value: string) {
	const normalized = value.replaceAll(/[.\s]/g, '');
	if (!/^\d+$/.test(normalized)) throw new FormValidationError('Nominal tidak valid');
	const amount = Number(normalized);
	if (!Number.isSafeInteger(amount) || amount < 1 || amount > 9_000_000_000_000) {
		throw new FormValidationError('Nominal harus antara Rp1 dan Rp9 triliun');
	}
	return amount;
}

export function safeFormMessage(error: unknown, fallback: string) {
	return error instanceof FormValidationError ? error.message : fallback;
}
