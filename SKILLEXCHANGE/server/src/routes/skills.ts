import { Router } from 'express'
import { store } from '../data/store'

export const skillsRouter = Router()

skillsRouter.get('/', (_req, res) => {
	res.json(store.listSkills())
})

skillsRouter.get('/:id', (req, res) => {
	const skill = store.getSkill(req.params.id)
	if (!skill) return res.status(404).json({ error: 'Not found' })
	res.json(skill)
})

skillsRouter.post('/', (req, res) => {
	const { title, description, priceCents, seller } = req.body || {}
	if (!title || !description || !priceCents || !seller) return res.status(400).json({ error: 'Missing fields' })
	const skill = store.createSkill({ title, description, priceCents, seller })
	res.status(201).json(skill)
})

skillsRouter.put('/:id', (req, res) => {
	const updated = store.updateSkill(req.params.id, req.body || {})
	if (!updated) return res.status(404).json({ error: 'Not found' })
	res.json(updated)
})

skillsRouter.delete('/:id', (req, res) => {
	const ok = store.deleteSkill(req.params.id)
	if (!ok) return res.status(404).json({ error: 'Not found' })
	res.status(204).end()
})