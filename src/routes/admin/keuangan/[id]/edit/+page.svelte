<script lang="ts">
	import { resolve } from '$app/paths';
	import FinanceForm from '$lib/components/admin/FinanceForm.svelte';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Edit Transaksi | Ar-Rahmah</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<header class="mb-8">
	<a href={resolve('/admin/keuangan')} class="text-xs font-extrabold text-primary">← Kembali</a>
	<h1 class="font-display mt-3 text-4xl font-semibold text-navy">Edit transaksi</h1>
</header>

<FinanceForm
	funds={data.funds}
	transaction={data.transaction}
	submitLabel="Perbarui transaksi"
	message={form?.message}
/>
