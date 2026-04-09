<script>
	import MessageBubble from './MessageBubble.svelte';
	let { chat } = $props();

	let currentMessages = $derived(
		chat.conversations.find((c) => c.id === chat.currentConversationId)?.messages || []
	);

	let bottomAnchor = $state();

	function scrollToBottom() {
		if (bottomAnchor) {
			bottomAnchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	}

	// Trigger auto-scroll when new messages appear or loading starts
	$effect(() => {
		currentMessages.length;
		chat.isLoading;
		setTimeout(scrollToBottom, 50);
	});
</script>

<main class="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-8 scroll-smooth z-10 custom-scrollbar">
	<div class="mx-auto w-full flex flex-col gap-8 transition-all duration-500 {chat.isSidebarOpen ? 'max-w-5xl' : 'max-w-7xl'}">
		{#if currentMessages.length === 1 && currentMessages[0].role === 'assistant' && currentMessages[0].content === 'Halo! Saya asisten AI lokal Anda. Ada yang bisa saya bantu?'}
			<!-- Premium Splash Screen / Empty State -->
			<div class="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in-95 duration-1000">
				<div class="relative group mb-8">
					<div class="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full group-hover:bg-indigo-500/40 transition-all duration-700"></div>
					<div class="relative h-24 w-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-blue-600 shadow-2xl flex items-center justify-center ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 delay-75">
						<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
					</div>
				</div>
				<h1 class="text-4xl md:text-5xl font-black tracking-tighter mb-4 {chat.isDarkMode ? 'text-white' : 'text-slate-900'}">
					Halo!
				</h1>
				<p class="text-lg md:text-xl font-medium {chat.isDarkMode ? 'text-slate-400' : 'text-slate-500'} max-w-sm md:max-w-md">
					Saya asisten AI lokal Anda. Ada yang bisa saya bantu hari ini?
				</p>
			</div>
		{:else}
			{#each currentMessages as msg, i}
				<!-- Kita sembunyikan gelembung pertama jika itu adalah pesan default agar rapi (opsional, tapi lebih terlihat seperti ChatGPT) -->
				{#if !(i === 0 && msg.role === 'assistant' && msg.content === 'Halo! Saya asisten AI lokal Anda. Ada yang bisa saya bantu?')}
					<MessageBubble {msg} index={i} isDarkMode={chat.isDarkMode} {chat} />
				{/if}
			{/each}
		{/if}

		{#if chat.isLoading}
			<div class="flex justify-start">
				<div class="px-8 py-5 rounded-[1.75rem] rounded-bl-md border shadow-sm backdrop-blur-2xl transition-all {chat.isDarkMode ? 'bg-slate-900/70 border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-slate-800' : 'bg-white/70 border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'}">
					<div class="flex gap-2.5 items-center justify-center">
						<div class="h-2 w-2 bg-indigo-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(99,102,241,0.6)]" style="animation-duration: 0.8s;"></div>
						<div class="h-2 w-2 bg-indigo-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(99,102,241,0.6)]" style="animation-duration: 0.8s; animation-delay: 0.2s;"></div>
						<div class="h-2 w-2 bg-indigo-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(99,102,241,0.6)]" style="animation-duration: 0.8s; animation-delay: 0.4s;"></div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Auto-scroll anchor point -->
		<div bind:this={bottomAnchor} class="h-4 w-full"></div>
	</div>
</main>

<style>
	.custom-scrollbar::-webkit-scrollbar { width: 4px; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
</style>
