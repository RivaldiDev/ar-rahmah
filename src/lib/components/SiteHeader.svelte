<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Brand from './Brand.svelte';

	let open = $state(false);
	type SitePath = '/' | '/jadwal-salat' | '/kegiatan' | '/pengajian' | '/artikel' | '/tentang';
	const links: { href: SitePath; label: string }[] = [
		{ href: '/', label: 'Beranda' },
		{ href: '/jadwal-salat', label: 'Jadwal Salat' },
		{ href: '/kegiatan', label: 'Kegiatan' },
		{ href: '/pengajian', label: 'Pengajian' },
		{ href: '/artikel', label: 'Artikel' },
		{ href: '/tentang', label: 'Tentang Kami' }
	];

	function isActive(href: string) {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (open = false)} />

<header class="sticky top-0 z-50 border-b border-blue-100/80 bg-white/95 backdrop-blur-md">
	<div class="site-container flex h-[4.75rem] items-center justify-between gap-6">
		<Brand />
		<nav class="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
			{#each links as link (link.href)}
				<a
					href={resolve(link.href)}
					aria-current={isActive(link.href) ? 'page' : undefined}
					class:active={isActive(link.href)}
					class="nav-link px-3 py-2 text-sm font-semibold">{link.label}</a
				>
			{/each}
		</nav>
		<div class="hidden items-center gap-3 lg:flex">
			<a href={resolve('/tentang#infaq')} class="text-sm font-semibold text-navy hover:text-primary"
				>Infaq</a
			>
			<a href={resolve('/admin/login')} class="button-primary">Masuk pengurus</a>
		</div>
		<button
			type="button"
			class="grid size-11 place-items-center rounded-xl border border-blue-100 text-navy lg:hidden"
			aria-label={open ? 'Tutup menu' : 'Buka menu'}
			aria-expanded={open}
			onclick={() => (open = !open)}
		>
			<span class="sr-only">Menu</span>
			<svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2">
				{#if open}<path d="m6 6 12 12M18 6 6 18" />{:else}<path d="M4 7h16M4 12h16M4 17h16" />{/if}
			</svg>
		</button>
	</div>

	{#if open}
		<nav
			class="border-t border-blue-100 bg-white px-5 py-4 shadow-xl lg:hidden"
			aria-label="Navigasi seluler"
		>
			<div class="mx-auto grid max-w-xl gap-1">
				{#each links as link (link.href)}
					<a
						href={resolve(link.href)}
						onclick={() => (open = false)}
						aria-current={isActive(link.href) ? 'page' : undefined}
						class:active={isActive(link.href)}
						class="nav-link rounded-lg px-3 py-3 font-semibold">{link.label}</a
					>
				{/each}
				<a
					href={resolve('/admin/login')}
					class="button-primary mt-3 justify-center"
					onclick={() => (open = false)}>Masuk pengurus</a
				>
			</div>
		</nav>
	{/if}
</header>

<style>
	.nav-link {
		color: #35526f;
		border-radius: 0.7rem;
		transition: 160ms ease;
	}
	.nav-link:hover {
		color: var(--primary);
		background: var(--pale);
	}
	.nav-link.active {
		color: var(--navy);
		background: var(--pale);
	}
</style>
