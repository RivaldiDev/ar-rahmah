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
	}

	let { activity }: Props = $props();
</script>

<article class="activity-card group">
	<div class="relative overflow-hidden md:w-[42%]">
		<img
			src={activity.coverImage}
			alt=""
			loading="lazy"
			class="h-full min-h-56 w-full object-cover transition duration-500 group-hover:scale-[1.035]"
		/>
		<div class="date-block" aria-label={formatDate(activity.startsAt)}>
			<strong
				>{formatDate(activity.startsAt, {
					day: '2-digit',
					month: undefined,
					year: undefined
				})}</strong
			>
			<span
				>{formatDate(activity.startsAt, { day: undefined, month: 'short', year: undefined })}</span
			>
		</div>
	</div>
	<div class="flex flex-1 flex-col justify-center p-6 md:p-8">
		<p class="eyebrow">{formatTime(activity.startsAt)} WIB · {activity.location}</p>
		<h3 class="font-display mt-3 text-2xl leading-tight font-semibold text-navy">
			{activity.title}
		</h3>
		<p class="mt-3 text-sm leading-7 text-slate">{activity.description}</p>
	</div>
</article>

<style>
	.activity-card {
		display: flex;
		flex-direction: column;
		border: 1px solid #dceeff;
		background: #fff;
	}
	.date-block {
		position: absolute;
		top: 1rem;
		left: 1rem;
		width: 3.7rem;
		background: #fff;
		color: var(--navy);
		text-align: center;
		box-shadow: 0 8px 25px rgb(10 61 145 / 16%);
	}
	.date-block strong {
		display: block;
		font: 600 1.55rem/1 var(--font-display);
		padding: 0.55rem 0.2rem 0.15rem;
	}
	.date-block span {
		display: block;
		background: var(--primary);
		color: #fff;
		padding: 0.25rem;
		font-size: 0.65rem;
		font-weight: 800;
		text-transform: uppercase;
	}
	@media (min-width: 768px) {
		.activity-card {
			flex-direction: row;
			min-height: 17rem;
		}
	}
</style>
