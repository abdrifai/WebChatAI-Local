import { browser } from '$app/environment';

export function createChatState() {
	let conversations = $state([]);
	let currentConversationId = $state(null);
	let isSidebarOpen = $state(true);
	let isDarkMode = $state(true);
	let serverStatus = $state('checking');
	let availableModels = $state([]);
	let selectedModel = $state('llama3.1:latest');
	let isLoading = $state(false);
	let isFetchingModels = $state(false);
	let isStartingServer = $state(false);
	let isStoppingServer = $state(false);
	let isRagActive = $state(true);
	let isKnowledgeManagerOpen = $state(false);

	const terminalCommand = 'OLLAMA_ORIGINS="http://localhost:5173" ollama serve';

	function init() {
		if (!browser) return;

		// Theme
		const savedTheme = localStorage.getItem('ollama-theme');
		if (savedTheme) {
			isDarkMode = savedTheme === 'dark';
		} else {
			isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		// Conversations
		const savedChats = localStorage.getItem('ollama-conversations');
		if (savedChats) {
			conversations = JSON.parse(savedChats);
			if (conversations.length > 0) {
				currentConversationId = conversations[0].id;
				selectedModel = conversations[0].model;
			} else {
				createNewChat();
			}
		} else {
			createNewChat();
		}

		checkServerStatus();
		setInterval(checkServerStatus, 15000);
	}

	async function checkServerStatus() {
		try {
			const res = await fetch('/api/ollama');
			const data = await res.json();
			serverStatus = data.status;
			if (serverStatus === 'online' && availableModels.length === 0) {
				fetchModels();
			}
		} catch (err) {
			serverStatus = 'offline';
		}
	}

	async function fetchModels() {
		isFetchingModels = true;
		try {
			const res = await fetch('http://localhost:11434/api/tags');
			if (res.ok) {
				const data = await res.json();
				availableModels = data.models || [];
				if (availableModels.length > 0 && !selectedModel) {
					const hasLlama31 = availableModels.find((m) => m.name === 'llama3.1:latest');
					selectedModel = hasLlama31 ? 'llama3.1:latest' : availableModels[0].name;
				}
				serverStatus = 'online';
			}
		} catch (err) {
			serverStatus = 'offline';
		} finally {
			isFetchingModels = false;
		}
	}

	function createNewChat() {
		const newId = crypto.randomUUID();
		const newChat = {
			id: newId,
			title: 'Percakapan Baru',
			messages: [{ role: 'assistant', content: 'Halo! Saya asisten AI lokal Anda. Ada yang bisa saya bantu?' }],
			model: selectedModel,
			timestamp: Date.now()
		};
		conversations = [newChat, ...conversations];
		currentConversationId = newId;
		save();
	}

	function save() {
		if (browser) {
			localStorage.setItem('ollama-conversations', JSON.stringify(conversations));
			localStorage.setItem('ollama-theme', isDarkMode ? 'dark' : 'light');
		}
	}

	return {
		get conversations() { return conversations; },
		set conversations(v) { conversations = v; },
		get currentConversationId() { return currentConversationId; },
		set currentConversationId(v) { currentConversationId = v; },
		get isSidebarOpen() { return isSidebarOpen; },
		set isSidebarOpen(v) { isSidebarOpen = v; },
		get isDarkMode() { return isDarkMode; },
		set isDarkMode(v) { isDarkMode = v; save(); },
		get serverStatus() { return serverStatus; },
		set serverStatus(v) { serverStatus = v; },
		get availableModels() { return availableModels; },
		get selectedModel() { return selectedModel; },
		set selectedModel(v) { selectedModel = v; },
		get isLoading() { return isLoading; },
		set isLoading(v) { isLoading = v; },
		get isFetchingModels() { return isFetchingModels; },
		get isStartingServer() { return isStartingServer; },
		set isStartingServer(v) { isStartingServer = v; },
		get isStoppingServer() { return isStoppingServer; },
		set isStoppingServer(v) { isStoppingServer = v; },
		get isRagActive() { return isRagActive; },
		set isRagActive(v) { isRagActive = v; },
		get isKnowledgeManagerOpen() { return isKnowledgeManagerOpen; },
		set isKnowledgeManagerOpen(v) { isKnowledgeManagerOpen = v; },
		get terminalCommand() { return terminalCommand; },
		async copyToClipboard() {
			if (!browser) return;
			try {
				await navigator.clipboard.writeText(terminalCommand);
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		},
		async sendMessage(userContent, isResend = false) {
			if (!userContent.trim() || isLoading || !currentConversationId) return;

			isLoading = true;
			const chatIdx = conversations.findIndex(c => c.id === currentConversationId);
			if (chatIdx === -1) {
				isLoading = false;
				return;
			}

			// Add User Message if not a resend (edit/regenerate)
			if (!isResend) {
				conversations[chatIdx].messages = [
					...conversations[chatIdx].messages,
					{ role: 'user', content: userContent }
				];
				// Auto Title
				if (conversations[chatIdx].title === 'Percakapan Baru') {
					conversations[chatIdx].title = userContent.slice(0, 30) + (userContent.length > 30 ? '...' : '');
				}
			}

			let prompt = userContent;

			// RAG Logic
			if (isRagActive) {
				try {
					const ragRes = await fetch('/api/rag/search', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ prompt: userContent })
					});
					if (ragRes.ok) {
						const { results } = await ragRes.json();
						if (results && results.length > 0) {
							const context = results.map(r => r.content).join('\n---\n');
							prompt = `Gunakan informasi berikut sebagai referensi utamamu jika relevan:\n\n${context}\n\n---\n\nPertanyaan pengguna: ${userContent}`;
						}
					}
				} catch (err) {
					console.error('RAG search failed:', err);
				}
			}

			try {
				const res = await fetch('http://localhost:11434/api/generate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						model: selectedModel,
						prompt: prompt,
						stream: false
					})
				});

				if (!res.ok) throw new Error('Ollama failed');

				const data = await res.json();
				conversations[chatIdx].messages = [
					...conversations[chatIdx].messages,
					{ role: 'assistant', content: data.response }
				];
				conversations[chatIdx].model = selectedModel;
				conversations[chatIdx].timestamp = Date.now();
				save();
			} catch (err) {
				conversations[chatIdx].messages = [
					...conversations[chatIdx].messages,
					{ role: 'assistant', content: '⚠️ Gagal terhubung ke Ollama.' }
				];
			} finally {
				isLoading = false;
			}
		},
		async deleteMessage(index) {
			const chatIdx = conversations.findIndex(c => c.id === currentConversationId);
			if (chatIdx === -1) return;
			conversations[chatIdx].messages.splice(index, 1);
			save();
		},
		async editMessage(index, newContent) {
			const chatIdx = conversations.findIndex(c => c.id === currentConversationId);
			if (chatIdx === -1) return;
			
			// Hapus pesan ini dan semua setelahnya agar bisa dikirim ulang
			conversations[chatIdx].messages = conversations[chatIdx].messages.slice(0, index);
			this.sendMessage(newContent);
		},
		async regenerateLastAI() {
			const chatIdx = conversations.findIndex(c => c.id === currentConversationId);
			if (chatIdx === -1) return;
			
			const lastMessages = conversations[chatIdx].messages;
			// Cari pesan user terakhir
			for (let i = lastMessages.length - 1; i >= 0; i--) {
				if (lastMessages[i].role === 'user') {
					const prompt = lastMessages[i].content;
					// Hapus pesan AI di bawahnya jika ada
					conversations[chatIdx].messages = lastMessages.slice(0, i + 1);
					this.sendMessage(prompt, true);
					break;
				}
			}
		},
		init,
		createNewChat,
		save,
		fetchModels,
		checkServerStatus
	};
}
