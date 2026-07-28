<script lang="ts">
	import type { PageProps } from './$types';
	import { formatDate } from '$lib/domain/content';
	import { resolve } from '$app/paths';
	let { data }: PageProps = $props();
	const stats = $derived([
		{ label: 'Total artikel', value: data.articleCount, symbol: 'A' },
		{ label: 'Draf menunggu', value: data.draftCount, symbol: 'D' },
		{ label: 'Kegiatan mendatang', value: data.activityCount, symbol: 'K' },
		{ label: 'Jadwal pengajian', value: data.studyCount, symbol: 'P' }
	]);
</script>

<svelte:head
	><title>Dashboard | Ar-Rahmah</title><meta name="robots" content="noindex" /></svelte:head
>
<header class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<p class="eyebrow">Dashboard takmir</p>
		<h1 class="font-display mt-2 text-4xl font-semibold text-navy">Ringkasan hari ini.</h1>
	</div>
	<div class="flex gap-2">
		<a href={resolve('/admin/artikel/new')} class="button-primary">+ Tulis artikel</a><a
			href={resolve('/admin/kegiatan/new')}
			class="button-secondary">+ Kegiatan</a
		><a href={resolve('/admin/keuangan/new')} class="button-secondary">+ Transaksi</a>
	</div>
</header>
<section class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	{#each stats as stat (stat.label)}<article class="border border-blue-100 bg-white p-5">
			<div
				class="grid size-9 place-items-center rounded-lg bg-pale text-xs font-black text-primary"
			>
				{stat.symbol}
			</div>
			<strong class="font-display mt-5 block text-4xl font-semibold text-navy">{stat.value}</strong>
			<p class="mt-1 text-xs font-bold text-slate">{stat.label}</p>
		</article>{/each}
</section>
<section class="mt-8 border border-blue-100 bg-white">
	<div class="flex items-center justify-between border-b border-blue-100 p-5">
		<div>
			<p class="eyebrow">Perlu dilanjutkan</p>
			<h2 class="font-display mt-1 text-2xl font-semibold text-navy">Draf terbaru</h2>
		</div>
		<a href={resolve('/admin/artikel')} class="text-xs font-extrabold text-primary">Lihat semua</a>
	</div>
	{#each data.recentDrafts as article (article.id)}<a
			href={resolve('/admin/artikel/[id]/edit', { id: article.id })}
			class="grid gap-2 border-b border-blue-50 p-5 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"
			><div>
				<h3 class="font-bold text-navy">{article.title}</h3>
				<p class="mt-1 text-xs text-slate">
					{article.category} · diperbarui {formatDate(article.updatedAt)}
				</p>
			</div>
			<span class="text-primary">Edit →</span></a
		>{:else}<p class="p-6 text-sm text-slate">Tidak ada draf. Semua tulisan sudah rapi.</p>{/each}
</section>
