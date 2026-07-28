<script lang="ts">
	import Brand from '$lib/components/Brand.svelte';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	let { form }: PageProps = $props();
</script>

<svelte:head
	><title>Masuk Pengurus | Ar-Rahmah</title><meta name="robots" content="noindex" /></svelte:head
>
<div class="grid min-h-screen bg-pale lg:grid-cols-[1.05fr_.95fr]">
	<section class="relative hidden overflow-hidden bg-navy lg:block">
		<img
			src="/images/masjid-ar-rahmah-hero.webp"
			alt=""
			class="absolute inset-0 h-full w-full object-cover opacity-65"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-transparent"></div>
		<blockquote
			class="font-display absolute right-12 bottom-14 left-12 max-w-xl text-4xl leading-tight text-white"
		>
			“Amanah ini bukan sekadar mengelola halaman, tetapi merawat jembatan ilmu untuk jamaah.”
		</blockquote>
	</section>
	<section class="grid place-items-center p-6 sm:p-12">
		<div class="w-full max-w-md">
			<Brand />
			<p class="eyebrow mt-12">Portal pengurus</p>
			<h1 class="font-display mt-3 text-4xl font-semibold text-navy">Selamat datang kembali.</h1>
			<p class="mt-3 text-sm leading-6 text-slate">
				Masuk dengan akun yang dibuatkan khusus oleh administrator masjid.
			</p>
			{#if form?.message}<p
					class="mt-6 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700"
					role="alert"
				>
					{form.message}
				</p>{/if}
			<form method="post" class="mt-7 grid gap-5">
				<label class="form-label"
					>Username<input
						class="form-control"
						type="text"
						name="username"
						value={form?.username ?? ''}
						autocomplete="username"
						autocapitalize="none"
						spellcheck="false"
						inputmode="text"
						minlength="3"
						maxlength="30"
						pattern="[A-Za-z0-9_.]+"
						required
					/></label
				><label class="form-label"
					>Kata sandi<input
						class="form-control"
						type="password"
						name="password"
						autocomplete="current-password"
						required
					/></label
				><button class="button-primary mt-2 justify-center" type="submit">Masuk ke dashboard</button
				>
			</form>
			<a href={resolve('/')} class="mt-7 inline-block text-sm font-bold text-primary"
				>← Kembali ke situs</a
			>
		</div>
	</section>
</div>
