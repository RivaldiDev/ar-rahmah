<script lang="ts">
	import { formatDate, formatTime } from '$lib/domain/content';

	interface Props {
		activity: {
			title: string;
			description: string;
			startsAt: Date;
			location: string;
			coverImage: string;
		};
		variant?: 'featured' | 'compact';
	}

	let { activity, variant = 'featured' }: Props = $props();
</script>

<article
	class:featured={variant === 'featured'}
	class:compact={variant === 'compact'}
	class="activity-card group"
	data-activity-variant={variant}
>
	<div class="activity-media relative overflow-hidden">
		<img
			src={activity.coverImage}
			alt=""
			loading="lazy"
			class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
		/>
	</div>
	<div class="activity-content">
		<p class="activity-meta">
			{formatDate(activity.startsAt)} <span aria-hidden="true">·</span>
			{formatTime(activity.startsAt)} WIB <span aria-hidden="true">·</span>
			{activity.location}
		</p>
		<h3 class="font-display activity-title">
			{activity.title}
		</h3>
		<p class="activity-description">{activity.description}</p>
	</div>
</article>

<style>
	.activity-card {
		overflow: hidden;
		border-radius: 0.8rem;
		border: 1px solid #dceeff;
		background: #fff;
	}
	.activity-media {
		aspect-ratio: 16 / 9;
	}
	.activity-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 1.25rem;
	}
	.activity-meta {
		color: var(--primary);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.activity-meta span {
		margin-inline: 0.22rem;
		opacity: 0.45;
	}
	.activity-title {
		margin-top: 0.7rem;
		color: var(--navy);
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.08;
	}
	.activity-description {
		margin-top: 0.65rem;
		color: var(--slate);
		font-size: 0.84rem;
		line-height: 1.65;
	}
	.featured {
		border: 0;
		background: var(--navy);
	}
	.featured .activity-media {
		aspect-ratio: 16 / 7.4;
		min-height: 19rem;
	}
	.featured .activity-content {
		padding: 1.6rem clamp(1.4rem, 3vw, 2.25rem) 1.8rem;
		background: linear-gradient(105deg, #0a3d91, #072e70);
	}
	.featured .activity-meta {
		color: var(--sky);
	}
	.featured .activity-title {
		max-width: 46rem;
		color: #fff;
		font-size: clamp(1.8rem, 3vw, 2.65rem);
	}
	.featured .activity-description {
		max-width: 52rem;
		color: #dceeff;
		font-size: 0.92rem;
	}
	.compact {
		display: flex;
		height: 100%;
		flex-direction: column;
	}
	.compact .activity-title {
		font-size: 1.38rem;
	}
	.compact .activity-description {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}
	@media (max-width: 639px) {
		.featured .activity-media {
			aspect-ratio: 4 / 3;
			min-height: 0;
		}
		.activity-meta {
			line-height: 1.65;
		}
	}
</style>
