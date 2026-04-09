<script>
	let { chat, isOpen, onClose, onOpenGuide } = $props();

	async function startServer() {
		chat.isStartingServer = true;
		try {
			const res = await fetch('/api/ollama', { method: 'POST' });
			if (res.ok) setTimeout(chat.checkServerStatus, 3000);
		} catch (err) {
			console.error(err);
		} finally {
			chat.isStartingServer = false;
		}
	}

	async function stopServer() {
		chat.isStoppingServer = true;
		try {
			const res = await fetch('/api/ollama', { method: 'DELETE' });
			if (res.ok) setTimeout(chat.checkServerStatus, 2000);
		} catch (err) {
			console.error(err);
		} finally {
			chat.isStoppingServer = false;
		}
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0" onclick={onClose}></div>
		
		<div class="border w-full max-w-sm md:max-w-md rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 {chat.isDarkMode ? 'bg-slate-900/70 border-slate-800 shadow-black/40 ring-1 ring-white/5' : 'bg-white/80 border-white ring-1 ring-slate-900/5'}">
			<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600"></div>
			
			<div class="p-6 md:p-8 relative z-10">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold flex items-center gap-2 {chat.isDarkMode ? 'text-white' : 'text-slate-900'}">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
						Pengaturan
					</h2>
					<button aria-label="Tutup pengaturan" onclick={onClose} class="p-2 transition-all rounded-xl {chat.isDarkMode ? 'text-slate-500 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}">
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					</button>
				</div>

				<div class="space-y-4">
					<div class="border rounded-2xl p-4 {chat.isDarkMode ? 'bg-black/20 border-slate-800' : 'bg-slate-100/50 border-slate-200/80'}">
						<p class="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Status Kontrol</p>
						<div class="flex items-center justify-between">
							<div class="flex flex-col">
								<span class="text-base font-bold transition-all {chat.isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight">Ollama Server</span>
								<span class="text-[11px] {chat.serverStatus === 'online' ? 'text-emerald-500' : 'text-rose-500'} font-black uppercase tracking-wider mt-0.5">
									{chat.serverStatus === 'online' ? '● Aktif' : '● Terputus'}
								</span>
							</div>
							
							{#if chat.serverStatus === 'offline'}
								<button 
									onclick={startServer}
									disabled={chat.isStartingServer}
									class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[13px] font-bold shadow-sm disabled:opacity-50 transition-all flex items-center gap-2"
								>
									{chat.isStartingServer ? 'Memulai...' : 'Nyalakan'}
								</button>
							{:else}
								<button 
									onclick={stopServer}
									disabled={chat.isStoppingServer}
									class="px-4 py-2 border rounded-xl text-[13px] font-bold disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm {chat.isDarkMode ? 'bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border-rose-500/30' : 'bg-white hover:bg-rose-600 text-rose-600 hover:text-white border-rose-200'}"
								>
									{chat.isStoppingServer ? 'Mematikan...' : 'Matikan'}
								</button>
							{/if}
						</div>
						
						{#if chat.serverStatus === 'offline'}
							<button 
								onclick={() => { onClose(); onOpenGuide(); }}
								class="w-full text-left p-3 rounded-xl mt-3 transition-all group {chat.isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white hover:bg-slate-100 border border-slate-200'}"
							>
								<p class="text-[11px] leading-relaxed italic group-hover:not-italic font-medium {chat.isDarkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-500 group-hover:text-indigo-600'}">
									*Kesulitan menyambung? Lihat panduan Terminal manual.
								</p>
							</button>
						{/if}
					</div>
				</div>
			</div>

			<div class="px-6 py-4 border-t relative z-10 transition-colors {chat.isDarkMode ? 'bg-indigo-900/10 border-slate-700/50' : 'bg-slate-50/50 border-slate-200/50'}">
				<button onclick={onClose} class="w-full py-3 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-500 text-white">Tutup Panel Kontrol</button>
			</div>
		</div>
	</div>
{/if}
