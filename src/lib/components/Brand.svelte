<script lang="ts">
	import { resolve } from '$app/paths';
	interface Props {
		compact?: boolean;
		inverse?: boolean;
	}

	let { compact = false, inverse = false }: Props = $props();
</script>

<a
	href={resolve('/')}
	class="group inline-flex items-center gap-3"
	aria-label="Ar-Rahmah — beranda"
>
	<span
		class:inverse
		class="brand-mark relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full"
		aria-hidden="true"
	>
		<svg viewBox="0 0 48 48" class="size-7" fill="none">
			<path
				d="M14 31.5V22c0-6.5 4-11 10-13 6 2 10 6.5 10 13v9.5"
				stroke="currentColor"
				stroke-width="2.4"
			/>
			<path d="M10 32h28M18 32V21h12v11" stroke="currentColor" stroke-width="2.4" />
			<path d="M27.5 12.5a6.8 6.8 0 1 0 0 8.7 5.4 5.4 0 1 1 0-8.7Z" fill="currentColor" />
		</svg>
	</span>
	{#if !compact}
		<span class="leading-none">
			<strong class:inverse class="font-display block text-xl font-semibold tracking-tight"
				>Ar-Rahmah</strong
			>
			<small class:inverse class="mt-1 block text-[0.66rem] font-bold tracking-[0.2em] uppercase"
				>Masjid & pusat umat</small
			>
		</span>
	{/if}
</a>

<style>
	.brand-mark {
		color: #ffffff;
		background: linear-gradient(145deg, #1e88f5, #0a3d91);
		box-shadow: inset 0 0 0 1px rgb(255 255 255 / 24%);
	}
	strong {
		color: var(--navy);
	}
	small {
		color: color-mix(in srgb, var(--navy) 62%, white);
	}
	.inverse {
		color: white;
	}
</style>
