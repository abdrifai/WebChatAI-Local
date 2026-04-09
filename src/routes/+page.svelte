<script>
	import { onMount } from 'svelte';
	import { createChatState } from '$lib/chat.svelte.js';
	
	// Components
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import ChatArea from '$lib/components/ChatArea.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import ConnectionGuideModal from '$lib/components/ConnectionGuideModal.svelte';

	// Global State
	const chat = createChatState();

	// UI Local State
	let showSettings = $state(false);
	let showGuide = $state(false);
	let showCopyAlert = $state(false);

	onMount(() => {
		chat.init();
	});

	async function handleCopy() {
		const success = await chat.copyToClipboard();
		if (success) {
			showCopyAlert = true;
			setTimeout(() => showCopyAlert = false, 2000);
		}
	}
</script>

<div class="flex h-screen w-full transition-colors duration-700 overflow-hidden relative {chat.isDarkMode ? 'bg-[#0a0f1c] text-slate-200' : 'bg-[#f7f9fa] text-slate-900'}">
	
	<!-- Premium Ambient Background Glow -->
	<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
		{#if chat.isDarkMode}
			<div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen opacity-50"></div>
			<div class="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[100px] mix-blend-screen opacity-40"></div>
		{:else}
			<div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/40 blur-[100px] mix-blend-multiply opacity-60"></div>
			<div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px] mix-blend-multiply opacity-50"></div>
		{/if}
	</div>
	
	<Sidebar {chat} />

	<div class="flex-1 flex flex-col relative h-full overflow-hidden z-10">
		<Header 
			{chat} 
			onOpenSettings={() => showSettings = true} 
			onOpenGuide={() => showGuide = true}
		/>

		<ChatArea {chat} />

		<ChatInput 
			{chat} 
			onSend={(val) => chat.sendMessage(val)} 
		/>
	</div>

	<!-- Modals -->
	<SettingsModal 
		{chat} 
		isOpen={showSettings} 
		onClose={() => showSettings = false} 
		onOpenGuide={() => showGuide = true}
	/>

	<ConnectionGuideModal 
		{chat} 
		isOpen={showGuide} 
		onClose={() => showGuide = false} 
		onCopy={handleCopy}
	/>

	{#if showCopyAlert}
		<div class="fixed top-10 right-10 z-[100] bg-emerald-500 text-white text-[10px] font-black uppercase px-6 py-3 rounded-xl animate-in fade-in slide-in-from-top-4 shadow-2xl shadow-emerald-500/20">
			Perintah Tersalin!
		</div>
	{/if}
</div>

<style>
	:global(body) {
		overflow: hidden;
		margin: 0;
		padding: 0;
	}
</style>