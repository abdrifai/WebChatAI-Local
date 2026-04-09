# Rencana Implementasi: Fitur "Buka File Referensi RAG"

Memungkinkan pengguna untuk langsung membuka file asli (PDF, DOCX, XLSX, dll) yang dijadikan referensi oleh AI pada Knowledge Base lokal dengan mengkliknya di layar *chat*.

## Masalah Saat Ini
Sistem RAG kita hanya mengekstrak `text` atau tulisan dari file sewaktu diunggah, lalu menyimpannya dalam `vector_store.json`. File aslinya **tidak disimpan** di database atau folder server lokal, sehingga kita tidak bisa menyediakan *link* atau tautan untuk melihat ulang file-file tersebut. 

## Rencana Penyelesaian

Agar fitur *preview*/buka dokumen dapat berjalan, kita perlu menyetel agar *Local Server* menyimpan fisik filenya, kemudian menyambungkan UI agar menghasilkan tautan ke file yang tersimpan tersebut.

### Langkah 1: Modifikasi Endpoint Unggah File (Backend)
**File**: `src/routes/api/rag/ingest/+server.js`
- **Action**: Perbarui fungsi *upload*. Setelah file berhasil diekstrak teksnya, tambahkan fungsi Node.js (seperti `fs.writeFileSync`) untuk menyimpan wujud fisik file tersebut ke folder publik `static/uploads/`.
- **Note**: Modifikasi logika penamaan file jika perlu (misal memakai `Date.now()`) untuk menghindari nama file ganda/tertimpa. 

### Langkah 2: Merubah Endpoint Penghapusan File (Backend)
**File**: `src/routes/api/rag/knowledge/+server.js`
- **Action**: Saat pengguna menekan ikon tempat sampah di Manajer Knowledge Base, buat endpoint baru agar tidak hanya menghapus vektor dari JSON, tapi juga memerintahkan Node.js menelusuri folder `static/uploads/` dan menghapus file fisiknya menggunakan `fs.unlinkSync`.

### Langkah 3: Meng-upgrade UI Manajemen Dokumen
**File**: `src/lib/components/KnowledgeManager.svelte`
- **Action**: Pada *Daftar Dokumen*, ubah teks nama dokumen menjadi tautan / *hyperlink* `<a href="...">` dengan target ke arah `/uploads/nama_file`. 

### Langkah 4: Memperbarui Kartu Referensi di Balon Pesan (Frontend)
**File**: `src/lib/components/MessageBubble.svelte`
- **Action**: Pada bagian *Blue Card* (Kartu Biru Muda) referensi, bungkus setiap *badge* sumber dokumen menjadi tag `<a>` alih-alih `<div>`.
- **Contoh Perubahan**:
  ```svelte
  <a href="/uploads/{source}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-800 ...">
      <!-- Icon PDF / Doc -->
      {source}
  </a>
  ```

## Timeline / Prioritas
Implementasinya tergolong mudah hingga menengah (estimasi waktu pengerjaan cepat).
- Backend (Penyimpanan Fisik + Hapus Fisik)
- Frontend (Penyisipan Link)

---
*Silakan dipelajari di Github/Visual Studio Code. Instruksikan AI untuk menjalankan `issue.md` ini kapan pun Anda siap melakukan implementasi.*
