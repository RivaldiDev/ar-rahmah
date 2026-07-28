<script lang="ts">
	import ActivityCard from '$lib/components/ActivityCard.svelte';
	import PageIntro from '$lib/components/PageIntro.svelte';
	import { partitionActivities } from '$lib/domain/content';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	let filter = $state<'upcoming' | 'past'>('upcoming');
	const partitioned = $derived(partitionActivities(data.activities));
	const visibleActivities = $derived(
		filter === 'upcoming' ? partitioned.upcoming : [...partitioned.past].reverse()
	);
</script>

<svelte:head
	><title>Kegiatan | Masjid Ar-Rahmah</title><meta
		name="description"
		content="Kegiatan sosial, ibadah, dan kebersamaan Masjid Ar-Rahmah."
	/></svelte:head
>
<PageIntro
	eyebrow="Bergerak bersama"
	title="Kegiatan yang mendekatkan sesama."
	description="Dari kerja bakti hingga santunan, setiap kegiatan adalah kesempatan untuk saling mengenal dan menebar manfaat."
/>
<section class="site-container py-14 sm:py-20">
	<div class="flex gap-2 border-b border-blue-100 pb-5" role="group" aria-label="Filter kegiatan">
		<button class:active={filter === 'upcoming'} onclick={() => (filter = 'upcoming')}
			>Akan datang <span>{partitioned.upcoming.length}</span></button
		><button class:active={filter === 'past'} onclick={() => (filter = 'past')}
			>Sudah berlalu <span>{partitioned.past.length}</span></button
		>
	</div>
	<div class="mt-8 grid gap-6">
		{#each visibleActivities as activity (activity.id)}<ActivityCard {activity} />{:else}<p
				class="border border-dashed border-blue-200 bg-pale p-8 text-slate"
			>
				Belum ada kegiatan pada bagian ini.
			</p>{/each}
	</div>
</section>

<style>
	[role='group'] button {
		border-radius: 0.55rem;
		padding: 0.65rem 0.85rem;
		color: #607890;
		font-size: 0.78rem;
		font-weight: 800;
	}
	.active {
		background: var(--navy);
		color: #fff !important;
	}
	[role='group'] span {
		margin-left: 0.35rem;
		opacity: 0.7;
	}
</style>
