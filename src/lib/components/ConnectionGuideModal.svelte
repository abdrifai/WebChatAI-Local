<script>
	let { chat, isOpen, onClose, onCopy } = $props();

	function handleCopy() {
		onCopy();
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0" onclick={onClose}></div>
		
		<div class="border w-full max-w-lg rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] relative overflow-hidden animate-in zoom-in-95 duration-500 bg-white border-[#e2e8f0]">
			<div class="p-6 md:p-8 relative z-10">
				<div class="flex items-center justify-between mb-8">
					<div class="flex flex-col gap-1">
						<h2 class="text-2xl md:text-3xl font-black tracking-tight text-[#1e293b]">Koneksi Manual</h2>
						<p class="text-[#64748b] text-[9px] font-bold uppercase tracking-[0.3em]">Ollama Terminal Guide</p>
					</div>
					<button aria-label="Tutup" onclick={onClose} class="p-2.5 transition-all rounded-[1rem] text-[#64748b] hover:text-[#1e293b] hover:bg-[#f1f5f9]">
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					</button>
				</div>

				<div class="space-y-6">
					<div class="flex gap-4">
						<div class="flex-none h-10 w-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-base font-black shadow-lg shadow-indigo-500/30">1</div>
						<p class="text-sm md:text-[15px] pt-2 leading-relaxed font-bold text-[#475569]">Buka <span class="text-indigo-500">Terminal</span> di MacOS Anda.</p>
					</div>

					<div class="flex gap-4">
						<div class="flex-none h-10 w-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-base font-black shadow-lg shadow-indigo-500/30">2</div>
						<div class="flex-1 space-y-3">
							<p class="text-sm md:text-[15px] pt-2 leading-relaxed font-bold text-[#475569]">Copy & Paste perintah ini:</p>
							<div class="relative group">
								<div class="rounded-2xl p-5 pr-14 font-mono text-xs break-all leading-loose shadow-sm border transition-all bg-[#f8fafc] border-[#e2e8f0] text-indigo-700">
									{chat.terminalCommand}
								</div>
								<button 
									aria-label="Salin"
									onclick={handleCopy}
									class="absolute right-3 top-3 p-2.5 rounded-xl transition-all border shadow-sm group-hover:scale-105 active:scale-95 bg-white border-[#e2e8f0] text-[#64748b] hover:text-indigo-600"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
								</button>
							</div>
						</div>
					</div>

					<div class="flex gap-4">
						<div class="flex-none h-10 w-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-base font-black shadow-lg shadow-indigo-500/30">3</div>
						<p class="text-sm md:text-[15px] pt-2 leading-relaxed font-bold text-[#475569]">Tekan <span class="text-indigo-500 underline decoration-2 underline-offset-4">Enter</span> dan selamat chatting!</p>
					</div>
				</div>
			</div>

			<div class="px-6 md:px-8 py-5 flex items-center justify-between border-t relative z-10 bg-[#f8fafc] border-[#f1f5f9]">
				<div class="flex flex-col gap-1">
					<span class="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b]">Server Status</span>
					<span class="text-[15px] font-black text-indigo-600">{chat.serverStatus === 'online' ? 'AKTIF' : 'MENUNGGU KONEKSI...'}</span>
				</div>
				<button 
					onclick={onClose}
					class="px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-500 text-white"
				>
					Siap, Saya Mengerti
				</button>
			</div>
		</div>
	</div>
{/if}
