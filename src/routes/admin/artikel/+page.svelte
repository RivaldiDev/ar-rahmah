<script lang="ts">
	import { formatDate } from '$lib/domain/content';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>Kelola Artikel | Ar-Rahmah</title><meta name="robots" content="noindex" /></svelte:head
>
<header class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<p class="eyebrow">Konten</p>
		<h1 class="font-display mt-2 text-4xl font-semibold text-navy">Artikel</h1>
		<p class="mt-2 text-sm text-slate">Kelola tulisan yang dibaca jamaah.</p>
	</div>
	<a href={resolve('/admin/artikel/new')} class="button-primary">+ Artikel baru</a>
</header>
<div class="mt-8 overflow-x-auto border border-blue-100 bg-white">
	<table class="w-full min-w-3xl text-left text-sm">
		<thead class="bg-pale text-[.68rem] tracking-wider text-navy uppercase"
			><tr
				><th class="p-4">Judul</th><th class="p-4">Kategori</th><th class="p-4">Status</th><th
					class="p-4">Diperbarui</th
				><th class="p-4 text-right">Aksi</th></tr
			></thead
		><tbody class="divide-y divide-blue-50"
			>{#each data.articles as article (article.id)}<tr
					><td class="p-4"
						><strong class="block text-navy">{article.title}</strong><span
							class="mt-1 block text-xs text-slate">oleh {article.author}</span
						></td
					><td class="p-4 text-slate">{article.category}</td><td class="p-4"
						><span class:published={article.status === 'published'} class="status"
							>{article.status === 'published' ? 'Terbit' : 'Draf'}</span
						></td
					><td class="p-4 text-xs text-slate">{formatDate(article.updatedAt)}</td><td class="p-4"
						><div class="flex justify-end gap-3">
							<a
								class="font-bold text-primary"
								href={resolve('/admin/artikel/[id]/edit', { id: article.id })}>Edit</a
							>
							<form method="post" action="?/delete">
								<input type="hidden" name="id" value={article.id} /><button
									class="font-bold text-red-600"
									type="submit">Hapus</button
								>
							</form>
						</div></td
					></tr
				>{:else}<tr><td colspan="5" class="p-8 text-center text-slate">Belum ada artikel.</td></tr
				>{/each}</tbody
		>
	</table>
</div>

<style>
	.status {
		display: inline-block;
		border-radius: 0.4rem;
		background: #fff2ce;
		padding: 0.3rem 0.55rem;
		color: #8d5f00;
		font-size: 0.68rem;
		font-weight: 850;
	}
	.published {
		background: #e1f7ec;
		color: #087844;
	}
</style>
