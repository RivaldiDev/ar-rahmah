<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#0A3D91" />
	<meta
		name="description"
		content="Masjid Ar-Rahmah — pusat ibadah, kegiatan, pengajian, dan artikel Islam untuk masyarakat."
	/>
</svelte:head>

{#if page.url.pathname.startsWith('/admin')}
	<main>{@render children()}</main>
{:else}
	<SiteHeader />
	<main>{@render children()}</main>
	<SiteFooter />
{/if}
