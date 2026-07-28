<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Brand from '$lib/components/Brand.svelte';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
	let menuOpen = $state(false);
	type AdminPath = '/admin' | '/admin/artikel' | '/admin/kegiatan' | '/admin/keuangan';
	const links: { href: AdminPath; label: string; icon: string }[] = [
		{ href: '/admin', label: 'Ringkasan', icon: '⌂' },
		{ href: '/admin/artikel', label: 'Artikel', icon: '✎' },
		{ href: '/admin/kegiatan', label: 'Kegiatan', icon: '◫' },
		{ href: '/admin/keuangan', label: 'Keuangan', icon: 'Rp' }
	];
	const active = (href: string) =>
		href === '/admin' ? page.url.pathname === href : page.url.pathname.startsWith(href);
</script>

{#if page.url.pathname === '/admin/login'}
	{@render children()}
{:else}
	<div class="min-h-screen bg-[#f5faff] lg:grid lg:grid-cols-[17rem_1fr]">
		<header
			class="flex h-16 items-center justify-between border-b border-blue-100 bg-white px-4 lg:hidden"
		>
			<Brand /><button
				type="button"
				class="grid size-10 place-items-center rounded-lg border border-blue-100 text-navy"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Buka menu admin">☰</button
			>
		</header>
		<aside
			class:hidden={!menuOpen}
			class="fixed inset-y-0 left-0 z-40 w-72 border-r border-blue-100 bg-white p-5 shadow-2xl lg:relative lg:block lg:w-auto lg:shadow-none"
		>
			<div class="flex items-center justify-between">
				<Brand /><button
					type="button"
					class="text-2xl text-navy lg:hidden"
					onclick={() => (menuOpen = false)}
					aria-label="Tutup menu">×</button
				>
			</div>
			<p class="mt-9 px-3 text-[.65rem] font-extrabold tracking-[.16em] text-slate uppercase">
				Kelola masjid
			</p>
			<nav class="mt-3 grid gap-1" aria-label="Navigasi admin">
				{#each links as link (link.href)}<a
						href={resolve(link.href)}
						onclick={() => (menuOpen = false)}
						class:active={active(link.href)}
						><span aria-hidden="true">{link.icon}</span>{link.label}</a
					>{/each}
			</nav>
			<div class="absolute right-5 bottom-5 left-5 border-t border-blue-100 pt-5">
				<p class="truncate text-xs font-bold text-navy">{data.user?.name}</p>
				<p class="mt-1 truncate text-[.7rem] text-slate">
					@{data.user?.displayUsername ?? data.user?.username ?? 'pengurus'}
				</p>
				<form method="post" action="/admin/logout" class="mt-3">
					<button class="text-xs font-extrabold text-primary">Keluar →</button>
				</form>
			</div>
		</aside>
		<div class="min-w-0 p-4 sm:p-7 lg:p-10">{@render children()}</div>
	</div>
{/if}

<style>
	nav a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-radius: 0.65rem;
		padding: 0.75rem;
		color: #526a81;
		font-size: 0.82rem;
		font-weight: 800;
	}
	nav a:hover,
	nav a.active {
		background: var(--pale);
		color: var(--navy);
	}
	nav a span {
		display: grid;
		width: 1.4rem;
		place-content: center;
		color: var(--primary);
	}
</style>
