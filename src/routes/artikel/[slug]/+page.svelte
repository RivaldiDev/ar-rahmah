<script lang="ts">
	import { resolve } from '$app/paths';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import SafeArticleContent from '$lib/components/SafeArticleContent.svelte';
	import { estimateReadingMinutes, formatDate } from '$lib/domain/content';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.article.title} | Masjid Ar-Rahmah</title>
	<meta name="description" content={data.article.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.article.title} />
	<meta property="og:description" content={data.article.excerpt} />
	<meta property="og:image" content={data.article.coverImage} />
</svelte:head>

<article>
	<header class="pattern-light border-b border-blue-100 bg-pale py-14 sm:py-20">
		<div class="site-container max-w-4xl text-center">
			<a
				href={resolve(
					`/artikel?category=${encodeURIComponent(data.article.category)}` as '/artikel'
				)}
				class="eyebrow">{data.article.category}</a
			>
			<h1
				class="font-display mx-auto mt-5 max-w-4xl text-[clamp(2.6rem,7vw,5rem)] leading-[.98] font-semibold tracking-[-.035em] text-navy"
			>
				{data.article.title}
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate">{data.article.excerpt}</p>
			<div class="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-bold text-slate">
				<span>{data.article.author}</span>
				{#if data.article.publishedAt}<span>{formatDate(data.article.publishedAt)}</span>{/if}
				<span>{estimateReadingMinutes(data.article.content)} menit membaca</span>
			</div>
		</div>
	</header>

	<div
		class="site-container grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_21rem]"
	>
		<div class="min-w-0">
			<img
				src={data.article.coverImage}
				alt={`Ilustrasi artikel ${data.article.title}`}
				class="aspect-[16/9] w-full object-cover"
			/>
			<div class="mx-auto max-w-3xl pt-10 sm:pt-14">
				<div
					class="article-body prose-headings:font-display prose prose-lg max-w-none prose-slate prose-headings:text-navy prose-a:text-primary prose-blockquote:border-primary prose-blockquote:bg-pale prose-blockquote:px-6 prose-blockquote:py-3"
				>
					<SafeArticleContent nodes={data.contentNodes} />
				</div>

				<nav class="mt-12 border-y border-blue-100 py-6" aria-label="Navigasi halaman artikel">
					<p class="text-center text-xs font-extrabold tracking-[0.12em] text-slate uppercase">
						Halaman {data.currentPage} dari {data.totalPages}
					</p>
					<div class="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
						{#if data.currentPage > 1}
							<a
								class="article-page-link justify-self-start"
								href={resolve(
									`/artikel/${data.article.slug}?page=${data.currentPage - 1}` as '/artikel'
								)}
							>
								<span aria-hidden="true">←</span> Sebelumnya
							</a>
						{:else}
							<span></span>
						{/if}
						<div class="flex gap-2">
							{#each [1, 2, 3].slice(0, data.totalPages) as pageNumber (pageNumber)}
								<a
									href={resolve(`/artikel/${data.article.slug}?page=${pageNumber}` as '/artikel')}
									class="grid size-10 place-items-center rounded-md text-sm font-extrabold"
									class:bg-navy={data.currentPage === pageNumber}
									class:text-white={data.currentPage === pageNumber}
									class:bg-pale={data.currentPage !== pageNumber}
									class:text-navy={data.currentPage !== pageNumber}
									aria-current={data.currentPage === pageNumber ? 'page' : undefined}
									aria-label={`Halaman ${pageNumber}`}>{pageNumber}</a
								>
							{/each}
						</div>
						{#if data.currentPage < data.totalPages}
							<a
								class="article-page-link justify-self-end"
								href={resolve(
									`/artikel/${data.article.slug}?page=${data.currentPage + 1}` as '/artikel'
								)}
							>
								Berikutnya <span aria-hidden="true">→</span>
							</a>
						{:else}
							<span></span>
						{/if}
					</div>
				</nav>

				<div class="mt-8 text-sm">
					<strong class="text-navy">Bagikan kebaikan:</strong>
					<a
						class="ml-3 font-bold text-primary"
						href={`https://wa.me/?text=${encodeURIComponent(data.article.title)}`}>WhatsApp</a
					>
				</div>
			</div>
		</div>

		<aside
			class="border-t border-blue-100 pt-8 lg:border-t-0 lg:pt-0"
			aria-label="Rekomendasi artikel"
		>
			<div class="lg:sticky lg:top-28">
				<section>
					<p class="eyebrow">Topik populer</p>
					<h2 class="font-display mt-2 text-2xl font-semibold text-navy">Jelajahi tema lain.</h2>
					<div class="mt-5 flex flex-wrap gap-2">
						{#each data.categories as category (category.id)}
							<a
								href={resolve(
									`/artikel?category=${encodeURIComponent(category.name)}` as '/artikel'
								)}
								class="rounded-md border border-blue-100 bg-pale px-3 py-2 text-xs font-extrabold text-navy transition hover:border-primary hover:text-primary"
								>{category.name}</a
							>
						{/each}
					</div>
				</section>

				{#if data.recommendations.length}
					<section class="mt-10 border-t border-blue-100 pt-8">
						<p class="eyebrow">Pilihan untuk Anda</p>
						<div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
							{#each data.recommendations as recommendation, index (recommendation.id)}
								<a
									href={resolve('/artikel/[slug]', { slug: recommendation.slug })}
									class="group grid grid-cols-[5.5rem_1fr] gap-3 border-b border-blue-100 pb-5 last:border-0"
								>
									<img
										src={recommendation.coverImage}
										alt=""
										class="aspect-square w-full object-cover"
									/>
									<span>
										<span class="text-[10px] font-extrabold tracking-wide text-primary uppercase"
											>{index === 0 ? 'Rekomendasi utama' : recommendation.category}</span
										>
										<strong class="mt-1 block text-sm leading-5 text-navy group-hover:text-primary"
											>{recommendation.title}</strong
										>
									</span>
								</a>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		</aside>
	</div>
</article>

{#if data.related.length}
	<section class="border-t border-blue-100 bg-pale py-16">
		<div class="site-container">
			<p class="eyebrow">Bacaan terkait</p>
			<h2 class="section-title mt-3">Lanjutkan belajar.</h2>
			<div class="mt-8 grid gap-6 md:grid-cols-3">
				{#each data.related as relatedArticle (relatedArticle.id)}
					<ArticleCard article={relatedArticle} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.article-page-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 2.75rem;
		color: var(--primary);
		font-size: 0.75rem;
		font-weight: 800;
	}
</style>
