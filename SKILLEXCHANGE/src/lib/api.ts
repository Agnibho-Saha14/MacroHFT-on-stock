const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function postJSON<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})
	if (!res.ok) throw new Error(await res.text())
	return res.json()
}