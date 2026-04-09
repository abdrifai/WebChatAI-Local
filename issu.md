# Rencana Implementasi RAG (Knowledge Base Lokal) - Fitur Dokumen Pribadi

## Objektif

Menambahkan fitur _Knowledge Base (Retrieval-Augmented Generation / RAG)_ pada Chat-UI (Ollama lokal). Pengguna dapat mengunggah berbagai format dokumen untuk menjadi basis pengetahuan tambahan (_context constraints_) bagi AI saat menjawab pertanyaan di chat manager. Prosesnya 100% _offline/lokal_.

## Teknologi & Pendekatan

1. **Penyimpanan Vector Sederhana**: Menggunakan `vector_store.json` sebagai tempat persisten menampung _text chunks_ (potongan teks) dan vektor matematis (_Embeddings_). Menghindari database tambahan agar ringan.
2. **Kalkulasi Kemiripan**: Mencari kecocokan pertanyaan user dengan isi dokumen menggunakan perhitungan matematis Cosine Similarity dengan JavaScript murni.
3. **Embedding**: Menggunakan endpoint Ollama (`/api/embeddings`) dengan model khusus ukuran kecil yang direkomendasikan seperti `nomic-embed-text`.
4. **Library Parser Tambahan**:
   - `pdf-parse`: untuk mengekstrak format `.pdf`
   - `mammoth`: untuk mengekstrak format dokumen Word (`.docx`)
   - `xlsx` (SheetJS): untuk membaca/ekstrak format file Excel (`.xlsx`, `.xls`) dan `.csv`
   - Format standar (`.txt`, `.md`) akan dibaca sebagai plain-text standar.

---

## Task & Proposed Implementations

### 1. Kebutuhan Package Tambahan

```bash
npm install pdf-parse mammoth xlsx
```

### 2. Backend & Penyimpanan Vektor

- **File Baru: `src/lib/server/vectorStore.js`**
  Membuat sistem _Read/Write_ lokal untuk penyimpanan JSON. File ini akan memiliki fungsi:
  - `saveVectorStore()` dan `loadVectorStore()` untuk persistensi data.
  - `cosineSimilarity()` untuk rumus pencarian.
  - `chunkText(text, size, overlap)` untuk memotong-motong file PDF, Docx, atau teks menjadi beberapa bagian (misalnya per 500 karakter).

### 3. API Endpoints

- **File Baru: `src/routes/api/rag/ingest/+server.js` (POST)**
  Menerima Upload file, membaca ekstensi, menggunakan parser yang relevan (`pdf-parse`, `mammoth`, atau `xlsx`), merubahnya jadi chunks teks, lalu mengirimnya ke model `nomic-embed-text` untuk dirubah jadi Embeddings, lalu menyimpannya ke `vector_store.json`.
- **File Baru: `src/routes/api/rag/knowledge/+server.js` (GET & DELETE)**
  - `GET`: Menampilkan _list_ / daftar nama file yang sukses masuk _Knowledge Base_.
  - `DELETE`: Menghapus data Vector _Chunks_ dokumen tertentu dari memori jika dirasa datanya usang/salah.
- **File Baru: `src/routes/api/rag/search/+server.js` (POST)**
  Menerima `prompt` pengguna di chat, dirubah jadi Embeddings (vector), lalu membandingkan vector _prompt_ ini dangan vector dokumen kita, kemudian mengembalikan 3 s/d 5 kalimat / teks (chunks) teratas yang paling mendekati kalimat prompt.

### 4. Modifikasi Alur Chat (Svelte Store / Chat UI)

- **Modifikasi: `src/lib/chat.svelte.js`**
  Sebelum mengirim pertanyaan `sendMessage()` ke Ollama Text Generation API (`/api/generate`), pertama akan menembak ke endpoint search `POST /api/rag/search`.
  Apabila mendapatkan hasil _Knowledge Base_, tambahkan prompt tersembunyi:
  `"Berdasarkan informasi berikut:\n[Konteks dari Search DB Lokal]\n\nJawab pertanyaan: [Pertanyaan asli pengguna]"`

### 5. Frontend & Antarmuka Manajer

- **Modifikasi Utama: Navigasi Sidebar/Menu**
  Penambahan opsi navigasi bagi pengguna untuk mengakses "Kelola Knowledge Base".
- **File Baru: `src/lib/components/KnowledgeManager.svelte`**
  (Drawer / Modal / Halaman Khusus)
  Menampilkan tabel daftar dokumen (dari Endpoint `GET`).
  - Memiliki fitur "Upload Data Baru".
  - Memiliki tombol keranjang sampah "Hapus".

---

## Verifikasi

1. Instalasi Npm package (`pdf-parse`, `mammoth`, `xlsx`).
2. Proses memastikan Ollama telah di-_pull_ `nomic-embed-text`.
3. Upload 1 File PDF, 1 File Excel, dan 1 File Word berisi informasi sangat spesifik yang tidak mungkin ada di luar internet.
4. Lakukan chat standar ("Informasi X ini dapat di mana?").
5. Validasi bahwa AI mampu menjawab sempurna mematuhi _context string_ dari file khusus tersebut.
