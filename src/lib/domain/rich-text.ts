export type RichTextNode =
	| { type: 'text'; text: string }
	| { type: 'element'; tag: string; href?: string; children: RichTextNode[] };
