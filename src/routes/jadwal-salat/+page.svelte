<script lang="ts">
	import { resolve } from '$app/paths';
	import PageIntro from '$lib/components/PageIntro.svelte';
	import { formatPeriod, shiftPeriod } from '$lib/domain/prayer-times';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const selectedLocation = $derived(
		data.schedule?.locationId ?? '1ff8a7b5dc7a7d1f0ed65aaa29c04b1e'
	);
	const previousPeriod = $derived(shiftPeriod(data.period, -1));
	const nextPeriod = $derived(shiftPeriod(data.period, 1));
	const todaySchedule = $derived(data.schedule?.rows.find((row) => row.date === data.today));
	const prayerFields = [
		['imsak', 'Imsak'],
		['subuh', 'Subuh'],
		['terbit', 'Terbit'],
		['dhuha', 'Dhuha'],
		['dzuhur', 'Zuhur'],
		['ashar', 'Asar'],
		['maghrib', 'Magrib'],
		['isya', 'Isya']
	] as const;
</script>

<svelte:head>
	<title>Jadwal Salat | Masjid Ar-Rahmah</title>
	<meta
		name="description"
		content="Jadwal salat harian dan bulanan untuk Kabupaten Karawang dan kabupaten/kota lain di Indonesia."
	/>
</svelte:head>

<PageIntro
	eyebrow="Waktu ibadah"
	title="Jadwal salat bulanan."
	description="Karawang dipilih secara otomatis. Ganti kabupaten atau kota untuk menyesuaikan jadwal perjalanan dan keluarga."
/>

