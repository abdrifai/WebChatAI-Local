# Rencana Implementasi: Indikator Sumber Knowledge Base (RAG)

Dokumen ini berisi panduan *step-by-step* yang dirancang **sangat spesifik agar mudah diikuti oleh Junior Programmer atau AI Assistant**. 

Tujuannya adalah menggabungkan 3 pendekatan sekaligus:
1. **Instruksi Penggunaan**: AI dipaksa mengakui menggunakan dokumen.
2. **Sitasi**: AI dipaksa menyebut nama file.
3. **UI Visual**: Muncul *badge* atau penanda di pesan AI jika konteks dokumen digunakan.

Ikuti tiga langkah di bawah ini secara berurutan.

---

## Langkah 1: Modifikasi Logika Chat (`chat.svelte.js`)
**File yang diubah**: `src/lib/chat.svelte.js`

1. Cari fungsi `sendMessage(userContent, isResend = false)` di sekitar baris 133+.
2. Tambahkan variabel penanda (flag) di dalam fungsi tersebut, tepat sebelum logik `if (isRagActive)`.
```javascript
            let prompt = userContent;
            let usedRagContext = false; // Tambahkan baris ini
```

3. Ganti blok `// RAG Logic` yang lama dengan kode berikut ini. Kode ini merubah struktur prompt agar menyertakan nama file (*sitasi*) dan memaksa AI agar merespon dengan format yang rapi.
```javascript
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
							usedRagContext = true; // Tandai bahwa dokumen berhasil ditemukan
							
							// Membungkus format dengan mencantumkan nama file
							const context = results.map((r, idx) => `[Sumber ${idx+1}: ${r.fileName}]\n${r.content}`).join('\n---\n');
							
							prompt = `Anda adalah asisten AI pintar. Gunakan informasi dokumen berikut sebagai referensi utama Anda.

PENTING:
1. Anda WAJIB memulai jawaban Anda dengan frasa "[Berdasarkan Dokumen Local]".
2. Di akhir jawaban Anda, tuliskan daftar nama file dokumen yang Anda kutip.
3. Jika informasi tidak ada di dokumen, Anda boleh menjawab dengan pengetahuan Anda tetapi tulis "Sesuai pengetahuan umum saya, ...".

DOKUMEN REFERENSI:
${context}

---
PERTANYAAN PENGGUNA: ${userContent}`;
						}
					}
				} catch (err) {
					console.error('RAG search failed:', err);
				}
			}
```

4. Cari tempat di mana pesan Assistant/AI disimpan (di dalam blok `try` saat memanggil *Ollama /api/generate*). Tambahkan parameter `usedRag`:
```javascript
				const data = await res.json();
				conversations[chatIdx].messages = [
					...conversations[chatIdx].messages,
					// Ubah baris ini dengan menambahkan property usedRag
					{ role: 'assistant', content: data.response, usedRag: usedRagContext }
				];
```

---

## Langkah 2: Tambahkan UI Tanda Baca (`MessageBubble.svelte`)
**File yang diubah**: `src/lib/components/MessageBubble.svelte` (atau komponen di mana pesan AI di-_render_)

Tujuan langkah ini adalah memberikan tanda secara grafis bahwa respons AI menggunakan database Anda.

1. Buka file rendering pesan. Pastikan komponen menerima object pesan (contoh: `export let message;` atau `let { message } = $props();`).
2. Cari bagian kode HTML letak komponen *bubble* pesan milik Assistant/AI. Di bagian header balasan (misal di bawah label "AI" atau di dalam bubble balasan), tambahkan kode ini:

```svelte
{#if message.role === 'assistant' && message.usedRag}
    <div class="inline-flex items-center gap-1.5 px-2 py-1 mb-2 text-[10px] font-bold text-emerald-700 bg-emerald-100/50 border border-emerald-200 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
        TERHUBUNG DENGAN DOKUMEN (RAG)
    </div>
{/if}
```
*(Catatan: Anda mungkin harus menyesuaikan kelas TailwindCSS-nya sesuai tema gelap/terang Anda)*.

---

## Langkah 3: Verifikasi
Jika Junior Programmer/AI telah menyelesaikan instruksi di atas, pengujian dapat dilakukan dengan:
1. Pastikan RAG di-_toggle_ pada posisi **ON**.
2. Tanya sesuatu tentang isi file.
3. **Hasil yang Diharapkan:**
   - Muncul emblem warna hijau tulisan "TERHUBUNG DENGAN DOKUMEN (RAG)" di pesan AI.
   - Jawaban AI dibuka dengan kalimat `[Berdasarkan Dokumen Local]`.
   - Di bagian akhir, AI membuat semacam footnote berisi *Sumber File*.
