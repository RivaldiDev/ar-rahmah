import { describe, expect, it } from 'vitest';
import { validateSecurityConfig } from './security-config';

describe('production security configuration', () => {
	it('requires a high-entropy-length auth secret', () => {
		expect(() =>
			validateSecurityConfig({
				origin: 'https://arrahmah.web.id',
				secret: 'too-short',
				production: true
			})
		).toThrow(/secret/i);
	});

	it('requires HTTPS origin in production', () => {
		expect(() =>
			validateSecurityConfig({
				origin: 'http://arrahmah.web.id',
				secret: 'x'.repeat(64),
				production: true
			})
		).toThrow(/HTTPS/i);
	});

	it('accepts HTTP loopback only outside production', () => {
		expect(
			validateSecurityConfig({
				origin: 'http://127.0.0.1:5173',
				secret: 'x'.repeat(64),
				production: false
			})
		).toEqual({ origin: 'http://127.0.0.1:5173', secureCookies: false });
	});
});
