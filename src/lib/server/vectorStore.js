import fs from 'fs';
import path from 'path';

const STORE_PATH = path.resolve('vector_store.json');

/**
 * @typedef {Object} VectorEntry
 * @property {string} id
 * @property {string} fileName
 * @property {string} content
 * @property {number[]} embedding
 * @property {Object} metadata
 */

/** @type {VectorEntry[]} */
let vectorStore = [];

/**
 * Load vector store from local JSON file
 */
export function loadVectorStore() {
    if (fs.existsSync(STORE_PATH)) {
        try {
            const data = fs.readFileSync(STORE_PATH, 'utf-8');
            vectorStore = JSON.parse(data);
        } catch (err) {
            console.error('Failed to load vector store:', err);
            vectorStore = [];
        }
    }
}

/**
 * Save current vector store to local JSON file
 */
export function saveVectorStore() {
    try {
        fs.writeFileSync(STORE_PATH, JSON.stringify(vectorStore, null, 2));
    } catch (err) {
        console.error('Failed to save vector store:', err);
    }
}

/**
 * Add entries to the vector store
 * @param {VectorEntry[]} entries 
 */
export function addEntries(entries) {
    loadVectorStore();
    vectorStore = [...vectorStore, ...entries];
    saveVectorStore();
}

/**
 * Get all unique documents in the store
 */
export function getDocuments() {
    loadVectorStore();
    const docs = new Set();
    vectorStore.forEach(entry => docs.add(entry.fileName));
    return Array.from(docs).map(name => ({ name }));
}

/**
 * Delete all entries for a specific document
 * @param {string} fileName 
 */
export function deleteDocument(fileName) {
    loadVectorStore();
    vectorStore = vectorStore.filter(entry => entry.fileName !== fileName);
    saveVectorStore();
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 */
export function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Split text into chunks
 * @param {string} text 
 * @param {number} chunkSize 
 * @param {number} overlap 
 */
export function chunkText(text, chunkSize = 500, overlap = 50) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += chunkSize - overlap;
    }
    return chunks;
}

/**
 * Search for most similar chunks
 * @param {number[]} queryEmbedding 
 * @param {number} topK 
 */
export function searchSimilar(queryEmbedding, topK = 3) {
    loadVectorStore();
    const results = vectorStore.map(entry => ({
        ...entry,
        similarity: cosineSimilarity(queryEmbedding, entry.embedding)
    }));

    return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
}
