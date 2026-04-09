<script>
	let { chat } = $props();
	let files = $state([]);
	let documents = $state([]);
	let isUploading = $state(false);
	let uploadStatus = $state('');

	async function fetchDocuments() {
		try {
			const res = await fetch('/api/rag/knowledge');
			const data = await res.json();
			documents = data.documents || [];
		} catch (err) {
			console.error('Failed to fetch documents:', err);
		}
	}

	async function handleUpload() {
		if (files.length === 0) return;
		isUploading = true;
		uploadStatus = 'Memproses dokumen...';

		try {
			const formData = new FormData();
			formData.append('file', files[0]);

			const res = await fetch('/api/rag/ingest', {
				method: 'POST',
				body: formData
			});

			const data = await res.json();
			if (res.ok) {
				uploadStatus = 'Berhasil diunggah!';
				files = [];
				fetchDocuments();
			} else {
				uploadStatus = `Gagal: ${data.error}`;
			}
		} catch (err) {
			uploadStatus = `Error: ${err.message}`;
		} finally {
			isUploading = false;
			setTimeout(() => { uploadStatus = ''; }, 3000);
		}
	}

	async function handleDelete(fileName) {
		if (!confirm(`Hapus ${fileName}?`)) return;
		try {
			const res = await fetch('/api/rag/knowledge', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileName })
			});
			if (res.ok) {
				fetchDocuments();
			}
		} catch (err) {
			console.error('Delete failed:', err);
		}
	}

	import { onMount } from 'svelte';
	onMount(fetchDocuments);
</script>

{#if chat.isKnowledgeManagerOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={(e) => { if (e.target === e.currentTarget) chat.isKnowledgeManagerOpen = false; }}>
		<div class="modal-content">
			<div class="header">
				<h2>Manajer Knowledge Base</h2>
				<button class="close-btn" onclick={() => (chat.isKnowledgeManagerOpen = false)} aria-label="Tutup manajer">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				</button>
			</div>

			<div class="upload-section">
				<h3>Unggah Dokumen</h3>
				<p class="subtitle">Dukung PDF, DOCX, XLSX, TXT, MD. Data akan diolah secara lokal.</p>
				<div class="input-group">
					<input type="file" onchange={(e) => files = Array.from(e.target.files)} disabled={isUploading} accept=".pdf,.docx,.xlsx,.txt,.md" />
					<button class="primary-btn" onclick={handleUpload} disabled={isUploading || files.length === 0}>
						{isUploading ? 'Menyimpan...' : 'Unggah'}
					</button>
				</div>
				{#if uploadStatus}
					<p class="status-msg">{uploadStatus}</p>
				{/if}
			</div>

			<div class="docs-list">
				<h3>Daftar Dokumen ({documents.length})</h3>
				{#if documents.length === 0}
					<p class="empty-msg">Belum ada dokumen. Unggah dokumen untuk mulai menggunakan RAG.</p>
				{:else}
					<div class="table-wrapper">
						<table>
							<thead>
								<tr>
									<th>Nama File</th>
									<th width="80">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{#each documents as doc}
									<tr>
										<td>{doc.name}</td>
										<td>
											<button class="delete-btn" onclick={() => handleDelete(doc.name)} aria-label="Hapus dokumen">
												<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>

			<div class="rag-toggle">
				<label class="switch">
					<input type="checkbox" bind:checked={chat.isRagActive} />
					<span class="slider"></span>
				</label>
				<span>Gunakan Knowledge Base saat chat (RAG)</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		width: 90%;
		max-width: 600px;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 24px;
		color: #1e293b;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		border-bottom: 1px solid #f1f5f9;
		padding-bottom: 16px;
	}

	.header h2 { margin: 0; font-size: 1.5rem; background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }

	.close-btn { background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.2s; }
	.close-btn:hover { background: #f1f5f9; color: #1e293b; }

	.upload-section { margin-bottom: 32px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; }
	.upload-section h3 { margin-top: 0; margin-bottom: 8px; font-size: 1rem; color: #334155; }
	.subtitle { font-size: 0.85rem; color: #64748b; margin-bottom: 16px; }

	.input-group { display: flex; gap: 12px; }
	input[type="file"] { flex: 1; font-size: 0.9rem; padding: 8px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; color: #475569; }

	.primary-btn { padding: 8px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
	.primary-btn:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); }
	.primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

	.status-msg { margin-top: 12px; font-size: 0.85rem; color: #a855f7; }

	.docs-list h3 { font-size: 1rem; margin-bottom: 16px; color: #334155; }
	.empty-msg { font-size: 0.9rem; color: #64748b; text-align: center; padding: 20px; }

	.table-wrapper { max-height: 250px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px; background: white; }
	table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
	th { text-align: left; padding: 12px; background: #f8fafc; color: #64748b; font-weight: 600; position: sticky; top: 0; }
	td { padding: 12px; border-top: 1px solid #f1f5f9; color: #475569; }

	.delete-btn { background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.7; transition: all 0.2s; }
	.delete-btn:hover { opacity: 1; transform: scale(1.1); }

	.rag-toggle { display: flex; align-items: center; gap: 12px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #f1f5f9; font-size: 0.95rem; color: #475569; }

	/* Switch component */
	.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
	.switch input { opacity: 0; width: 0; height: 0; }
	.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e2e8f0; transition: .4s; border-radius: 24px; }
	.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
	input:checked + .slider { background-color: #6366f1; }
	input:checked + .slider:before { transform: translateX(20px); }
</style>
