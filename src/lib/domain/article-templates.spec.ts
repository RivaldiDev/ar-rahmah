import { describe, expect, it } from 'vitest';
import {
	articleCoverTemplates,
	defaultArticleCover,
	isArticleCoverTemplate
} from './article-templates';

describe('article cover templates', () => {
	it('offers ten distinct local templates', () => {
		expect(articleCoverTemplates).toHaveLength(10);
		expect(new Set(articleCoverTemplates.map((template) => template.path)).size).toBe(10);
		expect(articleCoverTemplates.every((template) => template.path.startsWith('/images/'))).toBe(
			true
		);
	});

	it('accepts only a registered template path', () => {
		expect(isArticleCoverTemplate(defaultArticleCover)).toBe(true);
		expect(isArticleCoverTemplate('https://example.com/cover.webp')).toBe(false);
	});
});
