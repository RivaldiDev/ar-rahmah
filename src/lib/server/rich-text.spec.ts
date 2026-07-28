import { describe, expect, it } from 'vitest';
import { parseRichText } from './rich-text';

describe('rich-text parser defense in depth', () => {
	it('drops dangerous link schemes even when stored content is compromised', () => {
		const nodes = parseRichText(
			'<p><a href="javascript:alert(1)">Jahat</a><a href="https://example.com">Aman</a></p>'
		);
		expect(nodes).toEqual([
			{
				type: 'element',
				tag: 'p',
				children: [
					{
						type: 'element',
						tag: 'a',
						href: undefined,
						children: [{ type: 'text', text: 'Jahat' }]
					},
					{
						type: 'element',
						tag: 'a',
						href: 'https://example.com',
						children: [{ type: 'text', text: 'Aman' }]
					}
				]
			}
		]);
	});

	it('keeps safe relative, https, and mailto links', () => {
		const serialized = JSON.stringify(
			parseRichText('<a href="/tentang">Lokal</a><a href="mailto:a@example.com">Email</a>')
		);
		expect(serialized).toContain('/tentang');
		expect(serialized).toContain('mailto:a@example.com');
	});
});
