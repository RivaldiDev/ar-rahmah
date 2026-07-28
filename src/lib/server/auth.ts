import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { validateSecurityConfig } from '$lib/server/security-config';

const security = validateSecurityConfig({
	origin: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	production: !dev
});

export const auth = betterAuth({
	baseURL: security.origin,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [security.origin],
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
		minPasswordLength: 16,
		maxPasswordLength: 128
	},
	session: {
		expiresIn: 60 * 60 * 12,
		updateAge: 60 * 60
	},
	rateLimit: {
		enabled: true,
		window: 60,
		max: 60,
		customRules: {
			'/sign-in/username': { window: 5 * 60, max: 5 }
		}
	},
	advanced: {
		useSecureCookies: security.secureCookies,
		disableCSRFCheck: false,
		disableOriginCheck: false,
		ipAddress: {
			ipAddressHeaders: ['cf-connecting-ip', 'x-real-ip'],
			ipv6Subnet: 64
		}
	},
	plugins: [
		username({
			minUsernameLength: 3,
			maxUsernameLength: 30
		}),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
