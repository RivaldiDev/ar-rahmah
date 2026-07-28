<script lang="ts">
	import ActivityForm from '$lib/components/admin/ActivityForm.svelte';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	let { form }: PageProps = $props();
</script>

<svelte:head
	><title>Kegiatan Baru | Ar-Rahmah</title><meta name="robots" content="noindex" /></svelte:head
>
<header class="mb-8">
	<a href={resolve('/admin/kegiatan')} class="text-xs font-extrabold text-primary">← Kembali</a>
	<h1 class="font-display mt-3 text-4xl font-semibold text-navy">Tambah kegiatan</h1>
</header>
<ActivityForm message={form?.message} />
