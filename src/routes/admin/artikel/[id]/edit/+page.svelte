<script lang="ts">
	import ArticleForm from '$lib/components/admin/ArticleForm.svelte';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	let { data, form }: PageProps = $props();
</script>

<svelte:head
	><title>Edit Artikel | Ar-Rahmah</title><meta name="robots" content="noindex" /></svelte:head
>
<header class="mb-8">
	<a href={resolve('/admin/artikel')} class="text-xs font-extrabold text-primary">← Kembali</a>
	<h1 class="font-display mt-3 text-4xl font-semibold text-navy">Edit artikel</h1>
</header>
<ArticleForm
	categories={data.categories}
	article={data.article}
	submitLabel="Perbarui artikel"
	message={form?.message}
/>
