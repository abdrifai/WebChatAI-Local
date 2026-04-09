<script>
	import { browser } from '$app/environment';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/atom-one-dark.css';

	let { msg, index, isDarkMode, chat } = $props();
	let isEditing = $state(false);
	let editText = $state(msg.content);

	if (browser) {
		marked.setOptions({
			highlight: function (code, lang) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';
				return hljs.highlight(code, { language }).value;
			},
			breaks: true
		});
	}

	function renderMarkdown(raw) {
		if (!browser) return raw;
		return DOMPurify.sanitize(marked.parse(raw));
	}

	let parsedContent = $derived(msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content);

	// Sinkronkan editText jika konten pesan berubah dari luar (misal: saat reset)
	$effect(() => {
		if (!isEditing) {
			editText = msg.content;
		}
	});

	function saveEdit() {
		if (editText.trim() !== '') {
			chat.editMessage(index, editText);
			isEditing = false;
		}
	}

	function handleKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			saveEdit();
		}
		if (e.key === 'Escape') {
			isEditing = false;
			editText = msg.content;
		}
	}
</script>

<div
	class="group relative flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-500"
>
	{#if isEditing}
		<div class="w-full max-w-[85%] flex flex-col gap-2">
			<textarea
				bind:value={editText}
				onkeydown={handleKeydown}
				class="w-full rounded-2xl p-4 text-sm md:text-base border-2 focus:outline-none transition-all {isDarkMode ? 'bg-slate-900 text-white border-blue-600/50' : 'bg-white text-slate-900 border-blue-400'}"
				rows="3"
			></textarea>
			<div class="flex gap-2 justify-end">
				<button 
					onclick={() => { isEditing = false; editText = msg.content; }}
					class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all {isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}"
				>
					Batal
				</button>
				<button 
					onclick={saveEdit}
					class="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
				>
					Simpan & Kirim
				</button>
			</div>
		</div>
	{:else}
		<div
			class="max-w-[85%] rounded-[1.75rem] px-7 py-4 shadow-sm backdrop-blur-2xl transition-all duration-300 border {msg.role === 'user'
				? 'bg-indigo-600 text-white rounded-br-md border-indigo-500/80 shadow-[0_8px_25px_rgba(79,70,229,0.3)] ring-1 ring-indigo-500/50'
				: isDarkMode 
					? 'bg-slate-900/70 text-slate-100 border-slate-800/80 rounded-bl-md shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-slate-800'
					: 'bg-white/70 text-slate-800 border-slate-200/60 rounded-bl-md shadow-[0_8px_30px_rgba(0,0,0,0.06)]'}"
		>
			{#if msg.role === 'assistant'}
				<div class="prose prose-sm md:prose-base {isDarkMode ? 'prose-invert' : ''} max-w-none selection:bg-indigo-500/30 prose-pre:bg-[#1f232b] prose-pre:m-0 prose-pre:rounded-[1.25rem] prose-pre:border prose-pre:border-slate-800/80 prose-pre:shadow-lg prose-headings:font-bold prose-a:text-indigo-500">
					{@html parsedContent}
				</div>
			{:else}
				<p class="whitespace-pre-wrap leading-relaxed text-[15px] md:text-base selection:bg-white/30 font-medium">
					{msg.content}
				</p>
			{/if}
		</div>

		<!-- Action Buttons -->
		<div 
			class="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 {msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}"
		>
			{#if msg.role === 'user'}
				<button 
					onclick={() => isEditing = true}
					class="p-2 rounded-lg transition-all {isDarkMode ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-800' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}"
					title="Edit pesan"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22h6-6ZM18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
				</button>
			{/if}
			
			{#if msg.role === 'assistant'}
				<button 
					onclick={() => chat.regenerateLastAI()}
					class="p-2 rounded-lg transition-all {isDarkMode ? 'text-slate-500 hover:text-emerald-400 hover:bg-slate-800' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'}"
					title="Jawab ulang"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
				</button>
			{/if}

			<button 
				onclick={() => chat.deleteMessage(index)}
				class="p-2 rounded-lg transition-all {isDarkMode ? 'text-slate-500 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'}"
				title="Hapus pesan"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
			</button>
		</div>
	{/if}
</div>
