import { json } from '@sveltejs/kit';
import { searchSimilar } from '$lib/server/vectorStore';

export async function POST({ request }) {
    try {
        const { prompt, topK = 3 } = await request.json();

        if (!prompt) {
            return json({ error: 'Prompt is required' }, { status: 400 });
        }

        // 1. Get embedding for the prompt
        const res = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            body: JSON.stringify({
                model: 'nomic-embed-text',
                prompt: prompt
            })
        });

        if (!res.ok) {
            throw new Error('Failed to get embeddings for search. Make sure you have pulled nomic-embed-text.');
        }

        const { embedding } = await res.json();

        // 2. Search similar chunks
        const results = searchSimilar(embedding, topK);

        return json({ results });
    } catch (err) {
        console.error('Search error:', err);
        return json({ error: err.message }, { status: 500 });
    }
}
