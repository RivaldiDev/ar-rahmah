import type { RichTextNode } from '$lib/domain/rich-text';

const DEFAULT_BLOCKS_PER_PAGE = 5;
const MAX_PAGES = 3;

function hasVisibleContent(node: RichTextNode) {
	return node.type === 'element' || node.text.trim().length > 0;
}

export function paginateArticleNodes(
	nodes: RichTextNode[],
	blocksPerPage = DEFAULT_BLOCKS_PER_PAGE
): RichTextNode[][] {
	const blocks = nodes.filter(hasVisibleContent);
	if (blocks.length === 0) return [[]];

	const pageCount = Math.min(MAX_PAGES, Math.max(1, Math.ceil(blocks.length / blocksPerPage)));
	const pageSize = Math.ceil(blocks.length / pageCount);
	return Array.from({ length: pageCount }, (_, index) =>
		blocks.slice(index * pageSize, (index + 1) * pageSize)
	).filter((page) => page.length > 0);
}

export function clampArticlePage(value: string | null, pageCount: number) {
	const parsed = Number.parseInt(value ?? '1', 10);
	if (!Number.isFinite(parsed)) return 1;
	return Math.min(Math.max(parsed, 1), Math.max(pageCount, 1));
}
