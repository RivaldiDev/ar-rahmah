<script lang="ts">
	import { resolve } from '$app/paths';
	import { toDateTimeLocal } from '$lib/domain/content';
	interface Activity {
		title: string;
		description: string;
		startsAt: Date;
		location: string;
		coverImage: string;
	}
	interface Props {
		activity?: Activity | null;
		submitLabel?: string;
		message?: string;
	}
	let { activity = null, submitLabel = 'Simpan kegiatan', message = '' }: Props = $props();
	const defaultDate = $derived(
		toDateTimeLocal(activity?.startsAt ?? new Date(Date.now() + 7 * 86400000))
	);
</script>

{#if message}<p class="mb-5 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">
		{message}
	</p>{/if}
<form method="post" enctype="multipart/form-data" class="grid gap-7">
	<section class="grid gap-5 border border-blue-100 bg-white p-5 sm:p-7">
		<label class="form-label"
			>Nama kegiatan<input
				class="form-control"
				name="title"
				value={activity?.title ?? ''}
				maxlength="160"
				required
			/></label
		><label class="form-label"
			>Deskripsi<textarea class="form-control min-h-32" name="description" maxlength="1200" required
				>{activity?.description ?? ''}</textarea
			></label
		>
		<div class="grid gap-5 sm:grid-cols-2">
			<label class="form-label"
				>Tanggal & waktu<input
					class="form-control"
					type="datetime-local"
					name="startsAt"
					value={defaultDate}
					required
				/></label
			><label class="form-label"
				>Lokasi<input
					class="form-control"
					name="location"
					value={activity?.location ?? 'Masjid Ar-Rahmah'}
					maxlength="160"
					required
				/></label
			>
		</div>
	</section>
	<section class="border border-blue-100 bg-white p-5 sm:p-7">
		<label class="form-label"
			>Gambar sampul<input
				class="form-control file:mr-4 file:rounded-md file:border-0 file:bg-pale file:px-3 file:py-2 file:text-xs file:font-bold file:text-navy"
				type="file"
				name="cover"
				accept="image/jpeg,image/png,image/webp"
			/></label
		>
		<p class="mt-2 text-xs text-slate">JPG, PNG, atau WebP, maksimal 5 MB.</p>
		{#if activity?.coverImage}<img
				src={activity.coverImage}
				alt="Sampul saat ini"
				class="mt-4 h-32 w-56 object-cover"
			/>{/if}
	</section>
	<div class="flex gap-3">
		<button type="submit" class="button-primary">{submitLabel}</button><a
			href={resolve('/admin/kegiatan')}
			class="button-secondary">Batal</a
		>
	</div>
</form>
