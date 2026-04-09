<script>
	let { chat, onSend } = $props();
	let input = $state('');
	let textareaRef = $state();

	function handleKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	function handleInput() {
		if (!textareaRef) return;
		textareaRef.style.height = 'auto';
		textareaRef.style.height = Math.min(textareaRef.scrollHeight, 200) + 'px';
	}

	$effect(() => {
		if (input === '' && textareaRef) {
			textareaRef.style.height = 'auto';
		}
	});

	function submit() {
		if (!input.trim() || chat.isLoading || chat.serverStatus !== 'online') return;
		onSend(input);
		input = '';
		if(textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.focus();
		}
	}
</script>

<footer class="relative w-full z-20">
	<!-- Gradient overlay blending the chat area into the footer -->
	<div class="absolute inset-x-0 bottom-full h-12 pointer-events-none bg-gradient-to-t {chat.isDarkMode ? 'from-slate-950 to-transparent' : 'from-slate-50 to-transparent'} transition-colors duration-500"></div>
	
	<div class="px-4 pb-6 pt-2 {chat.isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-500">
		<div class="max-w-4xl mx-auto flex items-end bg-white/60 backdrop-blur-2xl border shadow-sm rounded-[2rem] transition-all duration-300 hover:border-indigo-300/50 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-[0_8px_40px_rgb(99,102,241,0.08)] {chat.isDarkMode ? 'bg-slate-900/60 border-slate-800 focus-within:border-indigo-500 focus-within:shadow-[0_8px_40px_rgb(99,102,241,0.15)] shadow-black/40' : 'border-slate-200 focus-within:bg-white'}">
			
			<textarea
				bind:this={textareaRef}
				bind:value={input}
				onkeydown={handleKeydown}
				oninput={handleInput}
				disabled={chat.serverStatus !== 'online'}
				placeholder={chat.serverStatus === 'online' ? "Kirim pesan ke Ollama..." : "Server Offline - Periksa koneksi lokal"}
				class="w-full bg-transparent resize-none px-6 py-[18px] max-h-[200px] text-[15px] md:text-base leading-relaxed placeholder:text-slate-400 disabled:opacity-50 focus:outline-none custom-scrollbar {chat.isDarkMode ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-800'}"
				rows="1"
				style="min-height: 60px;"
			></textarea>

			<div class="pr-2 pb-2 flex items-center justify-center">
				<button
					onclick={submit}
					disabled={chat.isLoading || !input.trim() || chat.serverStatus !== 'online'}
					class="group relative flex items-center justify-center h-11 w-11 rounded-full transition-all duration-300 ease-out {input.trim() && !chat.isLoading && chat.serverStatus === 'online' ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.4)] active:scale-90 hover:shadow-[0_6px_20px_rgba(79,70,229,0.5)]' : chat.isDarkMode ? 'bg-slate-800 text-slate-500 opacity-60' : 'bg-slate-200 text-slate-400 opacity-60'}"
					aria-label="Kirim pesan"
				>
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						width="18" height="18" 
						viewBox="0 0 24 24" 
						fill="none" 
						stroke="currentColor" 
						stroke-width="3" 
						stroke-linecap="round" 
						stroke-linejoin="round" 
						class="transition-transform duration-300 {input.trim() ? 'translate-y-[-1px] group-hover:translate-y-[-2px]' : ''}"
					>
						<line x1="12" y1="19" x2="12" y2="5"></line>
						<polyline points="5 12 12 5 19 12"></polyline>
					</svg>
				</button>
			</div>
		</div>
		
		<div class="text-center mt-3 text-xs opacity-70 transition-colors {chat.isDarkMode ? 'text-slate-500' : 'text-slate-400'}">
			AI dapat membuat kesalahan. Harap periksa kembali informasi penting.
		</div>
	</div>
</footer>

<style>
	.custom-scrollbar::-webkit-scrollbar { width: 6px; }
	.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
	.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
</style>
