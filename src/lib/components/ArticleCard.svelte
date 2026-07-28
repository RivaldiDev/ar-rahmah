<script lang="ts">
	import { resolve } from '$app/paths';
	import { estimateReadingMinutes, formatDate } from '$lib/domain/content';

	interface Props {
		article: {
			title: string;
			slug: string;
			excerpt: string;
			coverImage: string;
			category: string;
			content: string;
			publishedAt: Date | null;
		};
		featured?: boolean;
	}

	let { article, featured = false }: Props = $props();
</script>

<article class:featured class="article-card group">
	<a
		href={resolve('/artikel/[slug]', { slug: article.slug })}
		class="image-wrap"
		aria-label={`Baca ${article.title}`}
	>
		<img src={article.coverImage} alt="" loading="lazy" />
		<span class="category">{article.category}</span>
	</a>
	<div class="content">
		<p class="meta">
			{article.publishedAt ? formatDate(article.publishedAt, { year: undefined }) : 'Segera terbit'} ·
			{estimateReadingMinutes(article.content)} menit
		</p>
		<h3><a href={resolve('/artikel/[slug]', { slug: article.slug })}>{article.title}</a></h3>
		<p class="excerpt">{article.excerpt}</p>
		<a href={resolve('/artikel/[slug]', { slug: article.slug })} class="read-link"
			>Baca selengkapnya <span aria-hidden="true">→</span></a
		>
	</div>
</article>

<style>
	.article-card {
		display: grid;
		background: white;
		border: 1px solid #dceeff;
		overflow: hidden;
		min-height: 100%;
	}
	.image-wrap {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16/10;
	}
	.image-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.article-card:hover img {
		transform: scale(1.035);
	}
	.category {
		position: absolute;
		left: 1rem;
		bottom: 1rem;
		background: #fff;
		color: var(--navy);
		padding: 0.38rem 0.65rem;
		border-radius: 0.45rem;
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.content {
		padding: 1.35rem 1.35rem 1.5rem;
		display: flex;
		flex-direction: column;
	}
	.meta {
		color: #64819d;
		font-size: 0.76rem;
		font-weight: 700;
	}
	h3 {
		color: var(--navy);
		font-family: var(--font-display);
		font-size: clamp(1.25rem, 2vw, 1.55rem);
		line-height: 1.15;
		margin: 0.65rem 0;
	}
	.excerpt {
		color: #4f6579;
		font-size: 0.9rem;
		line-height: 1.65;
		flex: 1;
	}
	.read-link {
		color: var(--primary);
		font-size: 0.83rem;
		font-weight: 800;
		margin-top: 1rem;
	}
	@media (min-width: 768px) {
		.featured {
			grid-template-columns: 1.2fr 1fr;
		}
		.featured .image-wrap {
			aspect-ratio: auto;
			min-height: 22rem;
		}
		.featured .content {
			justify-content: center;
			padding: 2.5rem;
		}
	}
</style>
