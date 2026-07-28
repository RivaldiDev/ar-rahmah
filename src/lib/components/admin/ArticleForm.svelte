<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		articleCoverTemplates,
		defaultArticleCover,
		isArticleCoverTemplate
	} from '$lib/domain/article-templates';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	interface Category {
		id: string;
		name: string;
	}
	interface Article {
		title: string;
		excerpt: string;
		content: string;
		category: string;
		status: string;
		coverImage: string;
	}
	interface Props {
		categories: Category[];
		article?: Article | null;
		submitLabel?: string;
		message?: string;
	}
	let {
		categories,
		article = null,
		submitLabel = 'Simpan artikel',
		message = ''
	}: Props = $props();
</script>

{#if message}<p class="mb-5 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">
		{message}
	</p>{/if}
<form method="post" enctype="multipart/form-data" class="grid gap-7">
	<section class="grid gap-5 border border-blue-100 bg-white p-5 sm:p-7">
		<label class="form-label"
			>Judul artikel<input
				class="form-control"
				name="title"
				value={article?.title ?? ''}
				maxlength="160"
				required
				placeholder="Contoh: Menjaga Lisan dalam Kehidupan Sehari-hari"
			/></label
		><label class="form-label"
			>Ringkasan<textarea
				class="form-control min-h-24"
				name="excerpt"
				maxlength="320"
				required
				placeholder="Dua kalimat singkat untuk halaman daftar artikel…"
				>{article?.excerpt ?? ''}</textarea
			></label
		>
		<div class="grid gap-5 sm:grid-cols-2">
			<label class="form-label"
				>Kategori<select class="form-control" name="category" required
					>{#each categories as category (category.id)}<option
							value={category.name}
							selected={article?.category === category.name}>{category.name}</option
						>{/each}</select
				></label
			><label class="form-label"
				>Status<select class="form-control" name="status"
					><option value="draft" selected={article?.status !== 'published'}
						>Draf — belum tampil</option
					><option value="published" selected={article?.status === 'published'}
						>Terbitkan sekarang</option
					></select
				></label
			>
		</div>
	</section>
	<section class="border border-blue-100 bg-white p-5 sm:p-7">
		<p class="form-label mb-3">Isi artikel</p>
		<RichTextEditor value={article?.content ?? ''} />
	</section>
	<section class="border border-blue-100 bg-white p-5 sm:p-7">
		<fieldset>
			<legend class="form-label">Pilih template sampul</legend>
			<p class="mt-2 max-w-3xl text-sm leading-6 text-slate">
				Pilih ilustrasi yang paling dekat dengan topik. Semua template sudah siap digunakan.
			</p>
			<div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
				{#each articleCoverTemplates as template (template.id)}
					<label
						class="template-card group cursor-pointer overflow-hidden border border-blue-100 bg-white transition focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
					>
						<input
							class="sr-only"
							type="radio"
							name="coverTemplate"
							value={template.path}
							checked={article
								? article.coverImage === template.path
								: template.path === defaultArticleCover}
						/>
						<img
							src={template.path}
							alt=""
							class="aspect-[8/5] w-full object-cover transition group-hover:scale-[1.02]"
						/>
						<span class="block p-3">
							<strong class="block text-xs text-navy">{template.label}</strong>
							<span class="mt-1 block text-[11px] leading-4 text-slate">{template.description}</span
							>
						</span>
					</label>
				{/each}
			</div>
		</fieldset>
		<div class="my-6 flex items-center gap-3" aria-hidden="true">
			<span class="h-px flex-1 bg-blue-100"></span>
			<span class="text-[10px] font-extrabold tracking-[0.14em] text-slate uppercase">atau</span>
			<span class="h-px flex-1 bg-blue-100"></span>
		</div>
		<label class="form-label"
			>Unggah gambar sendiri<input
				class="form-control file:mr-4 file:rounded-md file:border-0 file:bg-pale file:px-3 file:py-2 file:text-xs file:font-bold file:text-navy"
				type="file"
				name="cover"
				accept="image/jpeg,image/png,image/webp"
			/></label
		>
		<p class="mt-2 text-xs leading-5 text-slate">
			JPG, PNG, atau WebP, maksimal 5 MB. Jika diisi, gambar unggahan akan digunakan menggantikan
			template pilihan.
		</p>
		{#if article?.coverImage && !isArticleCoverTemplate(article.coverImage)}<div class="mt-4">
				<p class="text-xs font-bold text-slate">Gambar unggahan saat ini</p>
				<img src={article.coverImage} alt="Sampul saat ini" class="mt-4 h-32 w-56 object-cover" />
			</div>{/if}
	</section>
	<div class="flex flex-wrap gap-3">
		<button type="submit" class="button-primary">{submitLabel}</button><a
			href={resolve('/admin/artikel')}
			class="button-secondary">Batal</a
		>
	</div>
</form>

<style>
	.template-card:has(input:checked) {
		border-color: var(--primary);
		box-shadow: inset 0 0 0 1px var(--primary);
	}
</style>
