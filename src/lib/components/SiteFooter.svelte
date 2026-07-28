<script lang="ts">
	import { resolve } from '$app/paths';
	import Brand from './Brand.svelte';
</script>

<footer class="pattern-dark mt-24 bg-navy text-blue-50">
	<div class="site-container grid gap-12 py-16 md:grid-cols-[1.35fr_1fr_1fr]">
		<div class="max-w-sm">
			<Brand inverse />
			<p class="mt-5 text-sm leading-7 text-blue-100">
				Ruang ibadah, belajar, dan bertumbuh bersama bagi seluruh warga sekitar.
			</p>
			<p class="font-arabic mt-6 text-2xl text-white" lang="ar" dir="rtl">
				وَأَنَّ الْمَسَاجِدَ لِلَّهِ
			</p>
		</div>
		<div>
			<h2 class="text-sm font-extrabold tracking-[0.16em] text-sky uppercase">Jelajahi</h2>
			<ul class="mt-5 grid gap-3 text-sm">
				<li><a href={resolve('/jadwal-salat')}>Jadwal salat</a></li>
				<li><a href={resolve('/kegiatan')}>Kegiatan masjid</a></li>
				<li><a href={resolve('/pengajian')}>Jadwal pengajian</a></li>
				<li><a href={resolve('/artikel')}>Artikel Islam</a></li>
				<li><a href={resolve('/tentang')}>Tentang & takmir</a></li>
			</ul>
		</div>
		<div>
			<h2 class="text-sm font-extrabold tracking-[0.16em] text-sky uppercase">Hubungi kami</h2>
			<address class="mt-5 space-y-3 text-sm leading-6 text-blue-100 not-italic">
				<p>
					<a href={resolve('/tentang#lokasi')}
						>6°17'31.7&quot;S 107°27'08.9&quot;E<br />Jawa Barat, Indonesia</a
					>
				</p>
				<p><a href="tel:+6281234567890">+62 812 3456 7890</a></p>
				<p><a href="mailto:takmir@arrahmah.id">takmir@arrahmah.id</a></p>
			</address>
		</div>
	</div>
	<div class="border-t border-white/10">
		<div
			class="site-container flex flex-col gap-2 py-5 text-xs text-blue-200 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {new Date().getFullYear()} Masjid Ar-Rahmah. Dibangun untuk kemaslahatan umat.</p>
			<a href={resolve('/admin/login')} class="hover:text-white">Portal pengurus</a>
		</div>
	</div>
</footer>
