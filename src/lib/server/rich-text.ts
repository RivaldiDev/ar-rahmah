import { HTMLElement, Node, NodeType, parse } from 'node-html-parser';
import type { RichTextNode } from '$lib/domain/rich-text';

const allowedTags = new Set([
	'p',
	'br',
	'h2',
	'h3',
	'blockquote',
	'strong',
	'em',
	'u',
	'ul',
	'ol',
	'li',
	'a'
]);

function safeHref(value: string | undefined) {
	if (!value) return undefined;
	if (value.startsWith('/') && !value.startsWith('//')) return value;
	try {
		const url = new URL(value);
		return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? value : undefined;
	} catch {
		return undefined;
	}
}

function convertNode(node: Node): RichTextNode[] {
	if (node.nodeType === NodeType.TEXT_NODE) return [{ type: 'text', text: node.text }];
	if (!(node instanceof HTMLElement)) return [];
	const tag = node.tagName.toLowerCase();
	const children = node.childNodes.flatMap(convertNode);
	if (!allowedTags.has(tag)) return children;
	return [
		{
			type: 'element',
			tag,
			href: tag === 'a' ? safeHref(node.getAttribute('href')) : undefined,
			children
		}
	];
}

export function parseRichText(html: string) {
	return parse(html).childNodes.flatMap(convertNode);
}
