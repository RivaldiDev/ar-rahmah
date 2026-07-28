<script lang="ts">
	import ActivityCard from './ActivityCard.svelte';

	type Activity = {
		id: string;
		title: string;
		description: string;
		startsAt: Date;
		location: string;
		coverImage: string;
	};

	interface Props {
		activities: Activity[];
	}

	let { activities }: Props = $props();
</script>

{#if activities.length}
	<div class="activity-showcase">
		<ActivityCard activity={activities[0]} variant="featured" />
		{#if activities.length > 1}
			<div class="activity-secondary-grid">
				{#each activities.slice(1) as activity (activity.id)}
					<ActivityCard {activity} variant="compact" />
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<p class="border border-dashed border-blue-200 bg-pale p-8 text-slate">
		Belum ada kegiatan pada bagian ini.
	</p>
{/if}

<style>
	.activity-showcase {
		display: grid;
		gap: 1.5rem;
	}
	.activity-secondary-grid {
		display: grid;
		gap: 1rem;
	}
	@media (min-width: 640px) {
		.activity-secondary-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.25rem;
		}
	}
	@media (min-width: 1024px) {
		.activity-secondary-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1.5rem;
		}
	}
</style>
