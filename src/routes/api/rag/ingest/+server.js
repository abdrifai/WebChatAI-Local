import { json } from '@sveltejs/kit';
import { chunkText, addEntries } from '$lib/server/vectorStore';
import pdf from 'pdf-parse-fork';
import mammoth from 'mammoth';
import * as xlsx from 'xlsx';

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = '';
        const fileName = file.name;
        const extension = fileName.split('.').pop().toLowerCase();

        // 1. Extract text based on file type
        if (extension === 'pdf') {
            const data = await pdf(buffer);
            text = data.text;
        } else if (extension === 'docx') {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            text = workbook.SheetNames.map(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                return xlsx.utils.sheet_to_txt(sheet);
            }).join('\n');
        } else if (['txt', 'md', 'js', 'json'].includes(extension)) {
            text = buffer.toString('utf-8');
        } else {
            return json({ error: 'Unsupported file type' }, { status: 400 });
        }

        if (!text.trim()) {
            return json({ error: 'Document is empty' }, { status: 400 });
        }

        // 2. Chunk text
        const chunks = chunkText(text);

        // 3. Get embeddings from Ollama
        const entries = [];
        for (const chunk of chunks) {
            const res = await fetch('http://localhost:11434/api/embeddings', {
                method: 'POST',
                body: JSON.stringify({
                    model: 'nomic-embed-text',
                    prompt: chunk
                })
            });

            if (!res.ok) {
                throw new Error('Failed to get embeddings from Ollama. Make sure you have pulled nomic-embed-text.');
            }

            const { embedding } = await res.json();
            entries.push({
                id: crypto.randomUUID(),
                fileName,
                content: chunk,
                embedding,
                metadata: { timestamp: Date.now() }
            });
        }

        // 4. Save to store
        addEntries(entries);

        return json({ message: 'Document ingested successfully', fileName });
    } catch (err) {
        console.error('Ingest error:', err);
        return json({ error: err.message }, { status: 500 });
    }
}
