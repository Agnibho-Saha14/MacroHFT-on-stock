const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export type Skill = {
	id: string
	title: string
	description: string
	priceCents: number
	seller: string
	createdAt: number
}

export async function fetchSkills(): Promise<Skill[]> {
	const res = await fetch(`${API_URL}/api/skills`)
	if (!res.ok) throw new Error('Failed to fetch skills')
	return res.json()
}

export async function createSkill(input: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
	const res = await fetch(`${API_URL}/api/skills`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(input)
	})
	if (!res.ok) throw new Error('Failed to create skill')
	return res.json()
}

export async function createOrderForSkill(skillId: string, buyer: string): Promise<{ order: any; checkoutSessionId: string }> {
	const res = await fetch(`${API_URL}/api/orders`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ skillId, buyer, createCheckout: true })
	})
	if (!res.ok) throw new Error('Failed to create order')
	return res.json()
}