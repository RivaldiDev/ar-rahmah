import { expect, test } from '@playwright/test';

test('public account creation is disabled', async ({ request }) => {
	for (const path of ['/api/auth/sign-up/email', '/api/auth/sign-up/username']) {
		const response = await request.post(path, {
			data: {
				name: 'Unauthorized user',
				email: 'unauthorized@example.invalid',
				username: 'unauthorized',
				password: 'Unauthorized-Account-2026!'
			}
		});
		expect(response.status()).toBeGreaterThanOrEqual(400);
	}
});

test('cross-origin form submissions are rejected', async ({ request }) => {
	const response = await request.post('/admin/login', {
		headers: {
			Origin: 'https://evil.example',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: { username: 'attacker', password: 'irrelevant' }
	});
	expect(response.status()).toBe(403);
});

test('login accepts a username field instead of an email field', async ({ page }) => {
	await page.goto('/admin/login');
	await expect(page.getByLabel('Username')).toBeVisible();
	await expect(page.getByLabel('Email')).toHaveCount(0);
	await expect(page.getByLabel('Username')).toHaveAttribute('autocomplete', 'username');
});

test('direct email sign-in is disabled', async ({ request }) => {
	const response = await request.post('/api/auth/sign-in/email', {
		data: {
			email: 'admin@example.invalid',
			password: 'Not-The-Real-Password-2026!'
		}
	});
	expect(response.status()).toBe(404);
});

test('security headers protect public and admin responses', async ({ request }) => {
	const publicResponse = await request.get('/');
	const adminResponse = await request.get('/admin/login');

	expect(publicResponse.headers()['content-security-policy']).toContain("default-src 'self'");
	expect(publicResponse.headers()['x-frame-options']).toBe('DENY');
	expect(publicResponse.headers()['x-content-type-options']).toBe('nosniff');
	expect(publicResponse.headers()['permissions-policy']).toContain('camera=()');
	expect(adminResponse.headers()['cache-control']).toContain('no-store');
});

test('finance exports require an authenticated admin session', async ({ request }) => {
	for (const path of ['/admin/keuangan/export.xlsx', '/admin/keuangan/export.pdf']) {
		const response = await request.get(path, { maxRedirects: 0 });
		expect(response.status()).toBe(303);
		expect(response.headers().location).toBe('/admin/login');
	}
});
