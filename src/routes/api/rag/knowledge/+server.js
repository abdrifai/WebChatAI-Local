import { json } from '@sveltejs/kit';
import { getDocuments, deleteDocument } from '$lib/server/vectorStore';

export async function GET() {
    try {
        const documents = getDocuments();
        return json({ documents });
    } catch (err) {
        return json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    try {
        const { fileName } = await request.json();
        if (!fileName) {
            return json({ error: 'Filename is required' }, { status: 400 });
        }
        deleteDocument(fileName);
        return json({ message: `Document ${fileName} deleted successfully` });
    } catch (err) {
        return json({ error: err.message }, { status: 500 });
    }
}
