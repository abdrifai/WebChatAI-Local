<script>
	let { chat, onOpenSettings, onOpenGuide } = $props();
</script>

<div class="pt-4 px-4 pb-2 z-20 w-full">
	<header
		class="flex items-center justify-between px-6 py-3.5 rounded-[1.75rem] border backdrop-blur-2xl transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] {chat.isDarkMode ? 'bg-slate-900/60 border-slate-800 shadow-black/20' : 'bg-white/60 border-slate-200/80'}"
	>
	<div class="flex items-center gap-4">
		<button 
			onclick={() => chat.isSidebarOpen = !chat.isSidebarOpen}
			class="p-2.5 rounded-[1rem] transition-all duration-300 {chat.isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/80 hover:shadow-lg hover:shadow-black/20' : 'text-slate-500 hover:text-indigo-600 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'}"
			aria-label="Toggle Sidebar"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				{#if chat.isSidebarOpen}
					<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>
				{:else}
					<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>
				{/if}
			</svg>
		</button>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="flex items-center gap-3 cursor-pointer group px-4 py-2 rounded-[1rem] transition-all duration-300 {chat.isDarkMode ? 'hover:bg-slate-800/60 hover:shadow-lg hover:shadow-black/20' : 'hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]'}"
			onclick={onOpenGuide}
		>
			<div
				class="h-3 w-3 {chat.serverStatus === 'online'
					? chat.isLoading
						? 'bg-amber-500 animate-pulse outline-2 outline-amber-500/20'
						: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
					: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]'} rounded-full transition-all duration-500"
			></div>
			<h1 class="text-xl font-black tracking-tight flex items-center gap-2 {chat.isDarkMode ? 'text-white' : 'text-slate-900'}">
				<span>Chat<span class="text-indigo-500">UI</span></span>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="{chat.isDarkMode ? 'text-slate-600 group-hover:text-slate-400' : 'text-slate-300 group-hover:text-indigo-400'} transition-colors duration-300"><path d="m18 15-6-6-6 6"/></svg>
			</h1>
		</div>
	</div>

	<div class="flex items-center gap-2 md:gap-3">
		<button
			onclick={() => chat.isDarkMode = !chat.isDarkMode}
			class="p-2.5 transition-all duration-300 rounded-[1rem] group {chat.isDarkMode ? 'text-amber-400 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-black/20' : 'text-slate-400 hover:text-amber-500 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'}"
			title={chat.isDarkMode ? 'Aktivkan Mode Terang' : 'Aktivkan Mode Gelap'}
		>
			{#if chat.isDarkMode}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-45 transition-transform duration-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500 group-hover:-rotate-12 transition-transform duration-500"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
			{/if}
		</button>

		{#if chat.availableModels.length > 0}
			<div class="relative group hidden sm:block">
				<select
					bind:value={chat.selectedModel}
					class="appearance-none text-[13px] font-bold px-4 py-2.5 pr-10 rounded-[1rem] border outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 cursor-pointer {chat.isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 hover:shadow-lg hover:shadow-black/20 focus:border-indigo-500' : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus:border-indigo-400'}"
				>
					{#each chat.availableModels as model}
						<option value={model.name}>{model.name.replace(':latest', '')}</option>
					{/each}
				</select>
				<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover:translate-y-[-4px] {chat.isDarkMode ? 'text-slate-400' : 'text-slate-400'}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg></div>
			</div>
		{/if}

		<button
			onclick={onOpenSettings}
			class="p-2.5 transition-all duration-300 rounded-[1rem] group {chat.isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/80 hover:shadow-lg hover:shadow-black/20' : 'text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'}"
			title="Pengaturan"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-90 transition-transform duration-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
		</button>
	</div>
</header>
</div>
