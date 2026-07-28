<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import ActivityCard from '$lib/components/ActivityCard.svelte';
	import { formatDate, formatTime } from '$lib/domain/content';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();
	let heroPeriod = $state<'day' | 'night'>('day');
	const heroImage = $derived(
		heroPeriod === 'night'
			? '/images/masjid-arrahmah-hero-night.webp'
			: '/images/masjid-arrahmah-hero-day.webp'
	);
	const heroAlt = $derived(
		heroPeriod === 'night'
			? 'Masjid Jami Arrahmah pada malam hari dengan papan nama bercahaya putih'
			: 'Masjid Jami Arrahmah pada siang hari dengan papan nama putih tanpa cahaya'
	);

	onMount(() => {
		const updateHeroPeriod = () => {
			const jakartaHour = Number(
				new Intl.DateTimeFormat('id-ID', {
					timeZone: 'Asia/Jakarta',
					hour: '2-digit',
					hourCycle: 'h23'
				}).format(new Date())
			);
			heroPeriod = jakartaHour >= 18 || jakartaHour < 5 ? 'night' : 'day';
		};
		updateHeroPeriod();
		const timer = window.setInterval(updateHeroPeriod, 5 * 60 * 1000);
		return () => window.clearInterval(timer);
	});
	const prayers = $derived(
		data.todayPrayer
			? [
					['Subuh', data.todayPrayer.subuh],
					['Zuhur', data.todayPrayer.dzuhur],
					['Asar', data.todayPrayer.ashar],
					['Magrib', data.todayPrayer.maghrib],
					['Isya', data.todayPrayer.isya],
					["Jumu'ah", '11.45']
				]
			: [
					['Subuh', '04.43'],
					['Zuhur', '12.00'],
					['Asar', '15.22'],
					['Magrib', '17.54'],
					['Isya', '19.07'],
					["Jumu'ah", '11.45']
				]
	);
</script>

<svelte:head>
	<title>Masjid Ar-Rahmah — Teduh dalam Ibadah, Hangat dalam Ukhuwah</title>
	<meta property="og:title" content="Masjid Ar-Rahmah" />
	<meta
		property="og:description"
		content="Jadwal salat, pengajian, kegiatan, dan artikel Islam untuk jamaah Ar-Rahmah."
	/>
	<meta property="og:image" content="/images/masjid-arrahmah-hero-day.webp" />
</svelte:head>

