<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import ActivityShowcase from '$lib/components/ActivityShowcase.svelte';
	import { formatDate, formatTime } from '$lib/domain/content';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();
	const heroAutoplayMs = 5_000;
	const heroSlides = [
		{
			image: '/images/masjid-arrahmah-hero-day.webp',
			alt: 'Masjid Jami Arrahmah pada siang hari dengan kubah dan menara berwarna biru',
			eyebrow: 'Selamat datang di Masjid Ar-Rahmah',
			title: 'Teduh dalam ibadah,',
			accent: 'hangat dalam ukhuwah.',
			description:
				'Temukan jadwal salat, majelis ilmu, dan kegiatan yang menghidupkan masjid serta menyatukan warga.',
			primaryHref: '/pengajian',
			primaryLabel: 'Lihat jadwal pekan ini'
		},
		{
			image: '/images/activity-youth.webp',
			alt: 'Remaja Masjid Ar-Rahmah belajar dan berdiskusi bersama di ruang serbaguna',
			eyebrow: 'Ruang tumbuh jamaah muda',
			title: 'Belajar bersama,',
			accent: 'bertumbuh dalam iman.',
			description:
				'Kegiatan remaja menghadirkan ruang yang akrab untuk belajar, berkarya, dan saling menguatkan.',
			primaryHref: '/kegiatan',
			primaryLabel: 'Lihat kegiatan remaja'
		},
		{
			image: '/images/masjid-arrahmah-hero-night.webp',
			alt: 'Masjid Jami Arrahmah pada malam hari dengan papan nama bercahaya putih',
			eyebrow: 'Masjid hidup sepanjang hari',
			title: 'Dari Subuh hingga Isya,',
			accent: 'pintu kebaikan terbuka.',
			description:
				'Datang untuk berjamaah, menuntut ilmu, atau sekadar menyambung silaturahmi bersama warga.',
			primaryHref: '/jadwal-salat',
			primaryLabel: 'Lihat jadwal salat'
		}
	] as const;
	let activeHeroIndex = $state(0);
	let carouselPaused = $state(false);
	const activeHeroSlide = $derived(heroSlides[activeHeroIndex]);

	function showHeroSlide(index: number) {
		activeHeroIndex = (index + heroSlides.length) % heroSlides.length;
	}

	function showNextHeroSlide() {
		showHeroSlide(activeHeroIndex + 1);
	}

	onMount(() => {
		const timer = window.setInterval(() => {
			if (!carouselPaused && !prefersReducedMotion.current) showNextHeroSlide();
		}, heroAutoplayMs);
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

<section
	class="hero relative isolate overflow-hidden bg-navy text-white sm:min-h-[47rem]"
	aria-roledescription="carousel"
	aria-label="Sorotan Masjid Ar-Rahmah"
	onmouseenter={() => (carouselPaused = true)}
	onmouseleave={() => (carouselPaused = false)}
	onfocusin={() => (carouselPaused = true)}
	onfocusout={(event) => {
		if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
			carouselPaused = false;
		}
	}}
>
	{#each heroSlides as slide, index (slide.image)}
		<img
			src={slide.image}
			alt={index === activeHeroIndex ? slide.alt : ''}
			aria-hidden={index !== activeHeroIndex}
			class:active={index === activeHeroIndex}
			class="hero-slide absolute inset-0 -z-20 h-full w-full object-cover"
			fetchpriority={index === 0 ? 'high' : 'auto'}
			loading={index === 0 ? 'eager' : 'lazy'}
		/>
	{/each}
	<div class="hero-shade absolute inset-0 -z-10"></div>
	<button
		type="button"
		class="carousel-arrow carousel-arrow-previous"
		aria-label="Slide sebelumnya"
		onclick={() => showHeroSlide(activeHeroIndex - 1)}
	>
		<span aria-hidden="true">‹</span>
	</button>
	<button
		type="button"
		class="carousel-arrow carousel-arrow-next"
		aria-label="Slide berikutnya"
		onclick={showNextHeroSlide}
	>
		<span aria-hidden="true">›</span>
	</button>
	<div
		class="site-container grid min-h-[36rem] content-center py-12 sm:min-h-[47rem] sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center"
	>
		{#key activeHeroIndex}
			<div
				class="max-w-2xl pt-4"
				role="group"
				aria-roledescription="slide"
				aria-label={`${activeHeroIndex + 1} dari ${heroSlides.length}`}
				in:fade={{ duration: prefersReducedMotion.current ? 0 : 350 }}
			>
				<p
					class="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-blue-100 uppercase"
				>
					<span class="h-px w-8 bg-sky"></span>
					{activeHeroSlide.eyebrow}
				</p>
				<h1
					class="font-display mt-6 text-[clamp(3.35rem,8vw,6.8rem)] leading-[.88] font-semibold tracking-[-.045em] text-white"
				>
					{activeHeroSlide.title}<br /><em class="font-normal text-sky not-italic"
						>{activeHeroSlide.accent}</em
					>
				</h1>
				<p class="mt-7 max-w-xl text-base leading-8 text-blue-50 sm:text-lg">
					{activeHeroSlide.description}
				</p>
				<div class="mt-9 flex flex-wrap gap-3">
					<a href={resolve(activeHeroSlide.primaryHref)} class="button-primary"
						>{activeHeroSlide.primaryLabel} <span aria-hidden="true">→</span></a
					>
					<a
						href={resolve('/tentang#lokasi')}
						class="button-secondary bg-white/10! text-white! backdrop-blur-sm">Petunjuk ke masjid</a
					>
				</div>
			</div>
		{/key}
		<div class="carousel-status">
			<div class="carousel-indicators" aria-label="Pilih slide">
				{#each heroSlides as slide, index (slide.image)}
					<button
						type="button"
						aria-label={`Tampilkan slide ${index + 1}: ${slide.title} ${slide.accent}`}
						aria-current={index === activeHeroIndex ? 'true' : undefined}
						onclick={() => showHeroSlide(index)}
					>
						<span aria-hidden="true"></span>
					</button>
				{/each}
			</div>
			<div class="carousel-progress" class:paused={carouselPaused} aria-hidden="true">
				{#key activeHeroIndex}
					<span style={`--hero-autoplay: ${heroAutoplayMs}ms`}></span>
				{/key}
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

<section id="kegiatan" class="py-20 sm:py-28" aria-label="Kegiatan Masjid Ar-Rahmah">
	<div class="site-container">
		<div class="grid items-end gap-6 md:grid-cols-[1fr_auto]">
			<div>
				<p class="eyebrow">Yang terdekat</p>
				<h2 id="kegiatan-heading" class="section-title mt-3">Mari hidupkan masjid bersama.</h2>
			</div>
			<a href={resolve('/kegiatan')} class="button-secondary w-fit"
				>Semua kegiatan <span aria-hidden="true">→</span></a
			>
		</div>
		<div class="mt-10">
			<ActivityShowcase activities={data.activities} />
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
	.hero-slide {
		object-position: 64% center;
		opacity: 0;
		transform: scale(1.015);
		transition:
			opacity 700ms ease,
			transform 5s ease;
	}
	.hero-slide.active {
		opacity: 1;
		transform: scale(1);
	}
	.hero-slide[src*='activity-youth'] {
		object-position: center 44%;
	}
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
	.carousel-arrow {
		position: absolute;
		z-index: 20;
		top: calc(50% - 3.5rem);
		display: none;
		width: 2.8rem;
		height: 2.8rem;
		place-items: center;
		border: 1px solid rgb(255 255 255 / 48%);
		border-radius: 999px;
		background: rgb(4 31 73 / 36%);
		color: #fff;
		font: 300 2rem/1 var(--font-body);
		backdrop-filter: blur(8px);
		transition:
			border-color 180ms ease,
			background 180ms ease,
			transform 180ms ease;
	}
	.carousel-arrow:hover {
		border-color: #fff;
		background: rgb(10 61 145 / 76%);
		transform: scale(1.04);
	}
	.carousel-arrow-previous {
		left: 1.25rem;
	}
	.carousel-arrow-next {
		right: 1.25rem;
	}
	.carousel-status {
		z-index: 20;
		width: min(14rem, 100%);
		margin-top: 2.25rem;
	}
	.carousel-indicators {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.carousel-indicators button {
		display: grid;
		min-width: 1.75rem;
		min-height: 1.75rem;
		place-items: center;
		border-radius: 999px;
	}
	.carousel-indicators span {
		display: block;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 52%);
		transition:
			width 220ms ease,
			background 220ms ease;
	}
	.carousel-indicators [aria-current='true'] span {
		width: 1.5rem;
		background: var(--sky);
	}
	.carousel-progress {
		height: 2px;
		margin: 0.4rem 0.45rem 0;
		overflow: hidden;
		background: rgb(255 255 255 / 22%);
	}
	.carousel-progress span {
		display: block;
		width: 100%;
		height: 100%;
		transform-origin: left;
		background: var(--sky);
		animation: hero-progress var(--hero-autoplay) linear forwards;
	}
	.carousel-progress.paused span {
		animation-play-state: paused;
	}
	@keyframes hero-progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
	@media (min-width: 640px) {
		.carousel-arrow {
			display: grid;
		}
		.carousel-status {
			position: absolute;
			right: max(1.5rem, calc((100vw - 1180px) / 2));
			bottom: 7.15rem;
			margin-top: 0;
		}
	}
	@media (max-width: 767px) {
		.hero-shade {
			background:
				linear-gradient(90deg, rgb(5 40 98 / 91%), rgb(10 61 145 / 58%)),
				linear-gradient(0deg, rgb(5 35 80 / 65%), transparent);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hero-slide {
			transform: none;
			transition: none;
		}
		.carousel-progress span {
			animation: none;
		}
	}
</style>
