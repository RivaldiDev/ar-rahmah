<script lang="ts">
	interface Props {
		eyebrow: string;
		title: string;
		description: string;
	}
	let { eyebrow, title, description }: Props = $props();
</script>

<section class="pattern-light border-b border-blue-100 bg-pale py-16 sm:py-20">
	<div class="site-container max-w-4xl">
		<p class="eyebrow">{eyebrow}</p>
		<h1 class="page-title mt-4">{title}</h1>
		<p class="mt-5 max-w-2xl text-base leading-8 text-slate sm:text-lg">{description}</p>
	</div>
</section>
