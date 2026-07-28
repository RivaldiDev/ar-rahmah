<script lang="ts">
	import PageIntro from '$lib/components/PageIntro.svelte';
	const committee = [
		{
			role: 'Ketua Takmir',
			name: 'H. Ahmad Fauzan',
			photo: '/images/committee/ketua.webp'
		},
		{
			role: 'Sekretaris',
			name: 'Muhammad Ridwan',
			photo: '/images/committee/sekretaris.webp'
		},
		{
			role: 'Bendahara',
			name: 'Siti Rahmawati',
			photo: '/images/committee/bendahara.webp'
		},
		{
			role: 'Bidang Dakwah',
			name: 'Ust. Farid Maulana',
			photo: '/images/committee/dakwah.webp'
		},
		{
			role: 'Bidang Sosial',
			name: 'Nur Aisyah',
			photo: '/images/committee/sosial.webp'
		},
		{
			role: 'Bidang Pemuda',
			name: 'Fikri Ananda',
			photo: '/images/committee/pemuda.webp'
		}
	];

	const mosqueLocation = {
		coordinates: `6°17'31.7"S 107°27'08.9"E`,
		embedUrl: 'https://www.google.com/maps?q=-6.292139%2C107.452472&z=17&output=embed'
	};
</script>

<svelte:head
	><title>Tentang Kami | Masjid Ar-Rahmah</title><meta
		name="description"
		content="Sejarah, visi, takmir, dan lokasi Masjid Ar-Rahmah."
	/></svelte:head
>
<PageIntro
	eyebrow="Mengenal Ar-Rahmah"
	title="Masjid yang tumbuh bersama kampungnya."
	description="Dibangun dari gotong royong warga, Ar-Rahmah hadir sebagai rumah ibadah sekaligus ruang tumbuh lintas generasi."
/>
<section
	class="site-container grid gap-12 py-16 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-24"
>
	<img
		src="/images/masjid-arrahmah-hero-day.webp"
		alt="Tampak depan Masjid Ar-Rahmah"
		class="aspect-[4/3] w-full object-cover object-[68%_center]"
	/>
	<div>
		<p class="eyebrow">Sejak 1998</p>
		<h2 class="section-title mt-3">Bermula dari niat baik warga.</h2>
		<p class="mt-6 leading-8 text-slate">
			Ar-Rahmah berdiri dari musala kecil yang dibangun warga secara swadaya. Seiring bertambahnya
			jamaah, bangunan diperluas menjadi masjid yang menaungi salat berjamaah, pendidikan Al-Qur'an,
			kajian, dan pelayanan sosial.
		</p>
		<p class="mt-4 leading-8 text-slate">
			Hari ini, kami terus menjaga semangat awal itu: masjid yang terbuka, ramah keluarga, dan peka
			terhadap kebutuhan lingkungan sekitar.
		</p>
	</div>
</section>
<section class="border-y border-blue-100 bg-pale py-16 sm:py-20">
	<div class="site-container grid gap-6 md:grid-cols-2">
		<div class="bg-white p-7 sm:p-10">
			<p class="eyebrow">Visi</p>
			<h2 class="font-display mt-3 text-3xl font-semibold text-navy">
				Menjadi pusat ibadah dan peradaban umat.
			</h2>
			<p class="mt-4 leading-7 text-slate">
				Mewujudkan masjid yang makmur, inklusif, berilmu, dan memberi manfaat nyata bagi masyarakat.
			</p>
		</div>
		<div class="bg-navy p-7 text-white sm:p-10">
			<p class="text-xs font-extrabold tracking-[.16em] text-sky uppercase">Misi</p>
			<ul class="mt-5 space-y-4 leading-7 text-blue-50">
				<li>01 · Menyelenggarakan ibadah yang tertib dan nyaman.</li>
				<li>02 · Menguatkan pendidikan Islam lintas usia.</li>
				<li>03 · Menggerakkan kepedulian sosial dan ekonomi jamaah.</li>
			</ul>
		</div>
	</div>
