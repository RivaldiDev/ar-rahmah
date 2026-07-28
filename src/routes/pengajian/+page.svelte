<script lang="ts">
	import PageIntro from '$lib/components/PageIntro.svelte';
	import { formatDate, formatTime } from '$lib/domain/content';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>Jadwal Pengajian | Masjid Ar-Rahmah</title><meta
		name="description"
		content="Jadwal kajian dan pengajian rutin Masjid Ar-Rahmah."
	/></svelte:head
>
<PageIntro
	eyebrow="Majelis ilmu"
	title="Jadwal pengajian Ar-Rahmah."
	description="Susun waktu untuk duduk bersama para asatidz, memperdalam agama, dan membawa pulang amal yang nyata."
/>
<section class="site-container py-14 sm:py-20">
	<div class="grid gap-8 lg:grid-cols-[1fr_20rem]">
		<div class="border-t border-blue-200">
			{#each data.studies as study (study.id)}<article
					class="grid gap-5 border-b border-blue-100 py-7 sm:grid-cols-[9rem_1fr] sm:py-9"
				>
					<div>
						<p class="font-display text-2xl font-semibold text-navy">
							{formatDate(study.startsAt, { year: undefined })}
						</p>
						<p class="mt-1 text-sm font-extrabold text-primary">{formatTime(study.startsAt)} WIB</p>
					</div>
					<div>
						<div class="flex flex-wrap items-start justify-between gap-2">
							<h2 class="font-display text-2xl font-semibold text-navy">{study.topic}</h2>
							{#if study.recurrence}<span
									class="rounded-md bg-pale px-2.5 py-1 text-xs font-bold text-navy"
									>{study.recurrence}</span
								>{/if}
						</div>
						<p class="mt-3 text-sm font-bold text-slate">Pemateri: {study.speaker}</p>
						<p class="mt-2 text-sm text-slate">Lokasi: {study.location}</p>
					</div>
				</article>{/each}
		</div>
		<aside class="h-fit bg-pale p-6 lg:sticky lg:top-28">
			<p class="eyebrow">Catatan jamaah</p>
			<h2 class="font-display mt-3 text-2xl font-semibold text-navy">Datang sedikit lebih awal.</h2>
			<ul class="mt-5 space-y-3 text-sm leading-6 text-slate">
				<li>• Bawa alat tulis dan Al-Qur'an.</li>
				<li>• Area putra dan putri tersedia.</li>
				<li>• Jadwal dapat berubah saat hari besar Islam.</li>
			</ul>
			<a href="https://wa.me/6281234567890" class="button-primary mt-6">Tanya pengurus</a>
		</aside>
	</div>
</section>
