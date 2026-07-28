<script lang="ts">
	import type { RichTextNode } from '$lib/domain/rich-text';
	interface Props {
		nodes: RichTextNode[];
	}
	let { nodes }: Props = $props();
	const externalLink = (href: string) => ({ href, target: '_blank', rel: 'noopener noreferrer' });
</script>

{#snippet renderNodes(items: RichTextNode[])}
	{#each items as node (node)}
		{#if node.type === 'text'}
			{node.text}
		{:else if node.tag === 'p'}
			<p>{@render renderNodes(node.children)}</p>
		{:else if node.tag === 'h2'}
			<h2>{@render renderNodes(node.children)}</h2>
		{:else if node.tag === 'h3'}
			<h3>{@render renderNodes(node.children)}</h3>
		{:else if node.tag === 'blockquote'}
			<blockquote>{@render renderNodes(node.children)}</blockquote>
		{:else if node.tag === 'strong'}
			<strong>{@render renderNodes(node.children)}</strong>
		{:else if node.tag === 'em'}
			<em>{@render renderNodes(node.children)}</em>
		{:else if node.tag === 'u'}
			<u>{@render renderNodes(node.children)}</u>
		{:else if node.tag === 'ul'}
			<ul>{@render renderNodes(node.children)}</ul>
		{:else if node.tag === 'ol'}
			<ol>{@render renderNodes(node.children)}</ol>
		{:else if node.tag === 'li'}
			<li>{@render renderNodes(node.children)}</li>
		{:else if node.tag === 'a' && node.href}
			<a {...externalLink(node.href)}>{@render renderNodes(node.children)}</a>
		{:else if node.tag === 'br'}
			<br />
		{:else}
			{@render renderNodes(node.children)}
		{/if}
	{/each}
{/snippet}

{@render renderNodes(nodes)}
