import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { auth } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		if (
			!username ||
			username.length < 3 ||
			username.length > 30 ||
			!/^[a-zA-Z0-9_.]+$/.test(username) ||
			!password ||
			password.length > 128
		) {
			return fail(400, {
				message: 'Username atau kata sandi tidak sesuai.',
				username
			});
		}
		try {
			await auth.api.signInUsername({
				body: { username, password },
				headers: event.request.headers
			});
		} catch (error) {
			if (error instanceof APIError)
				return fail(400, { message: 'Username atau kata sandi tidak sesuai.', username });
			return fail(500, { message: 'Terjadi kendala. Silakan coba lagi.', username });
		}
		redirect(303, '/admin');
	}
};