<section class="site-container py-10 sm:py-16">
	<form
		method="GET"
		class="grid gap-4 border border-blue-100 bg-pale p-5 sm:p-7 lg:grid-cols-[1fr_15rem_auto] lg:items-end"
	>
		<label class="grid gap-2 text-sm font-extrabold text-navy">
			Kabupaten atau kota
			<select
				name="location"
				value={selectedLocation}
				class="min-h-12 w-full border-blue-200 bg-white text-base font-medium text-slate focus:border-primary focus:ring-primary"
			>
				{#each data.locations as location (location.id)}
					<option value={location.id}>{location.lokasi}</option>
				{/each}
			</select>
		</label>
		<label class="grid gap-2 text-sm font-extrabold text-navy">
			Bulan
			<input
				type="month"
				name="period"
				value={data.period}
				class="min-h-12 w-full border-blue-200 bg-white text-base text-slate focus:border-primary focus:ring-primary"
			/>
		</label>
		<button type="submit" class="button-primary min-h-12 justify-center">Tampilkan jadwal</button>
	</form>

	{#if data.errorMessage}
		<div class="mt-8 border border-red-200 bg-red-50 p-6 text-red-900" role="alert">
			<h2 class="font-display text-2xl font-semibold">Jadwal belum dapat dimuat.</h2>
			<p class="mt-2">{data.errorMessage}</p>
		</div>
	{:else if data.schedule}
		<div class="mt-10 grid gap-8 xl:grid-cols-[17rem_1fr] xl:items-start">
			<aside class="bg-navy p-6 text-white sm:p-8 xl:sticky xl:top-28">
				<p class="text-xs font-extrabold tracking-[0.16em] text-sky uppercase">Lokasi terpilih</p>
				<h2 class="font-display mt-3 text-3xl leading-tight font-semibold">
					{data.schedule.location}
				</h2>
				<p class="mt-2 text-sm text-blue-100">{data.schedule.province}</p>
				<p class="mt-6 border-t border-white/15 pt-5 text-sm text-blue-100">
					Jadwal {formatPeriod(data.period)}
				</p>

				{#if todaySchedule}
					<div class="mt-7 border-t border-white/15 pt-6">
						<p class="text-xs font-extrabold tracking-[0.14em] text-sky uppercase">Hari ini</p>
						<p class="mt-2 text-sm text-blue-100">{todaySchedule.label}</p>
						<div class="mt-5 grid grid-cols-2 gap-x-5 gap-y-4">
							{#each prayerFields.slice(1) as field (field[0])}
								<div>
									<span class="block text-[0.65rem] font-bold tracking-wide text-blue-200 uppercase"
										>{field[1]}</span
									>
									<strong class="font-display mt-0.5 block text-xl font-semibold"
										>{todaySchedule[field[0]]}</strong
									>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</aside>

			<div class="min-w-0">
				<div
					class="flex flex-col gap-4 border-b border-blue-100 pb-6 sm:flex-row sm:items-end sm:justify-between"
				>
					<div>
						<p class="eyebrow">Satu bulan penuh</p>
						<h2 class="font-display mt-2 text-3xl font-semibold text-navy sm:text-4xl">
							{formatPeriod(data.period)}
						</h2>
					</div>
					<div class="flex flex-wrap gap-2">
						<form method="GET" action={resolve('/jadwal-salat')}>
							<input type="hidden" name="location" value={selectedLocation} />
							<input type="hidden" name="period" value={previousPeriod} />
							<button
								type="submit"
								class="button-secondary min-h-11 px-4"
								aria-label="Bulan sebelumnya">←</button
							>
						</form>
						<form method="GET" action={resolve('/jadwal-salat')}>
							<input type="hidden" name="location" value={selectedLocation} />
							<input type="hidden" name="period" value={nextPeriod} />
							<button
								type="submit"
								class="button-secondary min-h-11 px-4"
								aria-label="Bulan berikutnya">→</button
							>
						</form>
						<form method="GET" action={resolve('/jadwal-salat/pdf')}>
							<input type="hidden" name="location" value={selectedLocation} />
							<input type="hidden" name="period" value={data.period} />
							<button type="submit" class="button-primary min-h-11">Unduh PDF</button>
						</form>
					</div>
				</div>

				<div class="mt-6 grid gap-4 md:hidden">
					{#each data.schedule.rows as row (row.date)}
						<article
							class:today={row.date === data.today}
							class="schedule-card border border-blue-100 bg-white p-5"
						>
							<div class="flex items-center justify-between gap-3 border-b border-blue-100 pb-4">
								<h3 class="font-display text-xl font-semibold text-navy">{row.label}</h3>
								{#if row.date === data.today}
									<span
										class="bg-primary px-2 py-1 text-[0.65rem] font-extrabold text-white uppercase"
										>Hari ini</span
									>
								{/if}
							</div>
							<dl class="mt-4 grid grid-cols-4 gap-x-3 gap-y-4">
								{#each prayerFields as field (field[0])}
									<div>
										<dt class="text-[0.62rem] font-extrabold tracking-wide text-primary uppercase">
											{field[1]}
										</dt>
										<dd class="font-display mt-1 text-lg font-semibold text-navy">
											{row[field[0]]}
										</dd>
									</div>
								{/each}
							</dl>
						</article>
					{/each}
				</div>

				<div class="mt-6 hidden overflow-x-auto border border-blue-100 md:block">
					<table class="w-full min-w-[48rem] border-collapse text-sm">
						<thead class="bg-navy text-white">
							<tr>
								<th class="sticky left-0 z-10 bg-navy px-4 py-4 text-left">Tanggal</th>
								{#each prayerFields as field (field[0])}
									<th class="px-3 py-4 text-center">{field[1]}</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-y divide-blue-100">
							{#each data.schedule.rows as row (row.date)}
								<tr class:bg-pale={row.date === data.today}>
									<th class="sticky left-0 bg-white px-4 py-3 text-left font-bold text-navy">
										{row.label}
									</th>
									{#each prayerFields as field (field[0])}
										<td class="px-3 py-3 text-center font-semibold text-slate">{row[field[0]]}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<p class="mt-8 text-xs leading-6 text-slate">
			Sumber jadwal: API Muslim myQuran. Selisih satu hingga dua menit dapat terjadi; ikuti azan dan
			ketetapan masjid setempat.
		</p>
	{/if}
</section>

<style>
	.schedule-card.today {
		border-color: var(--primary);
		background: var(--pale);
	}
</style>
