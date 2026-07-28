import { describe, expect, it } from 'vitest';
import { clampArticlePage, paginateArticleNodes } from './article-pagination';
import type { RichTextNode } from './rich-text';

const paragraphs = (count: number): RichTextNode[] =>
	Array.from({ length: count }, (_, index) => ({
		type: 'element',
		tag: 'p',
		children: [{ type: 'text', text: `Paragraf ${index + 1}` }]
	}));

describe('paginateArticleNodes', () => {
	it('always returns at least one page', () => {
		expect(paginateArticleNodes([])).toEqual([[]]);
	});

	it('keeps a short article on one page', () => {
		expect(paginateArticleNodes(paragraphs(5))).toHaveLength(1);
	});

	it('balances longer articles across no more than three pages', () => {
		const pages = paginateArticleNodes(paragraphs(19));
		expect(pages).toHaveLength(3);
		expect(pages.flat()).toHaveLength(19);
		expect(Math.max(...pages.map((page) => page.length))).toBeLessThanOrEqual(7);
	});

	it('ignores whitespace-only top-level text', () => {
		expect(
			paginateArticleNodes([{ type: 'text', text: '   ' }, ...paragraphs(1)]).flat()
		).toHaveLength(1);
	});
});

describe('clampArticlePage', () => {
	it.each([
		[null, 3, 1],
		['2', 3, 2],
		['0', 3, 1],
		['99', 3, 3],
		['bukan-angka', 3, 1]
	])('normalizes %s against %i pages', (value, pageCount, expected) => {
		expect(clampArticlePage(value, pageCount)).toBe(expected);
	});
});
