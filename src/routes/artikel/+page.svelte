<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import PageIntro from '$lib/components/PageIntro.svelte';
	import { filterArticles } from '$lib/domain/content';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let query = $state('');
	let selectedCategory = $state('');
	const category = $derived(selectedCategory || data.initialCategory);
	const visibleArticles = $derived(filterArticles(data.articles, query, category));
</script>

<svelte:head
	><title>Artikel Islam | Masjid Ar-Rahmah</title><meta
		name="description"
		content="Artikel Fikih, Akhlak, Aqidah, Muamalah, Sirah, dan Tafsir dari Masjid Ar-Rahmah."
	/></svelte:head
>
<PageIntro
	eyebrow="Ruang baca"
	title="Ilmu untuk menemani langkah."
	description="Catatan ringkas dari para asatidz dan pengurus untuk dibaca perlahan, direnungkan, lalu diamalkan."
/>
<section class="site-container py-12 sm:py-18">
	<div class="grid gap-4 border-b border-blue-100 pb-7 md:grid-cols-[1fr_auto] md:items-center">
		<label class="relative block max-w-xl"
			><span class="sr-only">Cari artikel</span><svg
				viewBox="0 0 24 24"
				class="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-primary"
				fill="none"
				stroke="currentColor"
				stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg
			><input
				class="form-control pl-12"
				type="search"
				bind:value={query}
				placeholder="Cari judul artikel…"
			/></label
		>
		<div class="flex flex-wrap gap-2" aria-label="Kategori artikel">
			<button class:active={category === 'Semua'} onclick={() => (selectedCategory = 'Semua')}
				>Semua</button
			>
			{#each data.categories as item (item.id)}<button
					class:active={category === item.name}
					onclick={() => (selectedCategory = item.name)}>{item.name}</button
				>{/each}
		</div>
	</div>
	<p class="mt-6 text-sm font-bold text-slate">{visibleArticles.length} artikel ditemukan</p>
	<div class="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each visibleArticles as article (article.id)}<ArticleCard {article} />{:else}<div
				class="col-span-full border border-dashed border-blue-200 bg-pale p-10 text-center"
			>
				<h2 class="font-display text-2xl text-navy">Artikel belum ditemukan.</h2>
				<p class="mt-2 text-sm text-slate">Coba kata kunci atau kategori lain.</p>
			</div>{/each}
	</div>
</section>

<style>
	[aria-label='Kategori artikel'] button {
		border: 1px solid #c8e3f8;
		border-radius: 0.55rem;
		padding: 0.6rem 0.75rem;
		color: #526c84;
		font-size: 0.75rem;
		font-weight: 800;
	}
	.active {
		border-color: var(--navy) !important;
		background: var(--navy);
		color: #fff !important;
	}
</style>
