<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		value?: string;
		name?: string;
	}
	let { value = '', name = 'content' }: Props = $props();
	let editor: HTMLDivElement | undefined;
	let html = $derived(value);
	const initializeEditor: Attachment<HTMLDivElement> = (element) => {
		editor = element;
		element.innerHTML = value;
		return () => {
			editor = undefined;
		};
	};

	function command(commandName: string, commandValue?: string) {
		if (!editor) return;
		editor.focus();
		document.execCommand(commandName, false, commandValue);
		html = editor.innerHTML;
	}
</script>

<div
	class="overflow-hidden rounded-xl border border-blue-200 bg-white focus-within:ring-2 focus-within:ring-primary/25"
>
	<div
		class="flex flex-wrap gap-1 border-b border-blue-100 bg-pale p-2"
		role="toolbar"
		aria-label="Format artikel"
	>
		<button type="button" title="Judul bagian" onclick={() => command('formatBlock', 'h2')}
			>H2</button
		>
		<button type="button" title="Tebal" onclick={() => command('bold')}><strong>B</strong></button>
		<button type="button" title="Miring" onclick={() => command('italic')}><em>I</em></button>
		<button type="button" title="Daftar poin" onclick={() => command('insertUnorderedList')}
			>• Daftar</button
		>
		<button type="button" title="Kutipan" onclick={() => command('formatBlock', 'blockquote')}
			>❝ Kutip</button
		>
		<button type="button" title="Paragraf" onclick={() => command('formatBlock', 'p')}
			>Paragraf</button
		>
	</div>
	<div
		{@attach initializeEditor}
		contenteditable="true"
		role="textbox"
		aria-multiline="true"
		aria-label="Isi artikel"
		class="prose min-h-80 max-w-none p-5 prose-slate outline-none"
		oninput={(event) => (html = event.currentTarget.innerHTML)}
	></div>
	<input type="hidden" {name} value={html} />
</div>

<style>
	[role='toolbar'] button {
		min-height: 2.25rem;
		padding: 0.35rem 0.65rem;
		border-radius: 0.45rem;
		color: var(--navy);
		font-size: 0.75rem;
		font-weight: 800;
	}
	[role='toolbar'] button:hover {
		background: white;
		color: var(--primary);
	}
	[contenteditable]:empty::before {
		content: 'Mulai menulis nasihat atau artikel di sini…';
		color: #8ba0b5;
	}
</style>