</section>
<section class="site-container py-16 sm:py-24">
	<div class="mx-auto max-w-3xl text-center">
		<p class="eyebrow">Susunan kepengurusan</p>
		<h2 class="section-title mt-3">Melayani dengan amanah.</h2>
		<p class="mt-5 leading-7 text-slate">
			Pengurus takmir bekerja bersama untuk menjaga ibadah, dakwah, pelayanan sosial, dan kegiatan
			generasi muda.
		</p>
	</div>

	<div class="org-chart mx-auto mt-12 max-w-6xl">
		<div class="org-leader mx-auto max-w-64">
			<article class="committee-card">
				<img src={committee[0].photo} alt={`Ilustrasi ${committee[0].name}`} />
				<p>{committee[0].role}</p>
				<h3>{committee[0].name}</h3>
			</article>
		</div>
		<ol class="org-team grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
			{#each committee.slice(1) as member (member.role)}
				<li>
					<article class="committee-card h-full">
						<img src={member.photo} alt={`Ilustrasi ${member.name}`} />
						<p>{member.role}</p>
						<h3>{member.name}</h3>
					</article>
				</li>
			{/each}
		</ol>
	</div>
	<p class="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-slate">
		Foto di atas merupakan ilustrasi representatif sementara dan dapat diganti dengan foto resmi
		masing-masing pengurus.
	</p>
</section>
<section id="lokasi" class="scroll-mt-24 border-y border-blue-100 bg-pale py-16">
	<div class="site-container grid gap-9 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
		<div class="max-w-lg">
			<p class="eyebrow">Datang berkunjung</p>
			<h2 class="section-title mt-3">Pintu kami terbuka.</h2>
			<p class="mt-5 leading-7 text-slate">
				Gunakan peta interaktif untuk melihat lingkungan sekitar, memperbesar peta, atau membuka
				petunjuk arah langsung dari lokasi Anda.
			</p>
			<address class="mt-6 border-l-2 border-primary pl-4 not-italic">
				<span class="block text-xs font-extrabold tracking-[0.14em] text-primary uppercase"
					>Koordinat masjid</span
				>
				<span class="mt-1 block font-semibold text-navy">{mosqueLocation.coordinates}</span>
			</address>
			<a
				href="https://www.google.com/maps/dir/?api=1&destination=-6.292139,107.452472"
				target="_blank"
				rel="noreferrer"
				class="button-primary mt-7">Buka petunjuk arah</a
			>
		</div>
		<div
			class="relative overflow-hidden bg-blue-100 p-1.5 shadow-[0_24px_70px_-38px_rgba(10,61,145,.55)]"
		>
			<iframe
				class="h-[22rem] w-full border-0 sm:h-[28rem]"
				title="Peta interaktif lokasi Masjid Ar-Rahmah"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				src={mosqueLocation.embedUrl}
			></iframe>
			<div
				class="pointer-events-none absolute top-5 left-5 bg-navy px-4 py-3 text-white shadow-lg"
				aria-hidden="true"
			>
				<p class="text-[10px] font-extrabold tracking-[0.15em] text-sky uppercase">Lokasi tepat</p>
				<p class="mt-1 text-sm font-bold">Masjid Ar-Rahmah</p>
			</div>
		</div>
	</div>
</section>
<section id="infaq" class="site-container scroll-mt-24 py-16 sm:py-24">
	<div class="grid overflow-hidden border border-blue-100 lg:grid-cols-[1fr_auto]">
		<div class="p-7 sm:p-10">
			<p class="eyebrow">Infaq masjid</p>
			<h2 class="font-display mt-3 text-3xl font-semibold text-navy">
				Jaga aliran kebaikan tetap hidup.
			</h2>
			<p class="mt-4 max-w-2xl leading-7 text-slate">
				Konfirmasi infaq dan informasi rekening resmi dapat diperoleh langsung melalui bendahara
				takmir.
			</p>
		</div>
		<div class="grid min-w-72 place-content-center bg-navy p-8 text-white">
			<p class="text-xs font-bold text-sky uppercase">Hubungi bendahara</p>
			<a class="mt-2 text-lg font-extrabold" href="https://wa.me/6281234567890">+62 812 3456 7890</a
			>
		</div>
	</div>
</section>

<style>
	.committee-card {
		overflow: hidden;
		border: 1px solid #c8e3f8;
		background: white;
		padding-bottom: 1.25rem;
		text-align: center;
		box-shadow: 0 18px 50px -38px rgb(10 61 145 / 55%);
	}

	.committee-card img {
		aspect-ratio: 4 / 5;
		width: 100%;
		object-fit: cover;
		object-position: center top;
	}

	.committee-card p {
		margin: -0.85rem auto 0;
		position: relative;
		width: fit-content;
		border-radius: 999px;
		background: var(--primary);
		padding: 0.42rem 0.8rem;
		color: white;
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.committee-card h3 {
		font-family: var(--font-display);
		margin-top: 0.75rem;
		padding-inline: 0.75rem;
		color: var(--navy);
		font-size: 1.15rem;
		font-weight: 650;
	}

	.org-leader {
		position: relative;
		padding-bottom: 2rem;
	}

	.org-leader::after {
		position: absolute;
		bottom: 0;
		left: 50%;
		height: 2rem;
		width: 2px;
		background: #78bde9;
		content: '';
		transform: translateX(-1px);
	}

	.org-team {
		position: relative;
		padding-left: 2.5rem;
	}

	.org-team::before {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 1rem;
		width: 2px;
		background: #78bde9;
		content: '';
	}

	.org-team::after {
		position: absolute;
		top: 0;
		left: 1rem;
		right: 50%;
		height: 2px;
		background: #78bde9;
		content: '';
	}

	.org-team li {
		position: relative;
	}

	.org-team li::before {
		position: absolute;
		top: 2rem;
		left: -1.5rem;
		height: 2px;
		width: 1.5rem;
		background: #78bde9;
		content: '';
	}

	.org-team li:last-child::after {
		position: absolute;
		top: calc(2rem + 2px);
		bottom: 0;
		left: -1.5rem;
		width: 2px;
		background: white;
		content: '';
	}

	@media (min-width: 640px) and (max-width: 1023px) {
		.org-team {
			padding-top: 2.5rem;
			padding-left: 0;
		}

		.org-team::before {
			left: 50%;
		}

		.org-team::after {
			display: none;
		}

		.org-team li:nth-child(odd)::before {
			left: auto;
			right: -0.75rem;
			width: 0.75rem;
		}

		.org-team li:nth-child(even)::before {
			left: -0.75rem;
			width: 0.75rem;
		}

		.org-team li:last-child::after {
			display: none;
		}
	}

	@media (min-width: 1024px) {
		.org-leader {
			padding-bottom: 4.5rem;
		}

		.org-leader::after {
			height: 4.5rem;
		}

		.org-team {
			padding-top: 2.5rem;
			padding-left: 0;
		}

		.org-team::before {
			top: 0;
			bottom: auto;
			left: 10%;
			right: 10%;
			height: 2px;
			width: auto;
		}

		.org-team li::before {
			top: -2.5rem;
			left: 50%;
			height: 2.5rem;
			width: 2px;
		}

		.org-team::after,
		.org-team li:last-child::after {
			display: none;
		}
	}
</style>
