type SecurityConfigInput = {
	origin: string | undefined;
	secret: string | undefined;
	production: boolean;
};

export function validateSecurityConfig({ origin, secret, production }: SecurityConfigInput) {
	if (!secret || secret.length < 32) {
		throw new Error('BETTER_AUTH_SECRET must contain at least 32 characters.');
	}
	if (secret.length > 1024) throw new Error('BETTER_AUTH_SECRET is unreasonably long.');
	if (!origin) throw new Error('ORIGIN is required.');

	let parsed: URL;
	try {
		parsed = new URL(origin);
	} catch {
		throw new Error('ORIGIN must be an absolute URL.');
	}
	if (
		parsed.username ||
		parsed.password ||
		parsed.search ||
		parsed.hash ||
		parsed.pathname !== '/'
	) {
		throw new Error('ORIGIN must contain only scheme, hostname, and optional port.');
	}
	const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
	if (production && parsed.protocol !== 'https:' && !loopback) {
		throw new Error('ORIGIN must use HTTPS in production.');
	}
	if (!production && parsed.protocol === 'http:' && !loopback) {
		throw new Error('HTTP ORIGIN is allowed only for loopback development.');
	}
	if (!['http:', 'https:'].includes(parsed.protocol)) {
		throw new Error('ORIGIN must use HTTP or HTTPS.');
	}

	return { origin: parsed.origin, secureCookies: parsed.protocol === 'https:' };
}
