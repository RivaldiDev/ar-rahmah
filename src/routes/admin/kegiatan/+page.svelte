<script lang="ts">
	import { formatDate, formatTime } from '$lib/domain/content';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>Kelola Kegiatan | Ar-Rahmah</title><meta name="robots" content="noindex" /></svelte:head
>
<header class="flex flex-wrap items-end justify-between gap-4">
	<div>
		<p class="eyebrow">Agenda</p>
		<h1 class="font-display mt-2 text-4xl font-semibold text-navy">Kegiatan</h1>
		<p class="mt-2 text-sm text-slate">Atur agenda sosial dan kebersamaan jamaah.</p>
	</div>
	<a href={resolve('/admin/kegiatan/new')} class="button-primary">+ Kegiatan baru</a>
</header>
<div class="mt-8 overflow-x-auto border border-blue-100 bg-white">
	<table class="w-full min-w-3xl text-left text-sm">
		<thead class="bg-pale text-[.68rem] tracking-wider text-navy uppercase"
			><tr
				><th class="p-4">Kegiatan</th><th class="p-4">Waktu</th><th class="p-4">Lokasi</th><th
					class="p-4 text-right">Aksi</th
				></tr
			></thead
		><tbody class="divide-y divide-blue-50"
			>{#each data.activities as activity (activity.id)}<tr
					><td class="p-4"
						><div class="flex items-center gap-3">
							<img src={activity.coverImage} alt="" class="size-12 object-cover" /><strong
								class="text-navy">{activity.title}</strong
							>
						</div></td
					><td class="p-4 text-xs text-slate"
						>{formatDate(activity.startsAt)}<br />{formatTime(activity.startsAt)} WIB</td
					><td class="p-4 text-slate">{activity.location}</td><td class="p-4"
						><div class="flex justify-end gap-3">
							<a
								class="font-bold text-primary"
								href={resolve('/admin/kegiatan/[id]/edit', { id: activity.id })}>Edit</a
							>
							<form method="post" action="?/delete">
								<input type="hidden" name="id" value={activity.id} /><button
									class="font-bold text-red-600"
									type="submit">Hapus</button
								>
							</form>
						</div></td
					></tr
				>{:else}<tr><td colspan="4" class="p-8 text-center text-slate">Belum ada kegiatan.</td></tr
				>{/each}</tbody
		>
	</table>
</div>
