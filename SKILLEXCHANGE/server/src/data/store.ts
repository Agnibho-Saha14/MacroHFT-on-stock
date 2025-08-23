export type Skill = {
	id: string
	title: string
	description: string
	priceCents: number
	seller: string
	createdAt: number
}

export type Order = {
	id: string
	skillId: string
	buyer: string
	amountCents: number
	createdAt: number
}

const skills: Skill[] = []
const orders: Order[] = []

function generateId(prefix: string = 'id'): string {
	return `${prefix}_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36)}`
}

export const store = {
	listSkills(): Skill[] { return skills.slice().sort((a,b)=>b.createdAt-a.createdAt) },
	getSkill(id: string): Skill | undefined { return skills.find(s => s.id === id) },
	createSkill(input: Omit<Skill,'id'|'createdAt'>): Skill {
		const skill: Skill = { id: generateId('skill'), createdAt: Date.now(), ...input }
		skills.push(skill)
		return skill
	},
	updateSkill(id: string, input: Partial<Omit<Skill,'id'|'createdAt'>>): Skill | undefined {
		const idx = skills.findIndex(s => s.id === id)
		if (idx === -1) return undefined
		skills[idx] = { ...skills[idx], ...input }
		return skills[idx]
	},
	deleteSkill(id: string): boolean {
		const idx = skills.findIndex(s => s.id === id)
		if (idx === -1) return false
		skills.splice(idx,1)
		return true
	},
	listOrders(): Order[] { return orders.slice().sort((a,b)=>b.createdAt-a.createdAt) },
	createOrder(input: Omit<Order,'id'|'createdAt'>): Order {
		const order: Order = { id: generateId('order'), createdAt: Date.now(), ...input }
		orders.push(order)
		return order
	}
}