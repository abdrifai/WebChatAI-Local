<script>
	let { chat } = $props();

	function deleteConversation(id, e) {
		e.stopPropagation();
		chat.conversations = chat.conversations.filter((c) => c.id !== id);
		if (chat.currentConversationId === id) {
			chat.currentConversationId = chat.conversations.length > 0 ? chat.conversations[0].id : null;
		}
		chat.save();
	}
</script>

<aside 
	class="flex flex-col transition-all duration-500 z-30 relative
	{chat.isSidebarOpen ? 'w-[320px] lg:w-[340px] opacity-100 ml-4 py-4' : 'w-0 overflow-hidden opacity-0 p-0 m-0'}"
>
	<div class="flex flex-col h-full rounded-[2rem] border shadow-sm backdrop-blur-2xl transition-all overflow-hidden
	{chat.isDarkMode ? 'bg-slate-900/60 border-slate-800 shadow-black/20' : 'bg-white/60 border-slate-200'}">
		
		<div class="p-5 flex flex-col h-full relative z-10">
			<!-- Floating Action Button for New Chat -->
			<button 
				onclick={() => chat.createNewChat()}
				class="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-[1.25rem] transition-all font-bold mb-6 group {chat.isDarkMode ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 border border-indigo-400/50' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.2)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.3)]'}"
			>
				<span class="flex items-center gap-2.5">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-90 transition-transform duration-300"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
					Chat Baru
				</span>
				<kbd class="hidden group-hover:block text-[10px] px-2 py-0.5 rounded-lg border font-mono {chat.isDarkMode ? 'border-indigo-400/30 bg-indigo-500/20 text-indigo-100' : 'border-indigo-400/30 bg-indigo-500/20 text-indigo-50'} shadow-sm">⌘N</kbd>
			</button>

			<div class="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
				<p class="text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-3 mt-2 {chat.isDarkMode ? 'text-slate-500' : 'text-slate-400'}">Riwayat Percakapan</p>
				
				{#each chat.conversations as c (c.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						onclick={() => chat.currentConversationId = c.id}
						class="w-full group flex items-center justify-between gap-3 px-4 py-3.5 rounded-[1.25rem] cursor-pointer transition-all duration-300 relative overflow-hidden {chat.currentConversationId === c.id 
							? (chat.isDarkMode ? 'bg-slate-800/80 text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] ring-1 ring-slate-700' : 'bg-white text-indigo-950 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 ring-1 ring-indigo-50') 
							: (chat.isDarkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-500 hover:bg-white/50 hover:text-slate-800')}"
					>
						<div class="flex flex-col items-start overflow-hidden text-left w-full z-10">
							<span class="text-[13px] md:text-sm font-semibold truncate w-full transition-colors leading-tight {chat.currentConversationId === c.id ? (chat.isDarkMode ? 'text-indigo-400' : 'text-indigo-600') : ''}">{c.title}</span>
							<span class="text-[10px] opacity-60 truncate w-full uppercase tracking-tighter mt-0.5">{c.model.replace(':latest', '')}</span>
						</div>
						
						<button 
							onclick={(e) => deleteConversation(c.id, e)}
							class="p-2 z-20 absolute right-2 bg-rose-500 text-white rounded-[0.85rem] opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-md shadow-rose-500/20 hover:bg-rose-600"
							aria-label="Hapus chat"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
						</button>
						
						{#if chat.currentConversationId === c.id}
						<!-- Active item indicator line -->
						<div class="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1.5 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/50"></div>
						{/if}
					</div>
				{/each}
			</div>

			<div class="mt-6 pt-4 border-t {chat.isDarkMode ? 'border-slate-800' : 'border-slate-200/60'}">
				<p class="text-[9px] text-center font-bold opacity-40 uppercase tracking-widest leading-loose">WabChat Local • v1.5</p>
			</div>
		</div>
	</div>
</aside>

<style>
	.custom-scrollbar::-webkit-scrollbar { width: 4px; }
	.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
</style>