<section class="hero relative isolate overflow-hidden bg-navy text-white sm:min-h-[47rem]">
	<img
		src={heroImage}
		alt={heroAlt}
		class="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center]"
		fetchpriority="high"
	/>
	<div class="hero-shade absolute inset-0 -z-10"></div>
	<div
		class="site-container grid min-h-[36rem] content-center py-12 sm:min-h-[47rem] sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center"
	>
		<div class="max-w-2xl pt-4">
			<p
				class="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-blue-100 uppercase"
			>
				<span class="h-px w-8 bg-sky"></span> Selamat datang di Masjid Ar-Rahmah
			</p>
			<h1
				class="font-display mt-6 text-[clamp(3.4rem,9vw,6.8rem)] leading-[.88] font-semibold tracking-[-.045em] text-white"
			>
				Teduh dalam ibadah,<br /><em class="font-normal text-sky not-italic"
					>hangat dalam ukhuwah.</em
				>
			</h1>
			<p class="mt-7 max-w-xl text-base leading-8 text-blue-50 sm:text-lg">
				Temukan jadwal salat, majelis ilmu, dan kegiatan yang menghidupkan masjid serta menyatukan
				warga.
			</p>
			<div class="mt-9 flex flex-wrap gap-3">
				<a href={resolve('/pengajian')} class="button-primary"
					>Lihat jadwal pekan ini <span aria-hidden="true">→</span></a
				>
				<a
					href={resolve('/tentang#lokasi')}
					class="button-secondary bg-white/10! text-white! backdrop-blur-sm">Petunjuk ke masjid</a
				>
			</div>
		</div>
	</div>
	<div
		class="relative border-t border-white/15 bg-navy/90 backdrop-blur-md sm:absolute sm:right-0 sm:bottom-0 sm:left-0 sm:bg-navy/85"
	>
		<div class="site-container grid gap-px py-4 sm:grid-cols-[1.3fr_repeat(6,1fr)] sm:py-0">
			<div
				class="flex items-center justify-between py-2 sm:block sm:border-r sm:border-white/10 sm:py-4"
			>
				<a
					href={resolve('/jadwal-salat')}
					class="text-xs font-bold tracking-widest text-sky uppercase hover:text-white"
					>Waktu salat hari ini</a
				>
				<p class="mt-1 text-xs text-blue-200">Kab. Karawang</p>
			</div>
			<div class="grid grid-cols-3 gap-2 sm:contents">
				{#each prayers as prayer (prayer[0])}<div
						class="text-center sm:grid sm:place-content-center sm:py-4"
					>
						<span class="block text-[.66rem] font-bold tracking-wider text-blue-200 uppercase"
							>{prayer[0]}</span
						><strong class="font-display mt-1 block text-lg font-semibold text-white"
							>{prayer[1]}</strong
						>
					</div>{/each}
			</div>
		</div>
	</div>
</section>

<section class="py-20 sm:py-28">
	<div class="site-container">
		<div class="grid items-end gap-6 md:grid-cols-[1fr_auto]">
			<div>
				<p class="eyebrow">Yang terdekat</p>
				<h2 class="section-title mt-3">Mari hidupkan masjid bersama.</h2>
			</div>
			<a href={resolve('/kegiatan')} class="button-secondary w-fit"
				>Semua kegiatan <span aria-hidden="true">→</span></a
			>
		</div>
		<div class="mt-10 grid gap-6">
			{#each data.activities as activity (activity.id)}<ActivityCard {activity} />{/each}
		</div>
	</div>
</section>

<section class="pattern-light border-y border-blue-100 bg-pale py-20 sm:py-28">
	<div class="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
		<div class="lg:sticky lg:top-28">
			<p class="eyebrow">Majelis ilmu</p>
			<h2 class="section-title mt-3">Belajar yang dekat, tumbuh yang lekat.</h2>
			<p class="mt-5 max-w-md leading-8 text-slate">
				Kajian rutin dan tematik untuk jamaah putra, putri, remaja, dan keluarga.
			</p>
			<a href={resolve('/pengajian')} class="button-primary mt-7">Jadwal lengkap</a>
		</div>
		<div class="divide-y divide-blue-100 border-y border-blue-200 bg-white">
			{#each data.studies as study (study.id)}
				<article class="grid gap-4 p-5 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:p-7">
					<div>
						<strong class="font-display text-xl text-navy"
							>{formatDate(study.startsAt, { year: undefined })}</strong
						><span class="mt-1 block text-xs font-bold text-primary"
							>{formatTime(study.startsAt)} WIB</span
						>
					</div>
					<div>
						<h3 class="text-base font-extrabold text-navy">{study.topic}</h3>
						<p class="mt-1 text-sm text-slate">{study.speaker} · {study.location}</p>
					</div>
					<span
						class="w-fit rounded-md bg-pale px-2.5 py-1 text-[.68rem] font-extrabold tracking-wide text-navy uppercase"
						>{study.recurrence ?? 'Khusus'}</span
					>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="py-20 sm:py-28">
	<div class="site-container">
		<div class="grid items-end gap-6 md:grid-cols-[1fr_auto]">
			<div>
				<p class="eyebrow">Bekal keseharian</p>
				<h2 class="section-title mt-3">Baca, renungkan, amalkan.</h2>
			</div>
			<a href={resolve('/artikel')} class="button-secondary w-fit">Lihat semua artikel</a>
		</div>
		{#if data.articles.length}<div class="mt-10 grid gap-6 lg:grid-cols-3">
				{#each data.articles.slice(0, 3) as article (article.id)}<ArticleCard {article} />{/each}
			</div>{/if}
	</div>
</section>

<section class="site-container mb-8">
	<div
		class="relative overflow-hidden bg-navy px-6 py-14 text-white sm:px-12 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:px-16"
	>
		<div>
			<p class="text-xs font-extrabold tracking-[.17em] text-sky uppercase">Alirkan manfaat</p>
			<h2 class="font-display mt-3 max-w-2xl text-3xl leading-tight font-semibold sm:text-5xl">
				Satu infaq, banyak pintu kebaikan.
			</h2>
			<p class="mt-4 max-w-xl leading-7 text-blue-100">
				Dukung operasional masjid, pendidikan Al-Qur'an, dan santunan warga yang membutuhkan.
			</p>
		</div>
		<a href={resolve('/tentang#infaq')} class="button-primary mt-7 lg:mt-0">Informasi infaq</a>
	</div>
</section>

<style>
	.hero-shade {
		background:
			linear-gradient(
				90deg,
				rgb(5 40 98 / 94%) 0%,
				rgb(10 61 145 / 78%) 35%,
				rgb(10 61 145 / 18%) 68%,
				rgb(10 61 145 / 8%) 100%
			),
			linear-gradient(0deg, rgb(5 35 80 / 45%), transparent 45%);
	}
	@media (max-width: 767px) {
		.hero-shade {
			background:
				linear-gradient(90deg, rgb(5 40 98 / 91%), rgb(10 61 145 / 58%)),
				linear-gradient(0deg, rgb(5 35 80 / 65%), transparent);
		}
	}
</style>
