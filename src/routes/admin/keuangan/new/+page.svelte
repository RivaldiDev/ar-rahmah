<script lang="ts">
	import { resolve } from '$app/paths';
	import FinanceForm from '$lib/components/admin/FinanceForm.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Transaksi Baru | Ar-Rahmah</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<header class="mb-8">
	<a href={resolve('/admin/keuangan')} class="text-xs font-extrabold text-primary">← Kembali</a>
	<h1 class="font-display mt-3 text-4xl font-semibold text-navy">Tambah transaksi</h1>
	<p class="mt-2 text-sm text-slate">Pilih dana, lalu catat pemasukan atau pengeluarannya.</p>
</header>

<FinanceForm funds={data.funds} message={form?.message} />
