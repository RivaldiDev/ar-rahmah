import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const isAdminRoute = event.url.pathname === '/admin' || event.url.pathname.startsWith('/admin/');
	const isLoginRoute = event.url.pathname === '/admin/login';
	const isDisabledEmailSignIn = event.url.pathname === '/api/auth/sign-in/email';
	if (isAdminRoute && !isLoginRoute && !event.locals.user) redirect(303, '/admin/login');
	if (isLoginRoute && event.locals.user) redirect(303, '/admin');

	const response = isDisabledEmailSignIn
		? new Response('Not found', { status: 404 })
		: await svelteKitHandler({
				event,
				auth,
				building,
				resolve
			});

	const headers = new Headers(response.headers);
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set('X-Frame-Options', 'DENY');
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
	headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	headers.set('Cross-Origin-Resource-Policy', 'same-origin');
	if (event.url.protocol === 'https:') {
		headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}
	if (isAdminRoute || event.url.pathname.startsWith('/api/auth/')) {
		headers.set('Cache-Control', 'no-store, private');
		headers.set('Pragma', 'no-cache');
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

export const handle: Handle = handleBetterAuth;
