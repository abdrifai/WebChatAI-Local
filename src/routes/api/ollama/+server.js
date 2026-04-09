import { json } from '@sveltejs/kit';
import { exec } from 'child_process';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(2000) });
		if (res.ok) {
			return json({ status: 'online' });
		}
		return json({ status: 'offline' });
	} catch (err) {
		return json({ status: 'offline' });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST() {
	try {
		// Menjalankan ollama serve dengan CORS terpasang
		// Kita menggunakan nohup agar proses tetap berjalan setelah request selesai di Mac/Linux
		const command = 'OLLAMA_ORIGINS="http://localhost:5173" nohup ollama serve > /dev/null 2>&1 &';

		exec(command, (error) => {
			if (error) {
				console.error(`Exec error: ${error}`);
			}
		});

		return json({ success: true, message: 'Mencoba menjalankan server Ollama...' });
	} catch (err) {
		return json({ success: false, error: err.message }, { status: 500 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE() {
	try {
		// Menghentikan semua proses ollama serve yang berjalan
		const command = 'pkill -f "ollama serve"';

		exec(command, (error) => {
			if (error) {
				console.error(`Exec error: ${error}`);
			}
		});

		return json({ success: true, message: 'Mengirim perintah untuk mematikan server...' });
	} catch (err) {
		return json({ success: false, error: err.message }, { status: 500 });
	}
}
